from sqlalchemy import Column, Integer, String, Float
from app.database import Base


class Question(Base):
    """
    Mirrors the `questions` table built by build_db.py (pandas to_sql).
    The table has no explicit primary key — we map to SQLite's implicit
    rowid by declaring question_id as the primary key with autoincrement=False.

    NOTE: question_id is NOT unique (same question appears per company/timeframe),
    so we use SQLite's rowid via __mapper_args__ with a synthetic PK trick.
    """
    __tablename__ = "questions"

    # Use a virtual rowid PK — SQLite always has a rowid column
    # We expose it as "rowid" to avoid clashing with the data column.
    rowid       = Column("rowid", Integer, primary_key=True)

    question_id = Column(Integer, nullable=False, index=True)
    title       = Column(String, nullable=False, index=True)
    acceptance  = Column(String)
    difficulty  = Column(String)
    frequency   = Column(Float)
    link        = Column(String)
    company     = Column(String, index=True)
    timeframe   = Column(String)
