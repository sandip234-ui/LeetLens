import os
import glob
import sqlite3
import pandas as pd

# -----------------------------
# PATH CONFIG
# -----------------------------

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

CSV_FOLDER = os.path.join(BASE_DIR, "../data/raw_csvs")
DB_PATH = os.path.join(BASE_DIR, "../data/leetlens.db")

# -----------------------------
# CONNECT TO SQLITE
# -----------------------------

conn = sqlite3.connect(DB_PATH)

# -----------------------------
# GET ALL CSV FILES
# -----------------------------

csv_files = glob.glob(os.path.join(CSV_FOLDER, "*.csv"))

print(f"\nFound {len(csv_files)} CSV files\n")

all_dataframes = []

# -----------------------------
# PROCESS EACH CSV
# -----------------------------

for file_path in csv_files:
    try:
        # Example:
        # google_1year.csv
        file_name = os.path.basename(file_path).replace(".csv", "")

        # Split filename
        parts = file_name.rsplit("_", 1)

        # Handle malformed filenames
        if len(parts) != 2:
            print(f"Skipping invalid filename: {file_name}")
            continue

        company = parts[0]
        timeframe = parts[1]

        # Read CSV
        df = pd.read_csv(file_path)

        # Normalize column names
        df.columns = [col.strip().lower().replace(" ", "_") for col in df.columns]

        # Add metadata columns
        df["company"] = company
        df["timeframe"] = timeframe

        # Rename columns for consistency
        rename_map = {
            "id": "question_id",
            "title": "title",
            "acceptance": "acceptance",
            "difficulty": "difficulty",
            "frequency": "frequency",
            "leetcode_question_link": "link"
        }

        df = df.rename(columns=rename_map)

        # Keep only required columns
        required_columns = [
            "question_id",
            "title",
            "acceptance",
            "difficulty",
            "frequency",
            "link",
            "company",
            "timeframe"
        ]

        df = df[required_columns]

        # Remove duplicate rows within file
        df = df.drop_duplicates()

        all_dataframes.append(df)

        print(f"Processed: {file_name}")

    except Exception as e:
        print(f"Error processing {file_path}")
        print(e)
        print("-" * 50)

# -----------------------------
# MERGE ALL DATA
# -----------------------------

master_df = pd.concat(all_dataframes, ignore_index=True)

# -----------------------------
# CLEAN DATA
# -----------------------------

master_df["question_id"] = pd.to_numeric(
    master_df["question_id"],
    errors="coerce"
)

master_df["frequency"] = pd.to_numeric(
    master_df["frequency"],
    errors="coerce"
)

master_df = master_df.dropna(subset=["question_id"])

master_df["question_id"] = master_df["question_id"].astype(int)

# Remove global duplicates
master_df = master_df.drop_duplicates()

# -----------------------------
# SAVE TO SQLITE
# -----------------------------

master_df.to_sql(
    "questions",
    conn,
    if_exists="replace",
    index=False
)

# -----------------------------
# CREATE INDEXES
# -----------------------------

cursor = conn.cursor()

cursor.execute("""
CREATE INDEX IF NOT EXISTS idx_question_id
ON questions(question_id)
""")

cursor.execute("""
CREATE INDEX IF NOT EXISTS idx_title
ON questions(title)
""")

cursor.execute("""
CREATE INDEX IF NOT EXISTS idx_company
ON questions(company)
""")

conn.commit()
conn.close()

# -----------------------------
# FINAL OUTPUT
# -----------------------------

print("\nDatabase created successfully!\n")
print(f"Total Questions: {len(master_df)}")
print(f"Database Location: {DB_PATH}")