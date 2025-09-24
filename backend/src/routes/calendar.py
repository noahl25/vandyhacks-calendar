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

    if request.name == "":
        return { "response": "Error: Name is blank." }

    judge_exists = db.query(models.Judges).where(func.lower(models.Judges.name) == request.name.lower().strip()).scalar()
    if judge_exists:
        return { "response": "Error: Judge already exists." }
    
    judge = models.Judges(name=request.name.strip())
    db.add(judge)
    db.commit()

    return { "response": "success" }

class CreateEventRequest(BaseModel):
    judge_name: str
    team_name: str
    start: str
    end: str

@router.post("/create-event")
async def create_event(request: CreateEventRequest, db: Session = Depends(get_db)):

    overlap = lambda start1, end1, start2, end2: not (end1 < start2 or end2 < start1)
    
    judge = db.query(models.Judges).where(func.lower(models.Judges.name) == request.judge_name.lower().strip()).scalar()

    if not judge:
        return { "response": "Error: Judge does not exist." }

    dt_start = datetime.strptime(request.start, "%I:%M %p")
    dt_end = datetime.strptime(request.end, "%I:%M %p")

    events_overlap = False
    for time in judge.times:
        if overlap(dt_start, dt_end, time.start, time.end):
            events_overlap = True
            break
    
    if events_overlap:
        return { "response": "Error: Already judging in that timeslot." }
    
    if request.team_name in [time.team_name for time in judge.times]:
        return { "response": "Error: Already judging that team." }
    
    time = models.Times(judge_id=judge.id, team_name=request.team_name, start=dt_start, end=dt_end)
    db.add(time)
    db.commit()

    return { "response": "success" }
