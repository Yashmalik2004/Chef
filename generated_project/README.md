# Simple Calculator Web App

## Brief Description
A lightweight, browser‑based calculator that performs basic arithmetic operations. It runs entirely on the client side using plain HTML, CSS, and JavaScript—no backend or external libraries required.

## Tech Stack
- **HTML5** – Structure and layout
- **CSS3** – Styling and responsive design
- **JavaScript (ES6)** – Core calculator logic and UI interaction

---

## Setup Instructions
1. **Clone the repository**
   ```bash
   git clone <repository‑url>
   cd <repository‑folder>
   ```
2. **Open the application**
   - Locate the `index.html` file in the project root.
   - Double‑click it or open it with a web browser (Chrome, Firefox, Edge, Safari, etc.).
   - No server or build step is required; the app runs directly in the browser.

---

## Usage Guide
### Button Layout
| Row | Buttons |
|-----|----------|
| 1 | `C` (Clear), `←` (Backspace), `%`, `/` |
| 2 | `7`, `8`, `9`, `*` |
| 3 | `4`, `5`, `6`, `-` |
| 4 | `1`, `2`, `3`, `+` |
| 5 | `0`, `.`, `=` |

- **Display** – Shows the current expression and the result after pressing `=`.

### Keyboard Shortcuts
| Key | Action |
|-----|--------|
| `0`‑`9` | Enter numbers |
| `.` | Decimal point |
| `+`, `-`, `*`, `/` | Arithmetic operators |
| `Enter` or `=` | Evaluate expression |
| `Backspace` | Delete the last character (same as the `←` button) |
| `Escape` | Clear the entire input (same as the `C` button) |

### Clear / Backspace Behavior
- **Clear (`C` / `Escape`)** – Resets the entire expression and display.
- **Backspace (`←` / `Backspace`)** – Removes the last character entered, allowing quick corrections without wiping the whole expression.

---

## Screenshot
![Calculator Screenshot Placeholder](./screenshot.png)
> *Replace `screenshot.png` with an actual screenshot of the calculator UI.*

---

## Responsive Design
The calculator layout uses flexible CSS grid and media queries, ensuring it looks good on both desktop monitors and mobile devices. Buttons scale appropriately, and the display remains readable on smaller screens.

---

## Future Improvements
- **Scientific Functions** – Add trigonometric, logarithmic, and exponential operations.
- **History Panel** – Store and display past calculations.
- **Theme Switcher** – Light/Dark mode toggle.
- **Keyboard Accessibility** – Full ARIA support for screen readers.
- **Unit Tests** – Automated testing of calculation logic.

---

*This project is intentionally simple to demonstrate core web development concepts without external dependencies.*
