# BossGoldenStudio — strona wizytówka

Statyczna strona (HTML + CSS + JS, bez zależności) dla pracowni tworzącej stoły i blaty z litego drewna, river tables oraz kompozycje z kwiatami w żywicy.

## Uruchomienie
Otwórz `index.html` w przeglądarce lub wrzuć cały folder na dowolny hosting statyczny (GitHub Pages, Netlify, home.pl itp.).

## Formularz kontaktowy
Wiadomości z formularza trafiają na **boss.golden.studio@gmail.com** przez darmową usługę [FormSubmit](https://formsubmit.co) — bez własnego serwera.

1. Opublikuj stronę na hostingu (formularz nie działa z pliku otwartego lokalnie).
2. Wyślij pierwsze, testowe zapytanie przez formularz.
3. Na skrzynkę przyjdzie mail „Action Required: Activate FormSubmit” — kliknij **Activate Form** (jednorazowo).
4. Od tej chwili każde zapytanie przychodzi jako mail z tabelką; „Odpowiedz” trafia od razu do klienta, jeśli podał e-mail.

Gdy usługa jest chwilowo niedostępna, formularz otwiera program pocztowy klienta z gotową wiadomością. Adres zmienisz w stałej `STUDIO_EMAIL` w `assets/js/main.js`.

## Do uzupełnienia
- **Telefon i adres pracowni** — `index.html`, sekcja `#kontakt`.
- **Zdjęcia realizacji** — kafelki w sekcji `#galeria` mają obecnie ilustracje zastępcze. Wstaw w `<figure class="tile">` element `<img src="..." alt="...">` i usuń atrybut `data-art`.

## Logo
`assets/img/` — logo z przezroczystym tłem (`logo.webp`, `logo.png`) oraz ikony karty (`favicon.png`, `apple-touch-icon.png`).

## Struktura
- `index.html` — treść: hero, oferta, realizacje, proces, konfigurator wymiarów, o nas, FAQ, kontakt
- `assets/css/styles.css` — style (paleta: orzech, złoto, turkus żywicy)
- `assets/js/main.js` — menu mobilne, galeria z filtrami i podglądem, konfigurator wymiarów, formularz
