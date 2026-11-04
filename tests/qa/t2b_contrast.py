# QA bagian 2: kontras WCAG dari token CSS (light & dark). Jalankan: python3 tests/qa/t2b_contrast.py
import re,sys
css=open('styles/main.css').read()
def tokens(block):
    return dict(re.findall(r'--([a-z0-9-]+):\s*(#[0-9A-Fa-f]{6})',block))
light=tokens(css.split('@media (prefers-color-scheme: dark)')[0])
dark=tokens(re.search(r':root\[data-theme="dark"\]\s*\{(.*?)\}',css,re.S).group(1))
def lum(h):
    c=[int(h[i:i+2],16)/255 for i in (1,3,5)]
    c=[x/12.92 if x<=0.03928 else ((x+0.055)/1.055)**2.4 for x in c]
    return .2126*c[0]+.7152*c[1]+.0722*c[2]
def cr(a,b):
    la,lb=lum(a),lum(b); 
    if la<lb: la,lb=lb,la
    return (la+.05)/(lb+.05)
bad=0
for name,T in (('light',light),('dark',dark)):
    pairs=[('c-text','c-bg',4.5),('c-text','c-surface',4.5),('c-text','c-surface-2',4.5),('c-text-muted','c-bg',4.5),('c-text-muted','c-surface',4.5),('c-text-muted','c-surface-2',4.5),
     ('c-primary','c-bg',4.5),('c-primary','c-surface',4.5),('c-primary','c-surface-2',4.5),('c-on-primary','c-primary',4.5),
     ('c-info-fg','c-info-bg',4.5),('c-ok-fg','c-ok-bg',4.5),('c-warn-fg','c-warn-bg',4.5),('c-danger-fg','c-danger-bg',4.5),
     ('c-info-fg','c-bg',4.5),('c-warn-fg','c-bg',4.5),('c-danger-fg','c-bg',4.5),('c-ok-fg','c-bg',4.5),
     ('c-border','c-bg',3.0),('c-border','c-surface',3.0),('c-focus','c-bg',3.0),('c-focus','c-surface',3.0)]
    for i in range(6): pairs.append((f'tier-{i}-fg',f'tier-{i}-bg',4.5)); pairs.append((f'tier-{i}-accent',f'tier-{i}-bg',3.0)); pairs.append((f'tier-{i}-fg','c-surface',4.5))
    for f,b,m in pairs:
        r=cr(T[f],T[b]); flag='OK ' if r>=m else 'FAIL'
        if r<m: bad+=1
        print(f'{name:5} {flag} {f:15} on {b:12} {r:5.2f} (min {m})')
print('GAGAL:',bad)
