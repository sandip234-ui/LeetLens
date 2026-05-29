"""
search.py — Core search logic for LeetLens.

All searches run against SQLite only — no CSV scanning.
"""

from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from app.models import Question


# -------------------------------------------------------
# Helper: build structured company list from rows
# -------------------------------------------------------
def _build_companies(rows: list[Question]) -> list[dict]:
    """
    De-duplicate and aggregate company info from ORM rows.
    Returns a list sorted by frequency descending.
    """
    seen: dict[tuple, dict] = {}
    for row in rows:
        key = (row.company, row.timeframe)
        if key not in seen:
            seen[key] = {
                "company": row.company,
                "timeframe": row.timeframe,
                "frequency": round(row.frequency, 4) if row.frequency else 0.0,
            }
    return sorted(seen.values(), key=lambda x: x["frequency"], reverse=True)


# -------------------------------------------------------
# Helper: convert rows for a given question_id into a
# structured response dict
# -------------------------------------------------------
def _rows_to_question_detail(rows: list[Question]) -> dict | None:
    if not rows:
        return None
    first = rows[0]
    return {
        "question_id": first.question_id,
        "title":       first.title.strip(),
        "difficulty":  first.difficulty,
        "acceptance":  first.acceptance,
        "link":        first.link.strip() if first.link else "",
        "companies":   _build_companies(rows),
        "company_count": len({r.company for r in rows}),
    }


# -------------------------------------------------------
# Search by question_id (numeric)
# -------------------------------------------------------
def search_by_id(db: Session, question_id: int) -> list[dict]:
    rows = (
        db.query(Question)
        .filter(Question.question_id == question_id)
        .all()
    )
    if not rows:
        return []
    detail = _rows_to_question_detail(rows)
    return [detail] if detail else []


# -------------------------------------------------------
# Full-text search by title (case-insensitive LIKE)
# -------------------------------------------------------
def search_by_title(db: Session, query: str, limit: int = 50) -> list[dict]:
    pattern = f"%{query.strip()}%"

    # Get distinct question_ids matching the title pattern
    matching_ids = (
        db.query(Question.question_id)
        .filter(func.lower(Question.title).like(func.lower(pattern)))
        .distinct()
        .all()
    )
    id_list = [r.question_id for r in matching_ids]

    if not id_list:
        return []

    # For each matching question_id, fetch all company rows
    all_rows = (
        db.query(Question)
        .filter(Question.question_id.in_(id_list))
        .all()
    )

    # Group rows by question_id
    grouped: dict[int, list[Question]] = {}
    for row in all_rows:
        grouped.setdefault(row.question_id, []).append(row)

    # Build result list sorted by company_count desc, then question_id asc
    results = []
    for qid in id_list[:limit]:
        rows = grouped.get(qid, [])
        detail = _rows_to_question_detail(rows)
        if detail:
            results.append(detail)

    results.sort(key=lambda x: x["company_count"], reverse=True)
    return results[:limit]


# -------------------------------------------------------
# Get full detail for a single question
# -------------------------------------------------------
def get_question_detail(db: Session, question_id: int) -> dict | None:
    rows = (
        db.query(Question)
        .filter(Question.question_id == question_id)
        .all()
    )
    return _rows_to_question_detail(rows)


# -------------------------------------------------------
# Get list of all unique companies
# -------------------------------------------------------
def get_all_companies(db: Session) -> list[str]:
    rows = db.query(Question.company).distinct().order_by(Question.company).all()
    return [r.company for r in rows]


# -------------------------------------------------------
# Advanced filtered search
# -------------------------------------------------------
def search_with_filters(
    db: Session,
    query: str = "",
    difficulty: str = "",
    company: str = "",
    timeframe: str = "",
    limit: int = 50,
) -> list[dict]:
    """
    Multi-filter search combining optional text query + difficulty +
    company + timeframe filters.
    """
    q = db.query(Question)

    if query.strip():
        if query.strip().isdigit():
            q = q.filter(Question.question_id == int(query.strip()))
        else:
            pattern = f"%{query.strip()}%"
            q = q.filter(func.lower(Question.title).like(func.lower(pattern)))

    if difficulty and difficulty.lower() != "all":
        q = q.filter(func.lower(Question.difficulty) == difficulty.lower())

    if company and company.lower() != "all":
        q = q.filter(func.lower(Question.company) == company.lower())

    if timeframe and timeframe.lower() != "all":
        q = q.filter(func.lower(Question.timeframe) == timeframe.lower())

    all_rows = q.all()

    # Group rows by question_id and build results
    grouped: dict[int, list[Question]] = {}
    for row in all_rows:
        grouped.setdefault(row.question_id, []).append(row)

    results = []
    for qid, rows in grouped.items():
        detail = _rows_to_question_detail(rows)
        if detail:
            results.append(detail)

    results.sort(key=lambda x: x["company_count"], reverse=True)
    return results[:limit]


# -------------------------------------------------------
# Top questions (by unique company count)
# -------------------------------------------------------
def get_top_questions(db: Session, limit: int = 20) -> list[dict]:
    """
    Returns the most frequently asked questions across companies.
    """
    # Subquery: count distinct companies per question_id
    from sqlalchemy import select

    subq = (
        db.query(
            Question.question_id,
            func.count(func.distinct(Question.company)).label("company_count"),
        )
        .group_by(Question.question_id)
        .order_by(desc("company_count"))
        .limit(limit)
        .subquery()
    )

    top_ids = db.query(subq.c.question_id).all()
    id_list = [r.question_id for r in top_ids]

    all_rows = db.query(Question).filter(Question.question_id.in_(id_list)).all()

    grouped: dict[int, list[Question]] = {}
    for row in all_rows:
        grouped.setdefault(row.question_id, []).append(row)

    results = []
    for qid in id_list:
        rows = grouped.get(qid, [])
        detail = _rows_to_question_detail(rows)
        if detail:
            results.append(detail)

    results.sort(key=lambda x: x["company_count"], reverse=True)
    return results
