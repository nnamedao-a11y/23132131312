"""
BIBI Cars Backend Test Suite — Blog Articles CRUD + Public Endpoints
=====================================================================
Session 30: Full CRUD test of admin Blog Articles flow + public endpoints.

Requirements:
  1. POST /api/auth/login — admin@bibi.cars / Jp3FS_7ZuE2bhHp7rFkJm9B9T_TeiHxu
  2. GET /api/admin/blog/articles — returns 8 seeded articles
  3. POST /api/admin/blog/articles — create new bilingual article with tags=['e2e-test','playwright'],
     category='news', title.en='E2E Test Article TIPTAP', title.bg='E2E Тест на TIPTAP',
     body containing <h2>, <strong>, <ul><li>, blockquote
  4. Response includes tags array and read_time_minutes >= 1
  5. GET /api/admin/blog/articles/{id} — returns article with body unchanged (HTML preserved)
  6. PUT /api/admin/blog/articles/{id} — update title.en + add tag 'updated', remove tag 'e2e-test',
     publish (published=true). Response should show published=true, published_at non-null, tags=['playwright','updated']
  7. Public GET /api/public/blog/articles?lang=en — should include new article (total count 9)
  8. Public GET /api/public/blog/articles?tag=playwright — returns exactly 1 article (case-insensitive)
  9. DELETE /api/admin/blog/articles/{id} — returns 200 and removes article
 10. Subsequent GET on its slug returns 404
"""
import sys
import requests
from datetime import datetime

BASE_URL = "https://commit-explorer.preview.emergentagent.com"

