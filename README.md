# GuiChords

Samostatná progresivní webová aplikace (PWA) pro výuku a procvičování hry na kytaru. Je navržena pro iPhone/Safari i desktopové prohlížeče a může fungovat také v offline režimu.

Přehled

Aplikace kombinuje procvičování akordů, přehrávání skutečných nahrávek, orientační kontrolu zahraného akordu přes mikrofon a rytmický trénink.

Aplikace je vytvořena jako client-side webová aplikace bez nutnosti serverového backendu pro základní funkce.

Funkce

Akordy

• grafické zobrazení hmatů akordů
• výběr akordu z nabídky
• automatické přehrání nahrávky při výběru akordu
• samostatné tlačítko pro přehrání akordu
• zobrazení informace, zda je pro akord dostupná skutečná nahrávka
• orientační kontrola zahraného akordu pomocí mikrofonu
• simulace správného zahrání pro testování statistiky

Aplikace obsahuje tyto akordy:

• C – C dur
• D – D dur
• Dm – D moll
• E – E dur
• Em – E moll
• F – F dur
• G – G dur
• A – A dur
• Am – A moll
• B – H dur
• Bm – H moll

Zvukové nahrávky

V kořeni projektu jsou aktuálně tyto skutečné stereo WAV nahrávky akustické kytary:

• C.wav
• D.wav
• G.wav
• Em.wav
• Am.wav

Nahrávky se přehrávají přímo jako WAV soubory. Aplikace pro chybějící akordy nevytváří syntetický zvuk.

Kontrola akordu přes mikrofon

Kontrola používá Web Audio API a spektrální analýzu mikrofonního vstupu.

Princip:

1. aplikace požádá o přístup k mikrofonu,
2. několik sekund analyzuje zvuk,
3. pomocí FFT získává spektrální data,
4. převádí frekvence na třídy tónů,
5. porovnává zjištěné tóny s tóny jednotlivých akordů,
6. vybere nejpravděpodobnější akord a porovná jej s očekávaným akordem.

Výsledek je pouze orientační. Přesnost ovlivňuje zejména ladění kytary, kvalita a umístění mikrofonu, vzdálenost od kytary, okolní hluk, dozvuk místnosti a způsob zahrání.

Mikrofonní funkce proto není určena jako laboratorně přesný tuner nebo profesionální audio analyzátor.

Požadavky na mikrofon

Přístup k mikrofonu vyžaduje zabezpečený kontext:

• HTTPS při použití přes internet,
• nebo localhost při lokálním vývoji.

Prohlížeč musí mít současně povolení k použití mikrofonu.

Rytmický trenér

Rytmická část obsahuje:

• nastavení tempa 40–220 BPM,
• takt 4/4,
• takt 3/4,
• takt 6/8,
• několik strumming patternů,
• vizuální zvýraznění aktuálního úderu,
• metronomický zvuk,
• počítání taktů,
• start/stop tréninku.

Dostupné patterny

4/4

• D D D D
• D U D U
• D D U U D U
• D - D U - U
• D U - U D U

3/4

• D D D
• D U D
• D - U D

6/8

• D - U D - U
• D U D U D U

Legenda:

• D = úhoz dolů
• U = úhoz nahoru
• - = pauza

Náhodný trénink

Režim náhodného tréninku automaticky vybere jeden ze tří taktů, náhodný pattern daného taktu a tempo mezi 70–120 BPM.

Výukový plán

1. Základní akordy – C, G, D, Em a Am; každý akord držet 4 doby.
2. Přechody – C → G, G → D a Am → C bez zastavení.
3. Rytmus – začít patternem D U D U při 70 BPM.
4. První písnička – spojit akordy, přechody a rytmus do souvislé hry.

Statistiky

Aplikace lokálně ukládá statistiky pomocí localStorage.

Sledují se:

• počet kontrol akordů,
• počet správných výsledků,
• úspěšnost v procentech,
• počet spuštěných rytmických tréninků,
• nejvyšší použité BPM.

Statistiky jsou uloženy pod klíčem guitarTrainer.

K dispozici je také ruční reset statistik.

