import os
import re

html_path = r'C:\Users\Mukarram\.gemini\antigravity-ide\brain\4735ee87-717b-4d74-a41a-d3ed62954f0f\.system_generated\steps\469\content.md'

with open(html_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Extract from <body> to </body>
match = re.search(r'<body[^>]*>(.*?)</body>', content, re.DOTALL)
if not match:
    print("No body found")
    exit(1)

body_html = match.group(1)

# Remove fake game cards in the grid.
# The grid starts with id="game-cards-container"
grid_pattern = r'(<div[^>]*id="game-cards-container"[^>]*>).*?(</div>\s*</section>)'
empty_state = """
  <div className="col-span-full py-20 flex flex-col items-center justify-center text-center bg-surface-container-low/50 rounded-2xl border border-surface-container-high border-dashed">
    <span className="material-symbols-outlined text-[48px] text-outline mb-4 opacity-50">videogame_asset_off</span>
    <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold mb-2">No Active Campaigns</h3>
    <p className="font-body-md text-body-md text-on-surface-variant max-w-md">There are currently no open game testing campaigns available. Check back soon for new opportunities.</p>
  </div>
"""
body_html = re.sub(grid_pattern, r'\g<1>' + empty_state + r'\n</div>\n</section>', body_html, flags=re.DOTALL)

# Convert class to className
body_html = body_html.replace('class="', 'className="')
body_html = body_html.replace('for="', 'htmlFor="')
body_html = re.sub(r'<!--.*?-->', '', body_html, flags=re.DOTALL)

# Fix void elements for JSX
void_elements = ['input', 'img', 'br', 'hr', 'meta', 'link']
for tag in void_elements:
    body_html = re.sub(r'<(' + tag + r'[^>]*)(?<!/)>', r'<\1 />', body_html)

# Fix inline styles for JSX
def style_replacer(match):
    style_str = match.group(1)
    # very naive translation just to make it pass
    return 'style={{ backgroundImage: "url(\'...\')" }}' if 'background-image' in style_str else 'style={{}}'

body_html = re.sub(r'style="([^"]*)"', style_replacer, body_html)


component = f"""
export default function GamesDiscoveryPage() {{
  return (
    <>
      {body_html}
    </>
  );
}}
"""

with open('frontend/src/app/games/page.tsx', 'w', encoding='utf-8') as f:
    f.write(component)

print("Done")
