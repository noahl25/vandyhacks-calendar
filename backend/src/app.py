from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .routes import calender

app = FastAPI()

app.add_middleware(
    CORSMiddleware, 
    allow_origins=["*"], # Allow all origins for now to prevent any issues.
    allow_credentials=True, 
    allow_methods=["*"], 
    allow_headers=["*"]
)

app.include_router(calender.router, prefix="/api/calender")