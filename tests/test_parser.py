from utils.parser import parse_html


def test_parse_html_complete_page():

    html = """
    <html>
        <head>
            <title>Example Site</title>
            <meta name="description" content="Sample description">
        </head>

        <body>

            <h1>Main Heading</h1>

            <img src="one.jpg" alt="Image One">

            <img src="two.jpg">

            <p>Hello world from PagePulse.</p>

        </body>
    </html>
    """

    result = parse_html(html)

    assert result["title"] == "Example Site"
    assert result["meta_description"] == "Sample description"
    assert result["h1_count"] == 1
    assert result["missing_alt_images"] == 1
    assert result["word_count"] > 0


def test_parse_html_missing_metadata():

    html = """
    <html>
        <body>

            <p>No title or description.</p>

        </body>
    </html>
    """

    result = parse_html(html)

    assert result["title"] == "Not Found"
    assert result["meta_description"] == "Not Found"
    assert result["h1_count"] == 0
    assert result["missing_alt_images"] == 0


def test_parse_html_multiple_h1_and_images():

    html = """
    <html>

        <head>

            <title>Testing</title>

        </head>

        <body>

            <h1>Heading One</h1>

            <h1>Heading Two</h1>

            <img src="1.jpg">

            <img src="2.jpg">

            <img src="3.jpg" alt="Third">

        </body>

    </html>
    """

    result = parse_html(html)

    assert result["h1_count"] == 2
    assert result["missing_alt_images"] == 2