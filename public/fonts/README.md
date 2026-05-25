# Fonts

Nahraj sem licencované font súbory. Očakávané filenames (case-sensitive):

## PP Neue Montreal (display + nadpisy + ceny)
- `PPNeueMontreal-Medium.woff2` (weight 500)
- `PPNeueMontreal-Regular.woff2` (weight 400)

## Aeonik (body + bullety + meta)
- `Aeonik-Regular.woff2` (weight 400)
- `Aeonik-Medium.woff2` (weight 500)
- `Aeonik-Bold.woff2` (weight 700)

`@font-face` deklarácie sú v `app/globals.css`. Kým nedodáš `.woff2` súbory, font-stack spadne na fallback (Helvetica Neue, system sans). Stránka bude funkčná, len fonty budú generické.

Ak máš `.woff` fallbacky pre staršie prehliadače, pomenuj rovnako (`.woff` namiesto `.woff2`) — `@font-face` ich automaticky pridá.
