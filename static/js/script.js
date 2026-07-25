const analyzeBtn = document.getElementById("analyze");
const urlInput = document.getElementById("url");
const result = document.getElementById("result");
const loader = document.getElementById("loader");

// Allow Enter key
urlInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        analyzeWebsite();
    }
});

analyzeBtn.addEventListener("click", analyzeWebsite);

async function analyzeWebsite() {

    const url = urlInput.value.trim();

    if (!url) {
        alert("Please enter a URL.");
        return;
    }

    result.innerHTML = "";

    loader.classList.remove("hidden");

    try {

        const response = await fetch("/analyze", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                url
            })

        });

        const data = await response.json();

        loader.classList.add("hidden");

        if (!data.success) {

            showError(data.error);

            return;
        }

        showResults(data);

    }

    catch {

        loader.classList.add("hidden");

        showError("Unable to connect to server.");

    }

}

function showResults(data) {

    // Save URL to history
    saveHistory(urlInput.value);
    

    result.innerHTML = `

    <div class="health-card">

        <div class="health-score">

            <span>${data.score}</span>

            <small>/100</small>

        </div>

        <div class="health-text">

            <h2> Overall Health Score

            <span class="grade">

            ${data.grade}

            </span>

            </h2>

            <p>
                Based on metadata, accessibility
                and page structure.
            </p>

        </div>

    </div>

    <div class="metrics-grid">

        ${metricCard("fa-solid fa-globe", "HTTP Status", data.status)}

        ${metricCard("fa-solid fa-bolt", "Response Time", data.response_time + " ms")}

        ${metricCard("fa-solid fa-book", "Word Count", data.word_count)}

        ${metricCard("fa-solid fa-heading", "H1 Tags", data.h1_count)}

        ${metricCard("fa-solid fa-image", "Missing ALT", data.missing_alt_images)}

    </div>

    <div class="detail-card">

        <h3>
            <i class="fa-solid fa-file-lines"></i>
            Page Title
        </h3>

        <p>${data.title}</p>

    </div>

    <div class="detail-card">

        <h3>
            <i class="fa-solid fa-align-left"></i>
            Meta Description
        </h3>

        <p>${data.meta_description}</p>

    </div>
    
    <div class="detail-card">

    <h3>

        <i class="fa-solid fa-lightbulb"></i>

        Recommendations

    </h3>

    <div class="recommendation-list">

        ${data.recommendations.map(item => `

            <div class="recommendation ${item.type}">

                ${item.type === "success"
                    ? '<i class="fa-solid fa-circle-check"></i>'
                    : item.type === "warning"
                        ? '<i class="fa-solid fa-triangle-exclamation"></i>'
                        : '<i class="fa-solid fa-circle-xmark"></i>'
                }

                <span>${item.message}</span>

            </div>

        `).join("")}

    </div>

    </div>
    

    <div class="actions">

        <button id="copyBtn">

            <i class="fa-regular fa-copy"></i>

            Copy Report

        </button>

    </div>

    `;

    // Copy Report Button

    document
        .getElementById("copyBtn")
        .addEventListener("click", () => {

const report = `

PagePulse Report

----------------------------

Health Score : ${data.score}/100

Grade : ${data.grade}

HTTP Status : ${data.status}

Response Time : ${data.response_time} ms

Word Count : ${data.word_count}

H1 Tags : ${data.h1_count}

Missing ALT Images : ${data.missing_alt_images}

Page Title : ${data.title}

Meta Description :

${data.meta_description}

Recommendations:

${data.recommendations
    .map(r => "- " + r.message)
    .join("\n")}

`;

            navigator.clipboard.writeText(report)
                .then(() => {

                    const btn =
                        document.getElementById("copyBtn");

                    btn.innerHTML = `
                        <i class="fa-solid fa-check"></i>
                        Copied!
                    `;

                    setTimeout(() => {

                        btn.innerHTML = `
                            <i class="fa-regular fa-copy"></i>
                            Copy Report
                        `;

                    }, 2000);

                });

        });

}
function metricCard(icon, title, value) {

    let status = "";
    let statusClass = "";

    switch (title) {

        case "HTTP Status":
            if (Number(value) === 200) {
                status = "Reachable";
                statusClass = "success";
            } else {
                status = "Error";
                statusClass = "danger";
            }
            break;

        case "Missing ALT":
            if (Number(value) === 0) {
                status = "Excellent";
                statusClass = "success";
            } else if (Number(value) <= 3) {
                status = "Needs Improvement";
                statusClass = "warning";
            } else {
                status = "Poor";
                statusClass = "danger";
            }
            break;

        case "Response Time":

            if (parseFloat(value) < 500) {
                status = "Fast";
                statusClass = "success";
            } else if (parseFloat(value) < 1000) {
                status = "Average";
                statusClass = "warning";
            } else {
                status = "Slow";
                statusClass = "danger";
            }

            break;

        default:
            status = "";
    }

    return `

    <div class="result-card">

        <div class="metric-icon">
            <i class="${icon}"></i>
        </div>

        <h3>${title}</h3>

        <p>${value}</p>

        ${status
            ? `<span class="${statusClass}">
                    ${status}
               </span>`
            : ""
        }

    </div>

    `;
}
function showError(message){

result.innerHTML = `

<div class="detail-card">

<h3 style="color:#EF4444;">
<i class="fa-solid fa-triangle-exclamation"></i>

Analysis Failed

</h3>

<p>${message}</p>

</div>

`;

}

function saveHistory(url){

    let history =
        JSON.parse(localStorage.getItem("history")) || [];

    history = history.filter(item => item !== url);

    history.unshift(url);

    history = history.slice(0,5);

    localStorage.setItem(
        "history",
        JSON.stringify(history)
    );

    loadHistory();

}
function loadHistory() {

    const list = document.getElementById("historyList");

    const history =
        JSON.parse(localStorage.getItem("history")) || [];

    list.innerHTML = "";

    if (history.length === 0) {

        list.innerHTML = `
            <p style="color:#94A3B8;">
                No recent analyses yet.
            </p>
        `;

        return;
    }

    history.forEach(url => {

        list.innerHTML += `
            <div class="history-item"
                 onclick="fillInput('${url}')">

                🌐 ${url}

            </div>
        `;

    });

}
function fillInput(url){

    urlInput.value=url;
    

}
document.addEventListener("DOMContentLoaded", () => {
    loadHistory();
});

