from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.router import api_router
from app.db.base import Base
from app.db.session import engine 
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
import requests

app = FastAPI()
origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,        
    allow_credentials=True,
    allow_methods=["*"],        
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

app.include_router(api_router)

@app.exception_handler(requests.exceptions.RequestException)
async def external_api_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=503,
        content={"detail": "External service unavailable. Please try again later."},
    )


# Handle validation errors like unknown coin
@app.exception_handler(ValueError)
async def value_error_handler(request: Request, exc: ValueError):
    return JSONResponse(
        status_code=400,
        content={"detail": str(exc)},
    )


# Catch-all handler (VERY IMPORTANT)
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error."},
    )

