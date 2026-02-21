from pydantic import BaseModel

class DocsUpdateRequest(BaseModel):
    content: str
    mode: str = "append"


class DocsResponse(BaseModel):
    status: str
    message: str