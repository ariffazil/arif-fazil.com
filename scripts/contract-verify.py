#!/usr/bin/env python3
import urllib.request
import urllib.error
import json
import time
import datetime
import hashlib
import sys

BASE = 'https://arif-fazil.com'
USER_AGENT = 'arifOS-contract-verify/2.0 (F13-ratified)'

def fetch(url, follow_redirects=True):
    start = time.time()
    req = urllib.request.Request(url, headers={'User-Agent': USER_AGENT})
    
    class NoRedirect(urllib.request.HTTPRedirectHandler):
        def redirect_request(self, req, fp, code, msg, headers, newurl):
            return None
            
    opener = urllib.request.build_opener() if follow_redirects else urllib.request.build_opener(NoRedirect)
    
    try:
        with opener.open(req, timeout=12) as resp:
            elapsed_ms = round((time.time() - start) * 1000, 2)
            body = resp.read()
            return {
                'url': url,
                'status': resp.status,
                'headers': dict(resp.headers),
                'latency_ms': elapsed_ms,
                'body_len': len(body),
                'body': body,
                'sha256': hashlib.sha256(body).hexdigest(),
                'error': None
            }
    except urllib.error.HTTPError as e:
        elapsed_ms = round((time.time() - start) * 1000, 2)
        body = e.read() if hasattr(e, 'read') else b''
        return {
            'url': url,
            'status': e.code,
            'headers': dict(e.headers),
            'latency_ms': elapsed_ms,
            'body_len': len(body),
            'body': body,
            'sha256': hashlib.sha256(body).hexdigest() if body else None,
            'error': str(e)
        }
    except Exception as e:
        elapsed_ms = round((time.time() - start) * 1000, 2)
        return {
            'url': url,
            'status': None,
            'headers': {},
            'latency_ms': elapsed_ms,
            'body_len': 0,
            'body': b'',
            'sha256': None,
            'error': str(e)
        }

