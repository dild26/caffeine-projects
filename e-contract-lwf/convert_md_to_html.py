import markdown
import os

input_dir = 'templates'
output_dir = 'website'

if not os.path.exists(output_dir):
    os.makedirs(output_dir)

for filename in os.listdir(input_dir):
    if filename.endswith('.md'):
        input_filepath = os.path.join(input_dir, filename)
        output_filename = filename.replace('.md', '.html')
        output_filepath = os.path.join(output_dir, output_filename)

        with open(input_filepath, 'r', encoding='utf-8') as f:
            md_content = f.read()

        html_content = markdown.markdown(md_content)

        # Add a basic HTML structure
        full_html = f"""
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{os.path.splitext(filename)[0].replace('_', ' ').title()}</title>
    <style>
        body {{ font-family: sans-serif; line-height: 1.6; margin: 20px; background-color: #f4f4f4; color: #333; }}
        .container {{ max-width: 800px; margin: auto; background: #fff; padding: 30px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }}
        h1, h2, h3 {{ color: #0056b3; }}
        pre {{ background-color: #eee; padding: 10px; border-radius: 5px; overflow-x: auto; }}
        code {{ font-family: monospace; }}
        table {{ width: 100%; border-collapse: collapse; margin-bottom: 1em; }}
        th, td {{ border: 1px solid #ddd; padding: 8px; text-align: left; }}
        th {{ background-color: #f2f2f2; }}
        a {{ color: #0056b3; text-decoration: none; }}
        a:hover {{ text-decoration: underline; }}
    </style>
</head>
<body>
    <div class="container">
        <p><a href="index.html">&larr; Back to Home</a></p>
        {html_content}
    </div>
</body>
</html>
"""

        with open(output_filepath, 'w', encoding='utf-8') as f:
            f.write(full_html)

print(f"Converted Markdown files from '{input_dir}' to HTML in '{output_dir}'")


