from pydantic import BaseModel

class DocsUpdateRequest(BaseModel):
    content: str


class DocsResponse(BaseModel):
    status: str
    message: str