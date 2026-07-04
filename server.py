"""
CHEF AI — FastAPI WebSocket Server
Wraps the existing LangGraph agent pipeline and streams real-time events.
"""

import asyncio
import io
import json
import os
import sys
import threading
import time
import traceback
import zipfile
from contextlib import redirect_stdout
from pathlib import Path
from typing import Optional

import uvicorn
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse

# ── App setup ────────────────────────────────────────────────────────────────
app = FastAPI(title="CHEF AI Server", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

PROJECT_ROOT = Path.cwd() / "generated_project"

# ── Helpers ───────────────────────────────────────────────────────────────────

def get_agent_from_line(line: str) -> Optional[str]:
    """Detect which agent produced a log line."""
    line_lower = line.lower()
    if "planner" in line_lower:
        return "Planner"
    if "architect" in line_lower:
        return "Architect"
    if "coder" in line_lower or "wrote:" in line_lower or "write_file" in line_lower:
        return "Coder"
    return None


def estimate_progress(logs: list[str]) -> tuple[str, int]:
    """Estimate phase and progress % from collected log lines."""
    text = " ".join(logs).lower()

    # Count distinct phases detected
    has_planner = any("planner" in l.lower() for l in logs)
    has_architect = any("architect" in l.lower() for l in logs)
    has_coder = any("coder" in l.lower() or "wrote:" in l.lower() for l in logs)

    if has_coder:
        # Count files written for finer granularity
        files_written = sum(1 for l in logs if "wrote:" in l.lower())
        pct = min(60 + files_written * 3, 95)
        return "Coding", pct
    if has_architect:
        return "Architecting", 32
    if has_planner:
        return "Planning", 15
    return "Initializing", 5


class StreamingCapture(io.TextIOWrapper):
    """Captures stdout writes and forwards them to an async queue."""

    def __init__(self, queue: asyncio.Queue, loop: asyncio.AbstractEventLoop):
        # Use a raw BytesIO as the underlying buffer
        super().__init__(io.BytesIO(), encoding="utf-8", newline="")
        self._queue = queue
        self._loop = loop

    def write(self, s: str) -> int:
        if s and s.strip():
            asyncio.run_coroutine_threadsafe(self._queue.put(s), self._loop)
        return len(s)

    def flush(self):
        pass


# ── WebSocket endpoint ────────────────────────────────────────────────────────

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()

    async def send(payload: dict):
        try:
            await websocket.send_text(json.dumps(payload))
        except Exception:
            pass

    try:
        # Wait for the user's prompt
        raw = await websocket.receive_text()
        data = json.loads(raw)
        user_prompt: str = data.get("prompt", "").strip()

        if not user_prompt:
            await send({"type": "error", "message": "Empty prompt received."})
            return

        await send({"type": "status", "message": "Initializing agents..."})

        loop = asyncio.get_event_loop()
        log_queue: asyncio.Queue = asyncio.Queue()
        all_logs: list[str] = []
        start_time = time.time()

        def run_agent():
            """Run the agent pipeline on a background thread."""
            # Import here so it runs in thread after server is started
            from agent.graph import agent

            original_stdout = sys.stdout
            original_stderr = sys.stderr

            class LineCapture:
                def __init__(self):
                    self.buf = ""

                def write(self, s: str) -> int:
                    if s:
                        self.buf += s
                        while "\n" in self.buf:
                            line, self.buf = self.buf.split("\n", 1)
                            line = line.strip()
                            if line:
                                asyncio.run_coroutine_threadsafe(
                                    log_queue.put(("log", line)), loop
                                )
                    return len(s)

                def flush(self):
                    if self.buf.strip():
                        asyncio.run_coroutine_threadsafe(
                            log_queue.put(("log", self.buf.strip())), loop
                        )
                        self.buf = ""

            capture = LineCapture()
            sys.stdout = capture
            sys.stderr = capture

            try:
                result = agent.invoke(
                    {"user_prompt": user_prompt},
                    {"recursion_limit": 150},
                )
                # Collect file list
                files = []
                if PROJECT_ROOT.exists():
                    files = [
                        str(f.relative_to(PROJECT_ROOT)).replace("\\", "/")
                        for f in PROJECT_ROOT.glob("**/*")
                        if f.is_file()
                    ]

                elapsed = round(time.time() - start_time, 1)
                plan = result.get("plan")
                project_name = plan.name if plan else "Generated Project"

                asyncio.run_coroutine_threadsafe(
                    log_queue.put(
                        (
                            "complete",
                            {
                                "project_name": project_name,
                                "files": files,
                                "elapsed": elapsed,
                            },
                        )
                    ),
                    loop,
                )
            except Exception as e:
                tb = traceback.format_exc()
                asyncio.run_coroutine_threadsafe(
                    log_queue.put(("error", f"{e}\n{tb}")), loop
                )
            finally:
                sys.stdout = original_stdout
                sys.stderr = original_stderr

        # Start the agent thread
        agent_thread = threading.Thread(target=run_agent, daemon=True)
        agent_thread.start()

        # Stream events from the queue
        while True:
            try:
                item = await asyncio.wait_for(log_queue.get(), timeout=0.5)
            except asyncio.TimeoutError:
                if not agent_thread.is_alive():
                    # Thread finished but queue was empty — done
                    break
                # Send a heartbeat keep-alive
                await send({"type": "heartbeat"})
                continue

            kind, payload = item

            if kind == "log":
                all_logs.append(payload)
                agent = get_agent_from_line(payload)
                phase, pct = estimate_progress(all_logs)

                await send(
                    {
                        "type": "log",
                        "agent": agent,
                        "message": payload,
                        "timestamp": int(time.time() * 1000),
                    }
                )
                await send({"type": "progress", "phase": phase, "percent": pct})

            elif kind == "complete":
                await send({"type": "progress", "phase": "Completed", "percent": 100})
                await send({"type": "complete", **payload})
                break

            elif kind == "error":
                await send({"type": "error", "message": str(payload)})
                break

    except WebSocketDisconnect:
        pass
    except Exception as e:
        try:
            await websocket.send_text(
                json.dumps({"type": "error", "message": str(e)})
            )
        except Exception:
            pass


# ── REST endpoints ────────────────────────────────────────────────────────────

@app.get("/files")
async def list_generated_files():
    """List all files in generated_project/."""
    if not PROJECT_ROOT.exists():
        return JSONResponse({"files": []})
    files = [
        str(f.relative_to(PROJECT_ROOT)).replace("\\", "/")
        for f in PROJECT_ROOT.glob("**/*")
        if f.is_file()
    ]
    return JSONResponse({"files": files})


@app.get("/download")
async def download_project():
    """Download generated_project/ as a ZIP archive."""
    if not PROJECT_ROOT.exists():
        return JSONResponse({"error": "No project generated yet."}, status_code=404)

    zip_path = Path.cwd() / "generated_project.zip"
    with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as zf:
        for file in PROJECT_ROOT.glob("**/*"):
            if file.is_file():
                zf.write(file, file.relative_to(PROJECT_ROOT))

    return FileResponse(
        path=str(zip_path),
        filename="generated_project.zip",
        media_type="application/zip",
    )


@app.get("/health")
async def health():
    return {"status": "ok", "service": "CHEF AI"}


# ── Entry point ───────────────────────────────────────────────────────────────

if __name__ == "__main__":
    uvicorn.run("server:app", host="0.0.0.0", port=8000, reload=False)
