from fastapi import APIRouter, UploadFile, File, HTTPException
from app.schemas.docs import DocsUpdateRequest, DocsResponse
from app.services.docs_service import update_docs
from app.services.pdf_service import PDFTextExtractionService

router = APIRouter(prefix="/docs", tags=["Documents"])


@router.post("/update", response_model=DocsResponse)
def update_documents(payload: DocsUpdateRequest):
    update_docs(payload.content)
    return DocsResponse(
        status="success",
        message="Documents updated & indexed successfully"
)


@router.post("/upload", response_model=DocsResponse)
async def upload_document(file: UploadFile = File(...)):
    file_bytes = await file.read()
    filename = file.filename.lower()

    try:
        if filename.endswith(".pdf"):
            text = PDFTextExtractionService.extract_text(file_bytes)
        else:
            text = file_bytes.decode("utf-8")

    except UnicodeDecodeError:
        raise HTTPException(
            status_code=400,
            detail="Upload UTF-8 text files or PDFs only"
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    update_docs(text)

    return DocsResponse(
        status="success",
        message=f"{file.filename} uploaded, processed & indexed successfully"
    )