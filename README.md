# BossGoldenStudio — strona wizytówka

Statyczna strona (HTML + CSS + JS, bez zależności) dla pracowni tworzącej stoły i blaty z litego drewna, river tables oraz kompozycje z kwiatami w żywicy.

## Uruchomienie
Otwórz `index.html` w przeglądarce lub wrzuć cały folder na dowolny hosting statyczny (GitHub Pages, Netlify, home.pl itp.).

## Do uzupełnienia
- **Dane kontaktowe** — `index.html`, sekcja `#kontakt` (telefon, e-mail, adres, linki social) oraz stała `STUDIO_EMAIL` w `assets/js/main.js`.
- **Zdjęcia realizacji** — kafelki w sekcji `#galeria` mają obecnie ilustracje zastępcze. Wstaw w `<figure class="tile">` element `<img src="..." alt="...">` i usuń atrybut `data-art`.
- **Formularz** — bez backendu otwiera program pocztowy z gotową wiadomością. Do wysyłki bezpośredniej podepnij np. Formspree lub Netlify Forms.

## Struktura
- `index.html` — treść: hero, oferta, realizacje, proces, konfigurator wymiarów, o nas, FAQ, kontakt
- `assets/css/styles.css` — style (paleta: orzech, złoto, turkus żywicy)
- `assets/js/main.js` — menu mobilne, galeria z filtrami i podglądem, konfigurator wymiarów, formularz
