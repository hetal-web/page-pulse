from flask import Flask, render_template, request, jsonify
from utils.parser import analyze_url
import os

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")

@app.post("/analyze")
def analyze():
    data = request.get_json()

    url = data.get("url")

    if not url:
        return jsonify({
            "success":False,
            "error":"Please enter a URL."
        }),400

    result = analyze_url(url)

    if result["success"]:
        return jsonify(result), 200

    return jsonify(result), 400


if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=int(os.environ.get("PORT", 5000)),
        debug=True
    )