PWA a offline režim

Aplikace je připravena jako PWA. Manifest definuje název Guitar Trainer CZ, krátký název Guitar Trainer, jazyk cs, režim standalone, startovní URL ./, rozsah ./ a barvy aplikace.

Service Worker zajišťuje lokální cache důležitých souborů aplikace.

Cachované soubory

• index.html
• style.css
• app.js
• manifest.json
• icon.svg
• C.wav
• D.wav
• G.wav
• Em.wav
• Am.wav

Při instalaci Service Worker uloží tyto soubory do cache. Při načítání požadavku nejprve zkontroluje cache; pokud soubor není dostupný, pokusí se jej načíst ze sítě a následně uložit do cache.

Pokud síť selže, Service Worker použije jako fallback index.html.

Cache je verzována jako:

guitar-trainer-cz-v4

Při aktivaci nové verze se staré cache odstraní.

Instalace na iPhone

Po nasazení přes HTTPS:

1. otevři aplikaci v Safari,
2. klepni na Sdílet,
3. zvol Přidat na plochu,
4. spusť aplikaci z nové ikony.

Lokální spuštění

Aplikaci není vhodné otevírat pouze dvojklikem na index.html, zejména pokud chceš používat mikrofon nebo Service Worker.

V kořeni projektu spusť:

python3 -m http.server 8080

Potom otevři:

http://localhost:8080

GitHub Pages

1. Vytvoř GitHub repository.
2. Nahraj všechny soubory do kořene repository.
3. Otevři Settings → Pages.
4. Nastav Deploy from a branch.
5. Vyber větev main.
6. Vyber složku / (root).
7. Po nasazení otevři HTTPS adresu GitHub Pages.

Struktura projektu

/
├── index.html
├── style.css
├── app.js
├── manifest.json
├── sw.js
├── icon.svg
├── C.wav
├── D.wav
├── G.wav
├── Em.wav
└── Am.wav

|Soubor                                       |Účel                                               |
|---------------------------------------------|---------------------------------------------------|
|`index.html`                                 |HTML rozhraní aplikace                             |
|`style.css`                                  |vzhled, rozložení a responzivita                   |
|`app.js`                                     |logika, audio, mikrofon, rytmus, lekce a statistiky|
|`manifest.json`                              |konfigurace PWA                                    |
|`sw.js`                                      |Service Worker a offline cache                     |
|`icon.svg`                                   |ikona aplikace                                     |
|`C.wav`, `D.wav`, `G.wav`, `Em.wav`, `Am.wav`|skutečné akustické nahrávky akordů                 |

Technické informace

Aplikace používá:

• HTML5
• CSS3
• JavaScript
• Web Audio API
• MediaDevices / getUserMedia
• Web Storage API (localStorage)
• Service Worker API
• Web App Manifest
• WAV audio

Nejde o nativní iOS aplikaci. Jedná se o webovou aplikaci instalovatelnou jako PWA.

Omezení současné verze

• Reálné audio je dostupné pouze pro C, D, G, Em a Am.
• Ostatní akordy mají grafický hmat, ale v aktuálním balíčku nemají vlastní WAV nahrávku.
• Rozpoznávání akordů přes mikrofon je orientační.
• Statistiky jsou v aktuální verzi ukládány lokálně pomocí localStorage.
• Rytmický trenér používá vlastní metronomický zvuk.
• Aplikace zatím neobsahuje automatické rozpoznávání celé písně ani časovou osu akordů.

Stav projektu

Aktuální verze představuje funkční základ pro další rozšiřování.

Možné další směry vývoje:

• přesnější rozpoznávání akordů,
• kvalitnější audio přehrávač,
• trénink přechodů mezi akordy,
• měření rychlosti přechodů,
• pokročilejší strumming trenér,
• detailnější statistiky,
• rozšíření knihovny reálných nahrávek,
• postupné lekce a tréninkové úkoly,
• později přehrávání písně s časovou osou akordů.

────────

Guitar Trainer CZ
Výuková PWA pro procvičování kytarových akordů, reálných nahrávek a rytmu.