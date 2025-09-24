from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime
from pydantic import BaseModel

from ..database.models import get_db
from ..database import models

router = APIRouter()

@router.get("/get-schedules")
async def get_schedules(db: Session = Depends(get_db)):
    
    judges = db.query(models.Judges).all()

    response = []
    for judge in judges:
        response.append({
            "name": judge.name,
            "schedule": [
                {
                    "start": time.start.strftime("%I:%M %p"),
                    "end": time.end.strftime("%I:%M %p"),
                    "color": "#389ec9ff",
                    "teamName": time.team_name
                } for time in judge.times
            ]
        })

    return response

class CreateJudgeRequest(BaseModel):
    name: str

@router.post("/create-judge")
async def create_judge(request: CreateJudgeRequest, db: Session = Depends(get_db)):

    judge_exists = db.query(models.Judges).where(func.lower(models.Judges.name) == request.name.lower().strip()).scalar()
    if judge_exists:
        return { "response": "Error: Judge already exists." }
    
    judge = models.Judges(name=request.name.strip())
    db.add(judge)
    db.commit()

    return { "response": "success" }
