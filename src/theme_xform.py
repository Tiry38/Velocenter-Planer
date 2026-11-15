"""Erzeugt aus dem App-CSS eine reine Farb-Überschreibung (dunkel -> hell).
Nur Farbeigenschaften werden ausgegeben, gleiche Selektoren, gleiche Werte bis auf die Farben.
Layout-Eigenschaften (display, width, grid, padding ...) werden nie ausgegeben."""
import re, sys, math

# ---------- Farbe ----------
NAMED = {'white': (255,255,255,1), 'black': (0,0,0,1), '#fff': None}
def s2l(c):
    c/=255; return c/12.92 if c<=0.04045 else ((c+0.055)/1.055)**2.4
def l2s(c):
    c = 12.92*c if c<=0.0031308 else 1.055*(c**(1/2.4))-0.055
    return max(0,min(255,round(c*255)))
def rgb2ok(r,g,b):
    r,g,b=s2l(r),s2l(g),s2l(b)
    l=0.4122214708*r+0.5363325363*g+0.0514459929*b
    m=0.2119034982*r+0.6806995451*g+0.1073969566*b
    s=0.0883024619*r+0.2817188376*g+0.6299787005*b
    l,m,s=[math.copysign(abs(x)**(1/3),x) for x in (l,m,s)]
    L=0.2104542553*l+0.7936177850*m-0.0040720468*s
    A=1.9779984951*l-2.4285922050*m+0.4505937099*s
    B=0.0259040371*l+0.7827717662*m-0.8086757660*s
    return L,math.hypot(A,B),math.atan2(B,A)
def ok2rgb(L,C,h):
    for _ in range(30):
        A,B=C*math.cos(h),C*math.sin(h)
        l=(L+0.3963377774*A+0.2158037573*B)**3
        m=(L-0.1055613458*A-0.0638541728*B)**3
        s=(L-0.0894841775*A-1.2914855480*B)**3
        r=4.0767416621*l-3.3077115913*m+0.2309699292*s
        g=-1.2684380046*l+2.6097574011*m-0.3413193965*s
        b=-0.0041960863*l-0.7034186147*m+1.7076147010*s
        if all(-0.001<=x<=1.001 for x in (r,g,b)) or C<0.002: break
        C*=0.92
    return l2s(r),l2s(g),l2s(b)
INK=(27,30,37)
def fmt(r,g,b,a):
    if a>=0.999: return '#%02X%02X%02X'%(r,g,b)
    return 'rgba(%d,%d,%d,%s)'%(r,g,b,('%.3f'%a).rstrip('0').rstrip('.'))

def conv(rgba, kind, ctx):
    r,g,b,a = rgba
    L,C,h = rgb2ok(r,g,b)
    neutral = C < 0.045
    if kind=='bg':
        if neutral:
            if L > 0.62:   # helle Schleier auf dunklem Grund -> dunkle Schleier auf hellem Grund
                return fmt(*INK, min(1,a*0.9))
            # dunkle Fläche -> helle, kühle Silberfläche
            Ln = 0.995 - max(0,L-0.12)*0.5
            if a>=0.5: a=max(a,0.96)   # Flächen deckend, damit der Hintergrund (Metall/Striche) nicht durchscheint
            return fmt(*ok2rgb(Ln, 0.006, 4.4), a)
        if L < 0.5:  # dunkle Farbtöne -> zarte helle Tönung gleicher Farbe
            Ln = 0.955 - max(0,L-0.2)*0.25
            return fmt(*ok2rgb(Ln, min(C,0.07)*0.6+0.012, h), a)
        if a < 0.6:  # leuchtende Tönung: etwas kräftiger, damit sie auf Hell sichtbar bleibt
            return fmt(*ok2rgb(min(L,0.66), C, h), a*0.8)
        return fmt(r,g,b,a)
    if kind=='text':
        if ctx.get('solidbg'): return fmt(r,g,b,a)
        if neutral:
            if L > 0.5:
                Ln = 0.24 + (1-L)*0.95
                return fmt(*ok2rgb(Ln, C*0.5, h), a)
            return fmt(r,g,b,a)
        if L > 0.56:
            return fmt(*ok2rgb(0.5 - max(0,(0.12-C))*0.4, C, h), a)
        return fmt(r,g,b,a)
    if kind=='border':
        if neutral:
            if L > 0.62: return fmt(*INK, min(1,a*0.9+0.03))
            return fmt(*ok2rgb(0.90 - max(0,L-0.2)*0.3, 0.008, 4.4), a)
        if L < 0.45:
            return fmt(*ok2rgb(0.86, min(C,0.08), h), a)
        if L > 0.62: return fmt(*ok2rgb(0.6, C, h), a)
        return fmt(r,g,b,a)
    if kind=='shadow':
        if neutral and L < 0.35:   # Schatten: weich
            return fmt(40,44,60, a*0.32)
        if neutral: return fmt(r,g,b,a)   # helle Lichtkanten bleiben
        return fmt(*ok2rgb(min(L,0.62),C,h), a*0.38)  # Leuchten gedämpft
    return fmt(r,g,b,a)

