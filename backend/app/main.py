"""
main.py — FastAPI application entry point for LeetLens.
"""

from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from app.database import get_db
from app.search import (
    search_by_id,
    search_by_title,
    get_question_detail,
    get_all_companies,
    search_with_filters,
    get_top_questions,
)

# -------------------------------------------------------
# App Init
# -------------------------------------------------------
app = FastAPI(
    title="LeetLens API",
    description="Searchable LeetCode company question database",
    version="1.0.0",
)

# -------------------------------------------------------
# CORS — allow the Vite dev server to talk to us
# -------------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
        "http://localhost:5175",
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# -------------------------------------------------------
# Health check
# -------------------------------------------------------
@app.get("/")
def root():
    return {"message": "LeetLens API Running"}


# -------------------------------------------------------
# GET /search?q=<query>
# Optional filters: difficulty, company, timeframe
# -------------------------------------------------------
@app.get("/search")
def search(
    q: str = Query(default="", description="Search by ID or title"),
    difficulty: str = Query(default="", description="Filter by difficulty"),
    company: str = Query(default="", description="Filter by company"),
    timeframe: str = Query(default="", description="Filter by timeframe"),
    limit: int = Query(default=50, le=200),
    db: Session = Depends(get_db),
):
    """
    Smart search endpoint:
    - Numeric query → search by question_id
    - Text query → fuzzy title search
    - Supports optional difficulty / company / timeframe filters
    """
    results = search_with_filters(
        db,
        query=q,
        difficulty=difficulty,
        company=company,
        timeframe=timeframe,
        limit=limit,
    )
    return {"results": results, "count": len(results)}


# -------------------------------------------------------
# GET /question/{id}
# -------------------------------------------------------
@app.get("/question/{question_id}")
def get_question(question_id: int, db: Session = Depends(get_db)):
    """
    Returns full question detail including all companies,
    timeframes, and frequency data.
    """
    detail = get_question_detail(db, question_id)
    if not detail:
        raise HTTPException(status_code=404, detail="Question not found")
    return detail


# -------------------------------------------------------
# GET /companies
# -------------------------------------------------------
@app.get("/companies")
def list_companies(db: Session = Depends(get_db)):
    """Returns all unique company names for filter dropdowns."""
    companies = get_all_companies(db)
    return {"companies": companies}


# -------------------------------------------------------
# GET /top
# -------------------------------------------------------
@app.get("/top")
def top_questions(
    limit: int = Query(default=20, le=100),
    db: Session = Depends(get_db),
):
    """Returns the most-asked questions across all companies."""
    results = get_top_questions(db, limit=limit)
    return {"results": results, "count": len(results)}


# -------------------------------------------------------
# GET /stats
# -------------------------------------------------------
@app.get("/stats")
def get_stats(db: Session = Depends(get_db)):
    """Returns platform-level statistics."""
    from sqlalchemy import func
    from app.models import Question

    total_rows = db.query(func.count(Question.question_id)).scalar()
    unique_questions = db.query(func.count(func.distinct(Question.question_id))).scalar()
    unique_companies = db.query(func.count(func.distinct(Question.company))).scalar()

    return {
        "total_entries": total_rows,
        "unique_questions": unique_questions,
        "unique_companies": unique_companies,
    }