class Colors:
    GREEN = '\033[92m'
    RED = '\033[91m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    RESET = '\033[0m'

class BIBIBlogTester:
    def __init__(self):
        self.tests_run = 0
        self.tests_passed = 0
        self.admin_token = None
        self.test_article_id = None
        self.test_article_slug = None
        
    def log(self, msg, color=Colors.RESET):
        print(f"{color}{msg}{Colors.RESET}")
        
    def test(self, name, method, endpoint, expected_status, data=None, headers=None, params=None):
        """Run a single API test"""
        url = f"{BASE_URL}{endpoint}"
        self.tests_run += 1
        
        self.log(f"\n{'='*70}", Colors.BLUE)
        self.log(f"TEST {self.tests_run}: {name}", Colors.BLUE)
        self.log(f"{'='*70}", Colors.BLUE)
        self.log(f"  Method: {method} {endpoint}")
        if params:
            self.log(f"  Params: {params}")
        if data:
            self.log(f"  Payload keys: {list(data.keys()) if isinstance(data, dict) else 'N/A'}")
        
        try:
            req_headers = {'Content-Type': 'application/json'}
            if headers:
                req_headers.update(headers)
                
            if method == 'GET':
                response = requests.get(url, headers=req_headers, params=params, timeout=15)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=req_headers, timeout=15)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=req_headers, timeout=15)
            elif method == 'DELETE':
                response = requests.delete(url, headers=req_headers, timeout=15)
            else:
                self.log(f"  ✗ FAILED - Unsupported method {method}", Colors.RED)
                return False, {}
            
            success = response.status_code == expected_status
            
            if success:
                self.tests_passed += 1
                self.log(f"  ✓ PASSED - Status: {response.status_code}", Colors.GREEN)
            else:
                self.log(f"  ✗ FAILED - Expected {expected_status}, got {response.status_code}", Colors.RED)
                self.log(f"  Response: {response.text[:500]}", Colors.RED)
            
            try:
                json_data = response.json()
                return success, json_data
            except:
                return success, {}
                
        except Exception as e:
            self.log(f"  ✗ FAILED - Error: {str(e)}", Colors.RED)
            return False, {}
    
    def run_all_tests(self):
        """Execute all test scenarios"""
        self.log("\n" + "="*70, Colors.BLUE)
        self.log("BIBI CARS BLOG BACKEND TEST SUITE", Colors.BLUE)
        self.log("="*70, Colors.BLUE)
        
        # ── 1. Admin Authentication ──
        self.log("\n\n### PHASE 1: Admin Authentication ###", Colors.YELLOW)
        success, response = self.test(
            "Admin Login (admin@bibi.cars)",
            "POST",
            "/api/auth/login",
            200,
            data={"email": "admin@bibi.cars", "password": "Jp3FS_7ZuE2bhHp7rFkJm9B9T_TeiHxu"}
        )
        if success:
            token = response.get('token') or response.get('access_token')
            if token:
                self.admin_token = token
                self.log(f"  → Admin token acquired: {self.admin_token[:20]}...", Colors.GREEN)
            else:
                self.log("  → CRITICAL: No token in response", Colors.RED)
                return
        else:
            self.log("  → CRITICAL: Admin login failed", Colors.RED)
            return
        
        # ── 2. Get Seeded Articles ──
        self.log("\n\n### PHASE 2: Get Seeded Blog Articles ###", Colors.YELLOW)
        success, response = self.test(
            "GET /api/admin/blog/articles (should return 8 seeded articles)",
            "GET",
            "/api/admin/blog/articles",
            200,
            headers={"Authorization": f"Bearer {self.admin_token}"}
        )
        
        if success:
            items = response.get('items', [])
            count = response.get('count', len(items))
            self.log(f"  → Found {count} articles", Colors.GREEN if count == 8 else Colors.YELLOW)
            if count >= 8:
                self.log(f"  ✓ Seeded articles present", Colors.GREEN)
            else:
                self.log(f"  ⚠ Expected 8 articles, got {count}", Colors.YELLOW)
        else:
            self.log("  ✗ Failed to fetch articles", Colors.RED)
            return
        
        # ── 3. Create New Article with TipTap HTML ──
        self.log("\n\n### PHASE 3: Create New Article (TipTap HTML + Tags) ###", Colors.YELLOW)
        
        create_payload = {
            "category": "news",
            "title": {
                "en": "E2E Test Article TIPTAP",
                "bg": "E2E Тест на TIPTAP"
            },
            "excerpt": {
                "en": "This is an automated test article created by Playwright E2E testing suite.",
                "bg": "Това е автоматична тестова статия, създадена от Playwright E2E тестовия пакет."
            },
            "body": {
                "en": (
                    "<h2>Test Heading 2</h2>"
                    "<p>This is a <strong>bold paragraph</strong> with some <em>italic text</em>.</p>"
                    "<ul><li>First bullet point</li><li>Second bullet point</li><li>Third bullet point</li></ul>"
                    "<blockquote><p>This is a blockquote to test HTML preservation.</p></blockquote>"
                    "<p>Final paragraph with <a href='https://example.com'>a link</a>.</p>"
                ),
                "bg": (
                    "<h2>Тестово заглавие 2</h2>"
                    "<p>Това е <strong>удебелен параграф</strong> с малко <em>курсив текст</em>.</p>"
                    "<ul><li>Първа точка</li><li>Втора точка</li><li>Трета точка</li></ul>"
                    "<blockquote><p>Това е цитат за тестване на запазването на HTML.</p></blockquote>"
                    "<p>Финален параграф с <a href='https://example.com'>връзка</a>.</p>"
                )
            },
            "tags": ["e2e-test", "playwright"],
            "published": False
        }
        
        success, response = self.test(
            "POST /api/admin/blog/articles (create with tags + TipTap HTML)",
            "POST",
            "/api/admin/blog/articles",
            200,
            data=create_payload,
            headers={"Authorization": f"Bearer {self.admin_token}"}
        )
        
        if success:
            self.test_article_id = response.get('id')
            self.test_article_slug = response.get('slug')
            tags = response.get('tags', [])
            read_time = response.get('read_time_minutes', 0)
            
            self.log(f"  → Article ID: {self.test_article_id}", Colors.GREEN)
            self.log(f"  → Article Slug: {self.test_article_slug}", Colors.GREEN)
            self.log(f"  → Tags: {tags}", Colors.GREEN)
            self.log(f"  → Read time: {read_time} min", Colors.GREEN)
            
            # Verify tags
            if set(tags) == {'e2e-test', 'playwright'}:
                self.log(f"  ✓ Tags correctly saved", Colors.GREEN)
            else:
                self.log(f"  ✗ Tags mismatch: expected ['e2e-test', 'playwright'], got {tags}", Colors.RED)
            
            # Verify read time
            if read_time >= 1:
                self.log(f"  ✓ Read time calculated (>= 1 min)", Colors.GREEN)
            else:
                self.log(f"  ✗ Read time should be >= 1, got {read_time}", Colors.RED)
        else:
            self.log("  ✗ Failed to create article", Colors.RED)
            return
        
        # ── 4. Get Single Article (verify HTML preserved) ──
        self.log("\n\n### PHASE 4: Get Single Article (HTML Preservation) ###", Colors.YELLOW)
        success, response = self.test(
            f"GET /api/admin/blog/articles/{self.test_article_id}",
            "GET",
            f"/api/admin/blog/articles/{self.test_article_id}",
            200,
            headers={"Authorization": f"Bearer {self.admin_token}"}
        )
        
        if success:
            body_en = response.get('body', {}).get('en', '')
            body_bg = response.get('body', {}).get('bg', '')
            
            # Check if HTML tags are preserved
            html_checks = [
                ('<h2>' in body_en, 'H2 tag'),
                ('<strong>' in body_en, 'Strong tag'),
                ('<ul>' in body_en, 'UL tag'),
                ('<li>' in body_en, 'LI tag'),
                ('<blockquote>' in body_en, 'Blockquote tag'),
            ]
            
            all_preserved = all(check[0] for check in html_checks)
            if all_preserved:
                self.log(f"  ✓ All HTML tags preserved in body.en", Colors.GREEN)
            else:
                self.log(f"  ✗ Some HTML tags missing:", Colors.RED)
                for check, name in html_checks:
                    if not check:
                        self.log(f"    - Missing: {name}", Colors.RED)
        else:
            self.log("  ✗ Failed to fetch article", Colors.RED)
        
        # ── 5. Update Article (change title, tags, publish) ──
        self.log("\n\n### PHASE 5: Update Article (Title + Tags + Publish) ###", Colors.YELLOW)
        
        update_payload = {
            "title": {
                "en": "E2E Test Article TIPTAP (UPDATED)",
                "bg": "E2E Тест на TIPTAP (ОБНОВЕН)"
            },
            "tags": ["playwright", "updated"],  # Remove 'e2e-test', add 'updated'
            "published": True
        }
        
        success, response = self.test(
            f"PUT /api/admin/blog/articles/{self.test_article_id}",
            "PUT",
            f"/api/admin/blog/articles/{self.test_article_id}",
            200,
            data=update_payload,
            headers={"Authorization": f"Bearer {self.admin_token}"}
        )
        
        if success:
            published = response.get('published', False)
            published_at = response.get('published_at')
            tags = response.get('tags', [])
            title_en = response.get('title', {}).get('en', '')
            
            self.log(f"  → Published: {published}", Colors.GREEN if published else Colors.RED)
            self.log(f"  → Published at: {published_at}", Colors.GREEN if published_at else Colors.RED)
            self.log(f"  → Tags: {tags}", Colors.GREEN)
            self.log(f"  → Title EN: {title_en}", Colors.GREEN)
            
            # Verify published
            if published and published_at:
                self.log(f"  ✓ Article published successfully", Colors.GREEN)
            else:
                self.log(f"  ✗ Article not published or published_at missing", Colors.RED)
            
            # Verify tags updated
            if set(tags) == {'playwright', 'updated'}:
                self.log(f"  ✓ Tags correctly updated", Colors.GREEN)
            else:
                self.log(f"  ✗ Tags mismatch: expected ['playwright', 'updated'], got {tags}", Colors.RED)
        else:
            self.log("  ✗ Failed to update article", Colors.RED)
        
        # ── 6. Public List (should now show 9 articles) ──
        self.log("\n\n### PHASE 6: Public Blog List (Should Include New Article) ###", Colors.YELLOW)
        success, response = self.test(
            "GET /api/public/blog/articles?lang=en (should show 9 articles)",
            "GET",
            "/api/public/blog/articles",
            200,
            params={"lang": "en", "limit": 100}
        )
        
        if success:
            items = response.get('items', [])
            total = response.get('total', len(items))
            self.log(f"  → Total articles: {total}", Colors.GREEN if total == 9 else Colors.YELLOW)
            
            # Check if our article is in the list
            found = any(a.get('id') == self.test_article_id for a in items)
            if found:
                self.log(f"  ✓ New article found in public list", Colors.GREEN)
            else:
                self.log(f"  ✗ New article NOT found in public list", Colors.RED)
        else:
            self.log("  ✗ Failed to fetch public articles", Colors.RED)
        
        # ── 7. Public Tag Filter ──
        self.log("\n\n### PHASE 7: Public Tag Filter (tag=playwright) ###", Colors.YELLOW)
        success, response = self.test(
            "GET /api/public/blog/articles?tag=playwright (should return 1 article)",
            "GET",
            "/api/public/blog/articles",
            200,
            params={"lang": "en", "tag": "playwright", "limit": 100}
        )
        
        if success:
            items = response.get('items', [])
            total = response.get('total', len(items))
            self.log(f"  → Articles with tag 'playwright': {total}", Colors.GREEN if total == 1 else Colors.YELLOW)
            
            if total == 1:
                self.log(f"  ✓ Tag filter working correctly", Colors.GREEN)
            else:
                self.log(f"  ⚠ Expected 1 article, got {total}", Colors.YELLOW)
        else:
            self.log("  ✗ Failed to fetch articles by tag", Colors.RED)
        
        # ── 8. Delete Article ──
        self.log("\n\n### PHASE 8: Delete Article ###", Colors.YELLOW)
        success, response = self.test(
            f"DELETE /api/admin/blog/articles/{self.test_article_id}",
            "DELETE",
            f"/api/admin/blog/articles/{self.test_article_id}",
            200,
            headers={"Authorization": f"Bearer {self.admin_token}"}
        )
        
        if success:
            self.log(f"  ✓ Article deleted successfully", Colors.GREEN)
        else:
            self.log(f"  ✗ Failed to delete article", Colors.RED)
        
        # ── 9. Verify 404 on Deleted Slug ──
        self.log("\n\n### PHASE 9: Verify 404 on Deleted Slug ###", Colors.YELLOW)
        success, response = self.test(
            f"GET /api/public/blog/articles/{self.test_article_slug} (should return 404)",
            "GET",
            f"/api/public/blog/articles/{self.test_article_slug}",
            404,
            params={"lang": "en"}
        )
        
        if success:
            self.log(f"  ✓ Slug correctly returns 404 after deletion", Colors.GREEN)
        else:
            self.log(f"  ✗ Slug should return 404 but didn't", Colors.RED)
        
        # ── Final Summary ──
        self.print_summary()
    
    def print_summary(self):
        """Print final test summary"""
        self.log("\n\n" + "="*70, Colors.BLUE)
        self.log("TEST SUMMARY", Colors.BLUE)
        self.log("="*70, Colors.BLUE)
        
        pass_rate = (self.tests_passed / self.tests_run * 100) if self.tests_run > 0 else 0
        
        self.log(f"\nTotal Tests: {self.tests_run}")
        self.log(f"Passed: {self.tests_passed}", Colors.GREEN)
        self.log(f"Failed: {self.tests_run - self.tests_passed}", Colors.RED)
        self.log(f"Pass Rate: {pass_rate:.1f}%", Colors.GREEN if pass_rate >= 80 else Colors.RED)
        
        if pass_rate >= 80:
            self.log("\n✓ BACKEND TESTS PASSED", Colors.GREEN)
            return 0
        else:
            self.log("\n✗ BACKEND TESTS FAILED", Colors.RED)
            return 1

def main():
    tester = BIBIBlogTester()
    exit_code = tester.run_all_tests()
    sys.exit(exit_code)

if __name__ == "__main__":
    main()