HEX=re.compile(r'#([0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3,4})\b')
FUN=re.compile(r'rgba?\(\s*([0-9.]+%?)\s*[, ]\s*([0-9.]+%?)\s*[, ]\s*([0-9.]+%?)\s*(?:[,/]\s*([0-9.]+%?)\s*)?\)')
def parse_hex(x):
    if len(x) in (3,4): x=''.join(c*2 for c in x)
    r,g,b=int(x[0:2],16),int(x[2:4],16),int(x[4:6],16); a=int(x[6:8],16)/255 if len(x)==8 else 1
    return (r,g,b,a)
def pn(v,scale=255):
    return float(v[:-1])*scale/100 if v.endswith('%') else float(v)
COLRE=re.compile(HEX.pattern+'|'+FUN.pattern+r'|\b(white|black)\b')
def xvalue(val, kind, ctx):
    # Farben in Funktionen wie url(...) nicht anfassen
    out=[];i=0
    for m in COLRE.finditer(val):
        pre=val[:m.start()]
        if pre.count('url(')>pre.count(')') : continue
        if m.group(1): rgba=parse_hex(m.group(1))
        elif m.group(2): rgba=(pn(m.group(2)),pn(m.group(3)),pn(m.group(4)),pn(m.group(5),1) if m.group(5) else 1)
        else: rgba=(255,255,255,1) if m.group(6)=='white' else (0,0,0,1)
        k=kind
        out.append(val[i:m.start()]); out.append(conv(rgba,k,ctx)); i=m.end()
    out.append(val[i:])
    return ''.join(out)

PROPS={'color':'text','fill':'text','stroke':'text','-webkit-text-fill-color':'text','caret-color':'text','accent-color':'bg',
 'background':'bg','background-color':'bg','background-image':'bg',
 'border':'border','border-color':'border','border-top':'border','border-bottom':'border','border-left':'border','border-right':'border',
 'border-top-color':'border','border-bottom-color':'border','border-left-color':'border','border-right-color':'border','outline':'border','outline-color':'border',
 'border-block-end':'border','border-block-start':'border','border-inline-start':'border','border-inline-end':'border','column-rule':'border','text-decoration-color':'border',
 'box-shadow':'shadow','text-shadow':'shadow','filter':'shadow','scrollbar-color':'border','stop-color':'bg'}

def has_color(v):
    return bool(COLRE.search(v)) or 'color-scheme' in v

def split_decls(body):
    out=[];depth=0;cur='';q=None
    for ch in body:
        if q:
            cur+=ch
            if ch==q: q=None
            continue
        if ch in '"\'': q=ch
        if ch=='(': depth+=1
        if ch==')': depth-=1
        if ch==';' and depth==0: out.append(cur);cur=''
        else: cur+=ch
    if cur.strip(): out.append(cur)
    return out

