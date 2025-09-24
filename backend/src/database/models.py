from sqlalchemy import Column, Integer, String, DateTime, create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

engine = create_engine("sqlite:///database.db", echo=True)
Base = declarative_base()

class Judges(Base):
    __tablename__ = "Judges"

    id = Column(Integer, primary_key=True)
    judge = Column(String, unique=True, nullable=False)


class Times(Base):
    __tablename__ = "Times"

    id = Column(Integer, primary_key=True)
    judge_id = Column(Integer, nullable=False)
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

 