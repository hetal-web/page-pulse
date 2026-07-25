# 🚀 PagePulse

PagePulse is a lightweight website auditing tool built with Flask that analyzes a webpage and provides useful SEO and accessibility insights.

## ✨ Features

- Analyze any valid website URL
- HTTP Status Check
- Response Time Measurement
- Page Title Detection
- Meta Description Extraction
- H1 Tag Count
- Missing Image ALT Detection
- Word Count
- Website Health Score
- Recent Analysis History (Local Storage)
- Copy Report to Clipboard

---

## 🛠️ Tech Stack

- Python
- Flask
- HTML
- CSS
- JavaScript
- BeautifulSoup4
- Requests
- Validators
- Pytest

---

## 📂 Project Structure

```
page-pulse/
│
├── app.py
├── requirements.txt
├── README.md
├── utils/
│   ├── __init__.py
│   └── parser.py
├── tests/
│   └── test_parser.py
├── templates/
│   └── index.html
└── static/
    ├── css/
    └── js/
```

---

## ⚙️ Installation

Clone the repository:

```bash
git clone https://github.com/hetal-web/page-pulse.git
```

Navigate into the project:

```bash
cd page-pulse
```

Create a virtual environment:

```bash
python -m venv venv
```

Activate it.

Windows:

```bash
venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Run the application:

```bash
python app.py
```

Open:

```
http://127.0.0.1:5000
```

---

## 🧪 Running Tests

```bash
pytest -v
```

---

## 🌍 Deployment

The project can be deployed on Render or any platform that supports Python Flask applications.

---

## 👤 Author

Hetal Boricha

Built as part of the Digital Heroes Software Development Qualification Task.

## AI Usage
I used ChatGPT as a development assistant throughout this project to learn unfamiliar concepts, troubleshoot Flask and Python issues, refine the application structure, and improve the user interface. I did not use AI-generated code without review. I tested, modified, and integrated the suggestions based on my own understanding and project requirements. The final implementation, debugging, testing, deployment, and overall design decisions were completed by me.
