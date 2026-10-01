import csv
import os

input_csv = 'docs/stitch-screen-mapping.csv'
output_csv = 'docs/frontend-screen-traceability.csv'

columns = [
    "Stitch screen ID", "Exact screen name", "Product area", "Intended route",
    "Related requirement", "Required shared components", "Required page-specific components",
    "Required assets and logo variants", "Required API/data dependencies", "Loading state",
    "Empty state", "Error state", "Authentication/authorization requirements",
    "Implementation status", "Visual QA status", "Functional QA status", "Outstanding blockers"
]

def map_product_area_and_route(name):
    name_lower = name.lower()
    if 'landing' in name_lower:
        return 'Public website and discovery', '/'
    elif 'login' in name_lower or 'sign up' in name_lower or 'password' in name_lower or 'account created' in name_lower:
        return 'Authentication and onboarding', '/auth/...'
    elif 'user dashboard' in name_lower or 'game testing dashboard' in name_lower or 'testing application' in name_lower or 'game testing details' in name_lower:
        return 'Player/tester workspace', '/dashboard/...'
    elif 'developer' in name_lower or 'game rights' in name_lower:
        return 'Developer studio', '/developer/...'
    elif 'tournament host' in name_lower:
        return 'Tournament host and competitive experience', '/host/...'
    elif 'internal' in name_lower or 'hr management' in name_lower or 'founder' in name_lower or 'admin' in name_lower:
        return 'Internal operations', '/admin/...'
    elif 'game testing discovery' in name_lower:
        return 'Public website and discovery', '/games'
    elif 'tournament discovery' in name_lower:
        return 'Public website and discovery', '/tournaments'
    elif 'tournament details' in name_lower or 'tournament registration' in name_lower:
        return 'Public website and discovery', '/tournaments/[id]'
    elif 'how it works' in name_lower:
        return 'Public website and discovery', '/how-it-works'
    elif 'for developers' in name_lower:
        return 'Public website and discovery', '/for-developers'
    else:
        return 'Unknown', '/...'

with open(input_csv, 'r', encoding='utf-8') as infile:
    reader = csv.reader(infile)
    header = next(reader)
    
    out_rows = []
    out_rows.append(columns)
    
    for row in reader:
        if len(row) < 2: continue
        screen_id = row[0]
        screen_name = row[1]
        
        # skip non-screens like logos or images
        if not screen_name.startswith('Riyadah Elite'):
            continue
            
        area, route = map_product_area_and_route(screen_name)
        
        # Check if already implemented
        impl_status = "Not Started"
        if route == '/games' or route == '/tournaments' or route == '/':
            impl_status = "Implemented"
        
        out_rows.append([
            screen_id, screen_name, area, route,
            "", "", "", "RE_Logo.png", "", "Pending", "Pending", "Pending",
            "Public" if area == 'Public website and discovery' else "Required",
            impl_status, "Not Started", "Not Started", "None"
        ])

with open(output_csv, 'w', encoding='utf-8', newline='') as outfile:
    writer = csv.writer(outfile)
    writer.writerows(out_rows)

print("Traceability matrix generated.")
