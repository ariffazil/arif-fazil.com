#!/usr/bin/env python3
"""
test-registry-drift.py — Verifies canonical YAML artifact registry and its JSON projection match.
Canonical: canon/site-artifact-registry.yaml
Generated: canon/site-artifact-registry.json
"""
import yaml
import json
import sys

YAML_PATH = '/root/arif-fazil.com/canon/site-artifact-registry.yaml'
JSON_PATH = '/root/arif-fazil.com/canon/site-artifact-registry.json'

def test_drift():
    with open(YAML_PATH, 'r') as f:
        yaml_data = yaml.safe_load(f)
    with open(JSON_PATH, 'r') as f:
        json_data = json.load(f)
        
    if yaml_data == json_data:
        print("✓ Registry Parity: canon/site-artifact-registry.yaml matches .json projection deterministically.")
        return 0
    else:
        print("FAIL: Drift detected between site-artifact-registry.yaml and .json!")
        return 1

if __name__ == '__main__':
    sys.exit(test_drift())
