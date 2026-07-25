import time
import requests
import validators
from bs4 import BeautifulSoup


def parse_html(html):
    """
    Extract information from raw HTML.
    Pure function -> easy to unit test.
    """

    soup = BeautifulSoup(html, "html.parser")

    title = soup.title.string.strip() if soup.title else "Not Found"

    meta = soup.find("meta", attrs={"name": "description"})

    description = (
        meta["content"].strip()
        if meta and meta.get("content")
        else "Not Found"
    )

    h1_count = len(soup.find_all("h1"))

    images = soup.find_all("img")

    missing_alt = sum(
    1 for img in images
    if not img.get("alt")
)

    word_count = len(soup.get_text().split())

    return {
        "title": title,
        "meta_description": description,
        "h1_count": h1_count,
        "missing_alt_images": missing_alt,
        "word_count": word_count
    }


def analyze_url(url):

    if not validators.url(url):
        return {
            "success": False,
            "error": "Invalid URL."
        }

    try:

        start = time.time()

        response = requests.get(
            url,
            timeout=10,
            headers={
                "User-Agent":
                "Mozilla/5.0 PagePulse"
            }
        )

        end = time.time()

        response_time = round((end - start) * 1000, 2)

        content_type = response.headers.get("Content-Type", "")

        if "text/html" not in content_type:
            return {
                "success": False,
                "error": "URL does not contain an HTML page."
            }

        parsed = parse_html(response.text)

        recommendations = []

        # HTTP Status
        if response.status_code == 200:
            recommendations.append({
                "type": "success",
                "message": "Website is reachable."
            })
        else:
            recommendations.append({
                "type": "danger",
                "message": "Website returned an unexpected HTTP status."
            })

        # Meta Description
        if parsed["meta_description"] == "Not Found":
            recommendations.append({
                "type": "warning",
                "message": "Add a meta description for better SEO."
            })
        else:
            recommendations.append({
                "type": "success",
                "message": "Meta description detected."
            })

        # H1
        if parsed["h1_count"] == 0:
            recommendations.append({
                "type": "warning",
                "message": "No H1 heading found."
            })
        elif parsed["h1_count"] > 1:
            recommendations.append({
                "type": "warning",
                "message": "Multiple H1 tags detected."
            })
        else:
            recommendations.append({
                "type": "success",
                "message": "Single H1 heading detected."
            })

        # ALT Text
        if parsed["missing_alt_images"] == 0:
            recommendations.append({
                "type": "success",
                "message": "All images have ALT text."
            })
        else:
            recommendations.append({
                "type": "warning",
                "message": f'{parsed["missing_alt_images"]} image(s) are missing ALT text.'
            })

        # Response Time
        if response_time < 500:
            recommendations.append({
                "type": "success",
                "message": "Excellent response time."
            })
        elif response_time < 1000:
            recommendations.append({
                "type": "warning",
                "message": "Average response time."
            })
        else:
            recommendations.append({
                "type": "danger",
                "message": "Slow response time."
            })

            # Calculate Health Score
        score = 100

        if response.status_code != 200:
            score -= 30

        if parsed["meta_description"] == "Not Found":
            score -= 20

        if parsed["h1_count"] == 0:
            score -= 15
        elif parsed["h1_count"] > 1:
            score -= 10

        score -= min(parsed["missing_alt_images"] * 5, 20)

        if response_time > 1000:
            score -= 15
        elif response_time > 500:
            score -= 5

        score = max(score, 0)

        if score >= 90:
            grade = "Excellent"
        elif score >= 75:
            grade = "Good"
        elif score >= 50:
            grade = "Fair"
        else:
            grade = "Poor"

        return {
    "success": True,
    "status": response.status_code,
    "response_time": response_time,
    "score": score,
    "grade": grade,
    **parsed,
    "recommendations": recommendations
}

    except requests.exceptions.Timeout:
         return {
            "success": False,
            "error": "Connection timed out."
        }

    except requests.exceptions.RequestException as e:
        return {
            "success": False,
            "error": str(e)
        }