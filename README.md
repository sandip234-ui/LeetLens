# 🚀 LeetLens

**LeetLens** is a modern interview intelligence platform that helps developers explore company-wise LeetCode questions, interview trends, and frequency analytics from thousands of interview experiences.

Instead of manually searching through hundreds of CSV files, LeetLens provides a fast and searchable interface powered by FastAPI, SQLite, React, and TailwindCSS.

---

## ✨ Features

### 🔍 Smart Search

* Search by LeetCode question number
* Search by problem title
* Fast SQLite-powered lookups
* Real-time search experience

### 🏢 Company Insights

* View companies that asked a question
* Explore company-wise interview trends
* See frequency data across different time periods

### 📊 Question Analytics

* Difficulty level
* Acceptance rate
* Company count
* Frequency ranking

### ⏳ Timeframe Analysis

* 6 Months
* 1 Year
* 2 Years
* All Time

### 🎨 Modern UI

* Dark mode interface
* Responsive design
* Fast and clean user experience
* Built with React + TailwindCSS

---

## 🛠️ Tech Stack

### Frontend

* React
* Vite
* TailwindCSS
* Axios

### Backend

* FastAPI
* SQLite
* SQLAlchemy
* Pandas

### Database

* SQLite

---

## 📂 Project Structure

```text
LeetLens/
│
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── database.py
│   │   ├── models.py
│   │   ├── search.py
│   │   └── build_db.py
│   │
│   ├── data/
│   │   └── leetlens.db
│   │
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── ...
│
├── README.md
└── .gitignore
```

---

## 📈 Dataset Statistics

Current database contains approximately:

* 📚 1,446 Unique LeetCode Questions
* 🏢 200+ Companies
* 📄 20,000+ Question Records

Companies include:

* Google
* Amazon
* Meta
* Microsoft
* Apple
* Uber
* Bloomberg
* LinkedIn
* Adobe
* Salesforce

and many more.

---

## 🚀 Getting Started

### Clone Repository

```bash
git clone https://github.com/yourusername/leetlens.git

cd leetlens
```

---

### Backend Setup

```bash
cd backend

python -m venv venv

source venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Run FastAPI:

```bash
uvicorn app.main:app --reload
```

Backend will run at:

```text
http://127.0.0.1:8000
```

API Documentation:

```text
http://127.0.0.1:8000/docs
```

---

### Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

Frontend will run at:

```text
http://localhost:5173
```

---

## 🔍 Example Searches

Search by question number:

```text
1
56
394
114
759
```

Search by title:

```text
Two Sum
Merge Intervals
Decode String
Graph
Tree
Dynamic Programming
```

---

## 📸 Screenshots

### Home Page

*Add screenshot here*

### Search Results

*Add screenshot here*

### Question Details

*Add screenshot here*

---

## 🎯 Future Improvements

* Company-specific preparation mode
* Bookmark questions
* Solved question tracking
* AI-powered recommendations
* Interview trend analytics
* Personalized study plans
* PostgreSQL support
* Authentication

---

## 🤝 Contributing

Contributions, suggestions, and feature requests are welcome.

Feel free to open an issue or submit a pull request.

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**Sandip Biswal**

* GitHub: [https://github.com/sandip234-ui](https://github.com/sandip234-ui)
* LinkedIn: [https://www.linkedin.com/in/sandip-biswal-728a7a291/](https://www.linkedin.com/in/sandip-biswal-728a7a291/)

---

### ⭐ If you find this project useful, consider giving it a star.