def solid_bg(decls):
    for p,v in decls:
        if p in ('background','background-color','background-image'):
            for m in COLRE.finditer(v):
                if m.group(1): rgba=parse_hex(m.group(1))
                elif m.group(2): rgba=(pn(m.group(2)),pn(m.group(3)),pn(m.group(4)),pn(m.group(5),1) if m.group(5) else 1)
                else: continue
                L,C,h=rgb2ok(*rgba[:3])
                if C>=0.08 and rgba[3]>=0.75 and L>=0.45: return True
            if re.search(r'var\(--(red|ok|warn|cyan|pink|blue|violet|orange|ac)\)',v) and 'transparent' not in v and 'color-mix' not in v: return True
    return False

def xblock(body):
    decls=[]
    for d in split_decls(body):
        if ':' not in d: continue
        p,v=d.split(':',1); p=p.strip().lower(); v=v.strip()
        decls.append((p,v))
    ctx={'solidbg':solid_bg(decls)}
    res=[]
    for p,v in decls:
        if p=='color-scheme': res.append('color-scheme:light'); continue
        if p.startswith('--'): continue
        k=PROPS.get(p)
        if not k: continue
        if k=='text' and re.fullmatch(r'var\(--(wpfg|uc|tc|ac|sc|tx|lc|kc|hc|c|cc)(,[^()]*)?\)\s*(!important)?',v):
            res.append(p+':oklch(from '+v.replace('!important','').strip()+' calc(min(l,0.5) - 0.26*(1 - min(c/0.05,1))) c h)'+(' !important' if '!important' in v else '')); continue
        if not COLRE.search(v): continue
        imp='!important' if '!important' in v else ''
        vv=v.replace('!important','').strip()
        nv=xvalue(vv,k,ctx)
        if nv!=vv:
            res.append(p+':'+nv+imp)
            if p=='background':  # Kurzform setzt Clip/Größe/Lage zurück -> aus derselben Regel wieder setzen
                for q,w in decls:
                    if q.startswith('background-') or q=='-webkit-background-clip':
                        res.append(q+':'+w)
    return ';'.join(res)

def strip_comments(css):
    return re.sub(r'/\*.*?\*/','',css,flags=re.S)

def walk(css):
    """liefert transformiertes CSS (gleiche Struktur, nur Farbregeln)"""
    out=[];i=0;n=len(css)
    while i<n:
        j=css.find('{',i)
        if j<0: break
        sel=css[i:j].strip()
        # passende Klammer suchen
        depth=1;k=j+1;q=None
        while k<n and depth:
            ch=css[k]
            if q:
                if ch==q: q=None
            elif ch in '"\'': q=ch
            elif ch=='{': depth+=1
            elif ch=='}': depth-=1
            k+=1
        inner=css[j+1:k-1]
        if sel.startswith('@keyframes') or sel.startswith('@-webkit-keyframes'):
            # Keyframes komplett neu ausgeben (Farben umgerechnet, Rest gleich)
            frames=[];ii=0
            for m in re.finditer(r'([^{}]+)\{([^{}]*)\}',inner):
                body=m.group(2);parts=[]
                for d in split_decls(body):
                    if ':' not in d: continue
                    p,v=d.split(':',1);p=p.strip();v=v.strip();kk=PROPS.get(p.lower())
                    parts.append(p+':'+(xvalue(v,kk,{}) if kk else v))
                frames.append(m.group(1).strip()+'{'+';'.join(parts)+'}')
            if any(COLRE.search(f) for f in frames): out.append(sel+'{'+''.join(frames)+'}')
        elif sel.startswith('@media') or sel.startswith('@supports') or sel.startswith('@container') or sel.startswith('@layer'):
            sub=walk(inner)
            if sub.strip(): out.append(sel+'{'+sub+'}')
        elif sel.startswith('@'):
            pass
        else:
            b=xblock(inner)
            if b: out.append(sel+'{'+b+'}')
        i=k
    return '\n'.join(out)

if __name__=='__main__':
    html=open(sys.argv[1]).read()
    css=re.search(r'<style>(.*?)</style>',html,re.S).group(1)
    # Schrift-Link etc. am Anfang entfernen
    css=strip_comments(css)
    res=walk(css)
    open(sys.argv[2],'w').write(res)
    print(len(css),len(res))
