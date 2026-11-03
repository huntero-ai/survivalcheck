#!/usr/bin/env python3
"""Validasi data/sources-to-buy.json. Jalankan: python3 -I tests/validate_buy.py"""
import json, re, sys, os
R = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
buy = json.load(open(os.path.join(R, 'data/sources-to-buy.json'), encoding='utf-8'))
items = [i['id'] for i in json.load(open(os.path.join(R, 'data/items.json'), encoding='utf-8'))['items']]
err = []
stypes = {s['id'] for s in buy['store_types']}
exp = {'minimarket','supermarket','traditional_market','pharmacy','medical_supply','hardware','electronics','outdoor','baby_store','pet_shop','online_marketplace','free_official'}
if stypes != exp: err.append('store_types beda dari i18n: %s' % (stypes ^ exp))
b = buy['items']
for i in items:
    if i not in b: err.append('item hilang: ' + i)
for k in b:
    if k not in items: err.append('item tak dikenal: ' + k)
PRICE = re.compile(r'(\bRp\b|\bIDR\b|\brb\b|\bribu\b|\bjuta\b|\bK\b\s*\d|(?<![A-Za-z])\d+\s*(rb|k)\b|\$|\bharga\b)', re.I)
def texts(o):
    if isinstance(o, str): yield o
    elif isinstance(o, dict):
        for v in o.values(): yield from texts(v)
    elif isinstance(o, list):
        for v in o: yield from texts(v)
for k, v in b.items():
    for key in ('stores','examples','diy','free_official','often_at_home','buy_tip'):
        if key not in v: err.append('%s: field %s hilang' % (k, key))
    for s in v.get('stores', []):
        if s not in stypes: err.append('%s: store tak valid %s' % (k, s))
    if len(set(v.get('stores', []))) != len(v.get('stores', [])): err.append(k + ': store dobel')
    if not isinstance(v.get('often_at_home'), bool): err.append(k + ': often_at_home bukan bool')
    for f in ('diy','buy_tip'):
        if v.get(f) is not None and not (v[f].get('id') and v[f].get('en')): err.append('%s: %s tak lengkap' % (k, f))
    fo = v.get('free_official')
    if fo is not None and not (fo.get('id') and fo.get('en') and fo.get('source')): err.append(k + ': free_official tak lengkap')
    for t in texts(v):
        if PRICE.search(t) or re.search(r'\d{4,}|\d[.,]\d{3}|\d\s*%', t): err.append('%s: angka/harga di teks: %r' % (k, t))
for s in buy['store_types']:
    for t in texts(s):
        if PRICE.search(t): err.append('store_type harga: ' + t)
if err:
    print('GAGAL'); [print(' -', e) for e in err]; sys.exit(1)
print('OK: %d item, %d jenis toko' % (len(b), len(stypes)))