def run_contract_tests():
    report = {
        'suite': 'arif-fazil.com Contract & Architecture Verification',
        'tested_at_utc': datetime.datetime.now(datetime.timezone.utc).isoformat(),
        'base': BASE,
        'results': [],
        'summary': {'total': 0, 'passed': 0, 'failed': 0}
    }
    
    # 1. Canonical Core Routes
    routes_to_test = [
        ('/', 200, True),
        ('/earth/', 200, True),
        ('/vitals/', 200, True),
        ('/words/', 200, True),
        ('/world/makcikgpt/', 200, True),
        ('/gold/', 200, True),
        ('/oil/', 200, True),
        ('/gas/', 200, True),
        ('/discovery/', 200, True),
        ('/institution/', 200, True),
        ('/human', 200, True),
        ('/000/', 200, True),
        ('/999/', 200, True),
        ('/ledger', 200, True),
    ]
    
    for path, expected_code, check_ssr in routes_to_test:
        url = BASE + path
        res = fetch(url, follow_redirects=True)
        passed = (res['status'] == expected_code)
        ssr_checks = {}
        if passed and check_ssr and res['body']:
            html = res['body'].decode('utf-8', errors='ignore')
            ssr_checks['has_h1'] = ('<h1' in html)
            ssr_checks['has_jsonld'] = ('application/ld+json' in html)
            ssr_checks['has_og'] = ('og:title' in html)
            ssr_checks['has_canonical'] = ('canonical' in html)
            if not (ssr_checks['has_h1'] and ssr_checks['has_jsonld']):
                passed = False
                
        test_entry = {
            'category': 'canonical_page',
            'path': path,
            'url': url,
            'expected_status': expected_code,
            'actual_status': res['status'],
            'latency_ms': res['latency_ms'],
            'content_sha256': res['sha256'],
            'ssr_checks': ssr_checks,
            'passed': passed,
            'error': res['error']
        }
        report['results'].append(test_entry)
        report['summary']['total'] += 1
        if passed:
            report['summary']['passed'] += 1
        else:
            report['summary']['failed'] += 1
            
    # 2. Redirect Policies (Manual Redirect Mode)
    redirects_to_test = [
        ('/propa/', 301),
        ('/wealth/', 308),
        ('/essays/', 308),
        ('/writing/', 308),
        ('/genesis/', 301),
        ('/canon/', 301),
    ]
    
    for path, expected_code in redirects_to_test:
        url = BASE + path
        res = fetch(url, follow_redirects=False)
        passed = (res['status'] == expected_code)
        test_entry = {
            'category': 'redirect_policy',
            'path': path,
            'url': url,
            'expected_status': expected_code,
            'actual_status': res['status'],
            'latency_ms': res['latency_ms'],
            'location': res['headers'].get('location'),
            'passed': passed,
            'error': res['error']
        }
        report['results'].append(test_entry)
        report['summary']['total'] += 1
        if passed:
            report['summary']['passed'] += 1
        else:
            report['summary']['failed'] += 1

    # 3. AI Discovery & Machine Catalogs
    discovery_to_test = [
        ('/llms.txt', 'text/plain'),
        ('/llms.json', 'application/json'),
        ('/page.json', 'application/json'),
        ('/sitemap.xml', 'xml'),
        ('/.well-known/ard.json', 'application/json'),
        ('/.well-known/ai-catalog.json', 'application/json'),
    ]
    for path, exp_type in discovery_to_test:
        url = BASE + path
        res = fetch(url, follow_redirects=True)
        passed = (res['status'] == 200 and res['body_len'] > 50)
        test_entry = {
            'category': 'discovery_artifact',
            'path': path,
            'url': url,
            'expected_status': 200,
            'actual_status': res['status'],
            'latency_ms': res['latency_ms'],
            'content_sha256': res['sha256'],
            'passed': passed,
            'error': res['error']
        }
        report['results'].append(test_entry)
        report['summary']['total'] += 1
        if passed:
            report['summary']['passed'] += 1
        else:
            report['summary']['failed'] += 1

    # 4. Live Commodity Backends via Public Ingress
    commodities_to_test = [
        ('/gold/api/snapshot', 'gold'),
        ('/oil/api/snapshot', 'oil'),
        ('/gas/api/snapshot', 'gas')
    ]
    for path, asset in commodities_to_test:
        url = BASE + path
        res = fetch(url, follow_redirects=True)
        valid_json = False
        try:
            data = json.loads(res['body'].decode('utf-8'))
            if data.get('asset') == asset or data.get('schema') == 'wealth.snapshot.v1':
                valid_json = True
        except:
            pass
        passed = (res['status'] == 200 and valid_json)
        test_entry = {
            'category': 'commodity_backend',
            'path': path,
            'url': url,
            'expected_status': 200,
            'actual_status': res['status'],
            'latency_ms': res['latency_ms'],
            'asset_verified': asset if valid_json else None,
            'passed': passed,
            'error': res['error']
        }
        report['results'].append(test_entry)
        report['summary']['total'] += 1
        if passed:
            report['summary']['passed'] += 1
        else:
            report['summary']['failed'] += 1

    # 5. Non-Recursive Path Verification
    res_gold_recurse = fetch(BASE + '/gold/gold/', follow_redirects=False)
    gold_clean_passed = (res_gold_recurse['status'] == 404)
    test_entry = {
        'category': 'routing_safety',
        'path': '/gold/gold/',
        'url': BASE + '/gold/gold/',
        'expected_status': 404,
        'actual_status': res_gold_recurse['status'],
        'description': 'Ensure /gold/gold/ returns 404 and does not trigger recursive loop',
        'passed': gold_clean_passed,
        'error': res_gold_recurse['error']
    }
    report['results'].append(test_entry)
    report['summary']['total'] += 1
    if gold_clean_passed:
        report['summary']['passed'] += 1
    else:
        report['summary']['failed'] += 1

    return report

if __name__ == '__main__':
    rep = run_contract_tests()
    out_file = '/root/arif-fazil.com/receipts/contract-verification-receipt.json'
    with open(out_file, 'w') as f:
        json.dump(rep, f, indent=2)
    print(f"Contract Test Results: {rep['summary']['passed']}/{rep['summary']['total']} passed, {rep['summary']['failed']} failed.")
    if rep['summary']['failed'] > 0:
        for r in rep['results']:
            if not r['passed']:
                print(f"  FAIL: {r['path']} (Expected {r.get('expected_status')}, got {r.get('actual_status')}) - {r.get('error')}")
        sys.exit(1)
    else:
        print("All contract tests PASSED.")
