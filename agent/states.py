from pydantic import BaseModel, Field

class File(BaseModel):
    path: str = Field(description="The path of the file to be created, e.g. 'src/index.html', 'src/style.css', 'src/app.js', etc")
    purpose: str = Field(description="The purpose of the file to be created, e.g. 'main application logic', 'data processing module', etc")

class Plan(BaseModel):
    name: str = Field(description="The name of the app to be built")
    description: str = Field(description="A oneline description of the app to be built, e.g. 'A web application for managing personal finances")
    techstack: str = Field(description="The tech stack to be used for the app, e.g. 'React', 'python', 'javascript', 'flask', etc")
    features: list[str] = Field(description="A list of features that the app should have, e.g. ['User authentication', 'Data visualization', 'API integration', etc]")
    files: list[File] = Field(description="A list of files that should be created for the app, e.g. ['index.html', 'style.css', 'app.js', etc]")
