from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import datetime

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

