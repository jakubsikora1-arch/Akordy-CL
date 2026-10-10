# Kytara – trenér akordů a strummingu

Webová aplikace (PWA) pro výuku a procvičování hry na kytaru. Běží v prohlížeči (iPhone/Safari i desktop), jde nainstalovat na plochu a základní části fungují i offline.

## Struktura projektu

```
/
├── index.html                 aplikace (HTML, CSS, JS, vestavěné nahrávky)
├── sw.js                      service worker (offline režim)
├── manifest.webmanifest       konfigurace PWA
├── icon-32.png                favicon
├── icon-180.png               apple-touch-icon
├── icon-192.png               ikona aplikace
├── icon-512.png               ikona aplikace
├── icon-maskable-512.png      maskable ikona
├── icon-source.svg            zdroj ikony
├── A.wav … Dsus4.wav          15 doplňujících akordových zvuků
├── AUDIO-LICENSES.md          původ a licence zvuků
├── SONGS.md                   seznam písní pro cvičení
└── README.md
```

Aplikace a všechny její provozní soubory jsou v kořeni projektu. Doplňující WAVy se načítají z kořene při přehrání a service worker je ukládá pro offline použití.

## Záložky

Dolní navigace: **Domů, Akordy, Hraj, Rytmus, Lekce, Statistiky**.

### Domů
Přehled: pokračování v rozpracované/další lekci, celkový postup (%), počet zahraných akordů a cvičení rytmu, průměrná shoda akordů, průměr v rytmu, série dní, tři nejméně procvičené akordy, poslední cvičení rytmu a rychlý start. Statistiky se zobrazují po přihlášení.

### Akordy
- slovník 20 akordů s grafickým hmatem: C, D, E, G, A, F, Am, Dm, Em, Hm, C7, D7, E7, G7, A7, H7, Cmaj7, Fmaj7, Asus2, Dsus4,
- přehrání akustické nahrávky pro všech 20 akordů, případně syntetického zvuku,
- po přihlášení vlastní nahrávka akordu: nahrání souboru (wav, mp3, ogg, webm, m4a, max. 5 MB) nebo 3 s z mikrofonu, případně smazání,
- tlačítko **Detaily** otevře překryv (cca 3/4 obrazovky) s kontrolou akordu.

### Kontrola ladění
V záložce **Akordy** je ladička pro standardní ladění E2–A2–D3–G3–H3/B3–E4. Spustí mikrofon, rozpozná slyšenou výšku tónu, ukáže frekvenci a odchylku v centech a označí, zda je struna pod laděním, nad laděním, nebo naladěná. Pro nejlepší výsledek brnkni na jednu strunu a nech ji znít. Mikrofon vyžaduje HTTPS nebo localhost.

### Hraj
Přehrávač ukázkových akordových postupů s přehráním/pozastavením a posuvníkem, nastavitelným tempem a rytmem. Zobrazuje aktuální i následující hmat na hmatníku a pohyblivé šipky úhozu v rytmu. Zvuk je syntetický doprovod sestavený z akustických samplů kytary; obsahuje základní cvičební postupy.

### Kontrola akordu mikrofonem
Využívá Web Audio API a spektrální analýzu (FFT) mikrofonního vstupu:
1. vstup se převede na chromagram (12 tónových tříd),
2. porovnává se se šablonou akordu (50 % teorie, 50 % reálná nahrávka nebo vlastní kalibrace),
3. akord je správně při shodě alespoň 85 %, přítomnosti všech potřebných tónů a bez tónů navíc,
4. zobrazí se rozpoznaný akord, shoda, série a počet správných pokusů.

Funkce **Naučit z mého hraní** uloží vlastní profil akordu (lokálně a po přihlášení i do cloudu), **Smazat mé kalibrace** je odstraní. Do statistik se ukládají jen úspěšně zahrané akordy. Výsledek je orientační – závisí na ladění, mikrofonu, hluku a dozvuku. Mikrofon vyžaduje HTTPS nebo localhost.

