from sqlalchemy import Column, Integer, String, DateTime, create_engine, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship


engine = create_engine("sqlite:///database.db", echo=True)
Base = declarative_base()

class Judges(Base):
    __tablename__ = "Judges"

    id = Column(Integer, primary_key=True)
    name = Column(String, unique=True, nullable=False)

    times = relationship("Times", primaryjoin="Judges.id==Times.judge_id")


class Times(Base):
    __tablename__ = "Times"

    id = Column(Integer, primary_key=True)
    judge_id = Column(Integer, ForeignKey("Judges.id"), nullable=False)
    team_name = Column(String, nullable=False)
    start = Column(DateTime, nullable=False)
    end = Column(DateTime, nullable=False)


Base.metadata.create_all(engine)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
db = SessionLocal()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# from datetime import datetime, timedelta

# add = Times(judge_id=1, team_name="VandyHacks", start=datetime.today() - timedelta(hours=2), end=datetime.today())
# db.add(add)
# db.commit()


 