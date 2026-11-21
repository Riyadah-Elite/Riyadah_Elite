import os
import sys
import time
from playwright.sync_api import sync_playwright

OUTPUT_DIR = os.path.join(os.getcwd(), 'qa-artifacts', 'electric-glacier-production')
os.makedirs(OUTPUT_DIR, exist_ok=True)

VIEWPORTS = {
    'desktop': {'width': 1440, 'height': 900},
    'tablet': {'width': 768, 'height': 1024},
    'mobile': {'width': 390, 'height': 844, 'is_mobile': True, 'has_touch': True},
}

PRODUCTION_PAGES = [
    ('/', 'homepage'),
    ('/tournaments', 'tournaments'),
    ('/game-testing', 'game_testing'),
    ('/bug-report', 'bug_report'),
]

DELETED_THEME_LAB_ROUTES = [
    '/theme-lab',
    '/theme-lab/tropical-waterfall',
    '/theme-lab/sunset-horizon',
    '/theme-lab/ocean-voltage',
    '/theme-lab/electric-glacier',
    '/theme-lab/deep-neon',
    '/theme-lab/azure-midnight',
]

def run():
    print("=== STARTING FULL POST-DELETION REGRESSION & VALIDATION ===")
    errors_logged = []
    deleted_route_results = {}
    
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        
        # 1. Test Deleted Routes (Confirm they do NOT serve Theme Lab)
        print("\n--- Verifying Deleted Theme Lab Routes ---")
        context_probe = browser.new_context(viewport={'width': 1440, 'height': 900})
        probe_page = context_probe.new_page()
        for dpath in DELETED_THEME_LAB_ROUTES:
            url = f"http://localhost:8081{dpath}"
            probe_page.goto(url, wait_until='domcontentloaded', timeout=30000)
            probe_page.wait_for_timeout(1000)
            body_text = probe_page.inner_text('body')
            # Check if theme lab dashboard or theme preview rendered
            has_theme_lab = 'Theme Lab' in body_text or 'Experimental Themes' in body_text or 'Return to Lab' in body_text
            # Expo router shows 'Unmatched Route' or 404 when route is deleted
            is_unmatched = 'Unmatched Route' in body_text or 'This screen could not be found' in body_text or '404' in body_text or not has_theme_lab
            deleted_route_results[dpath] = {
                'has_theme_lab': has_theme_lab,
                'is_unmatched_or_not_found': is_unmatched
            }
            print(f"  Route: {dpath} -> Theme Lab Content: {has_theme_lab} | Unmatched/404: {is_unmatched}")
        context_probe.close()
        
        # 2. Test Production Routes Across Viewports
        for vp_name, vp_cfg in VIEWPORTS.items():
            print(f"\n--- Testing Production Viewport: {vp_name} ({vp_cfg['width']}x{vp_cfg['height']}) ---")
            context = browser.new_context(
                viewport={'width': vp_cfg['width'], 'height': vp_cfg['height']},
                is_mobile=vp_cfg.get('is_mobile', False),
                has_touch=vp_cfg.get('has_touch', False)
            )
            page = context.new_page()
            
            page.on("console", lambda msg: errors_logged.append(f"[{vp_name}] Console {msg.type}: {msg.text}") if msg.type == 'error' else None)
            page.on("pageerror", lambda err: errors_logged.append(f"[{vp_name}] Page Error: {err}"))
            
            for path, name in PRODUCTION_PAGES:
                url = f"http://localhost:8081{path}"
                print(f"Navigating to {url} ...")
                page.goto(url, wait_until='domcontentloaded', timeout=60000)
                page.wait_for_timeout(2500)
                
                # Check for Electric Blue on page
                eval_script = """() => {
                    const el = document.body;
                    const style = window.getComputedStyle(el);
                    const all = Array.from(document.querySelectorAll('*'));
                    let blueCount = 0;
                    all.forEach(e => {
                        const s = window.getComputedStyle(e);
                        if (s.backgroundColor === 'rgb(23, 105, 255)' || s.color === 'rgb(23, 105, 255)' || s.borderColor === 'rgb(23, 105, 255)') {
                            blueCount++;
                        }
                    });
                    return {
                        bodyBg: style.backgroundColor,
                        blueCount: blueCount,
                        title: document.title
                    };
                }"""
                info = page.evaluate(eval_script)
                print(f"  [{vp_name} - {name}] Info: bodyBg={info['bodyBg']}, blueCount={info['blueCount']}, title='{info['title']}'")
                
                shot_path = os.path.join(OUTPUT_DIR, f"{name}_{vp_name}.png")
                page.screenshot(path=shot_path, full_page=False)
                print(f"  Screenshot saved: {shot_path}")
            
            # If desktop, test Auth Modals
            if vp_name == 'desktop':
                print("  Testing interactive Auth Modals on desktop...")
                signin_btn = page.locator('text=Sign in').first
                if signin_btn.is_visible():
                    signin_btn.click()
                    page.wait_for_timeout(1000)
                    page.screenshot(path=os.path.join(OUTPUT_DIR, 'modal_login_desktop.png'))
                    print("  Saved modal_login_desktop.png")
                    
                    # Switch to Register
                    reg_tab = page.locator('text=Create Account').or_(page.locator('text=Register')).first
                    if reg_tab.is_visible():
                        reg_tab.click()
                        page.wait_for_timeout(1000)
                        page.screenshot(path=os.path.join(OUTPUT_DIR, 'modal_register_desktop.png'))
                        print("  Saved modal_register_desktop.png")
            
            context.close()
            
        browser.close()

    print("\n=== POST-DELETION VALIDATION SUMMARY ===")
    all_deleted_routes_dead = all(not res['has_theme_lab'] for res in deleted_route_results.values())
    print(f"All Theme Lab routes unrouted/dead: {all_deleted_routes_dead}")
    for route, res in deleted_route_results.items():
        print(f"  {route}: dead = {not res['has_theme_lab']}")
        
    critical_errors = [e for e in errors_logged if '401' not in e]
    print(f"Critical console errors: {len(critical_errors)}")
    if critical_errors:
        for err in critical_errors[:5]:
            print("  ", err)

if __name__ == '__main__':
    run()