### Rytmus
- tempo 40–200 BPM,
- 8 vzorů: čtvrťové údery dolů, osminy dolů-nahoru, pop/folk, country, balada, reggae (offbeat), valčík 3/4, rock 16tiny,
- postup akordů (např. `Am C G D`) a počet taktů na akord (1, 2, 4),
- metronom, přehrávání ukázky úderů, zvýraznění aktuálního úderu, zobrazení aktuálního a následujícího akordu,
- volitelné hodnocení rytmu mikrofonem (doporučena sluchátka): časování, odchylka v ms a procento úderů v rytmu. Hodnotí se jen časování, ne směr úderu ani struny.

Legenda: ↓ úder dolů, ↑ úder nahoru, – pauza (ruka se pohybuje dál).

### Lekce
3 sekce, 9 lekcí (základní akordy a strumming, pokročilé akordy a barré, rytmus do hloubky). Lekci lze označit jako hotovou; tlačítko „Procvičit“ otevře příslušný akord nebo nastavení rytmu.

### Statistiky
Počty úspěšně zahraných akordů s průměrnou shodou a posledních 10 cvičení rytmu (načítá se max. 1000 posledních záznamů).

## Ukládání dat

**Lokálně (localStorage):** nastavení (`gtrSettings`), vlastní profily akordů (`gtrRefs`), hotové lekce (`gtrLessonsDone`), fronta změn lekcí (`gtrLessonsQueue`), fronta statistik (`gtrStatsQueue`), poslední otevřená lekce (`gtrLessonLast`).

**Cloud (Supabase, po přihlášení e-mailem a heslem):** tabulky `profiles`, `settings`, `chord_profiles`, `recordings` (soubory v úložišti `recordings`), `practice_stats`, `lesson_progress`. Knihovna Supabase se načítá z CDN (jsDelivr). Offline se statistiky a postup v lekcích ukládají do fronty v zařízení a po připojení se odešlou.

## PWA a offline režim

Manifest (`manifest.webmanifest`): název *Kytara – trenér akordů a strummingu*, krátký název *Kytara*, jazyk `cs`, režim `standalone`, orientace na výšku, `start_url`, `scope` i `id` jsou `./`. Ikony: 180, 192 a 512 px (any) a maskable ikona (soubor má 1254×1254 px).

Service worker (`sw.js`), cache `kytara-v2`:
- při instalaci uloží `./`, `index.html`, `manifest.webmanifest`, ikony (`?v=2`), všechny vestavěné doplňující WAVy a knihovnu Supabase z CDN,
- HTML: nejdřív síť (timeout 4 s), při výpadku kopie z cache,
- ikony, manifest a knihovna z CDN: z cache s obnovou na pozadí,
- požadavky na Supabase API (`*.supabase.co`, `*.supabase.in`) se nikdy neukládají do cache,
- při aktivaci se smažou starší cache s předponou `kytara-`.

`VERSION` v `sw.js` měň jen při přidání nebo odebrání souborů v `SHELL`. Při výměně ikon pod stejným názvem zvyš i parametr `?v=` (v HTML, manifestu a `sw.js`).

## Instalace na iPhone

Po nasazení přes HTTPS: otevři aplikaci v Safari → Sdílet → Přidat na plochu → spusť z nové ikony.

## Lokální spuštění

Neotevírej `index.html` dvojklikem (mikrofon a service worker to vyžadují). V kořeni projektu spusť:

```
python3 -m http.server 8080
```

a otevři `http://localhost:8080`.

Zdroje a licence doplňujících zvuků popisuje [AUDIO-LICENSES.md](AUDIO-LICENSES.md). Původní nahrávky C, D, G, Em a Am zůstávají beze změny v `index.html`.

## Nasazení na GitHub Pages

1. Vytvoř repozitář a nahraj všechny soubory do kořene.
2. Settings → Pages → Deploy from a branch → větev `main`, složka `/ (root)`.
3. Po nasazení otevři HTTPS adresu GitHub Pages.
4. V Supabase nastav Site URL a redirect URL na tuto adresu.

## Omezení

- Rozpoznávání akordů je orientační a analyzuje výšky tónů, ne jednotlivé struny.
- Přechody mezi akordy aplikace neměří, dokončení lekce je ruční.
- Neúspěšné pokusy se do statistik neukládají.
- Aplikace nemá rozpoznávání celé písně ani časovou osu akordů.
