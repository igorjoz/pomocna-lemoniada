# Lemoniada, która pomaga

Statyczna strona lokalnej akcji sprzedaży lemoniady i ciasta na rzecz leczenia Małgorzaty Rojek.

## Praca lokalna

```bash
npm install
npm run dev
```

Produkcyjny build:

```bash
npm run build
npm run preview
```

Strona jest publikowana automatycznie w GitHub Pages po wysłaniu zmian na gałąź `master`.

## Podmiana zdjęć

Placeholdery znajdują się w sekcji głównej i galerii w `index.html`. Przed opublikowaniem rozpoznawalnych zdjęć dzieci należy uzyskać zgodę ich opiekunów i uzupełnić rzeczowe teksty alternatywne.

## Easter eggi i mikroanimacje

Strona zawiera kilka lekkich efektów, które podkreślają jej radosny charakter:

- najechanie, fokus lub dotknięcie cytryny w logo uruchamia jej obrót;
- trzykrotne kliknięcie logo w ciągu 1,8 sekundy aktywuje „Kwaśną moc” i wybuch cytryn, serc oraz gwiazdek;
- na urządzeniu dotykowym potrójne dotknięcie logo uruchamia również deszcz cytryn;
- najechanie, fokus albo dotknięcie głównej ilustracji ożywia bąbelki, listki, plaster cytryny i serce;
- fokus lub najechanie na trzy kafelki akcji obraca cytrynę, kołysze ciasto albo wprawia serce w ruch;
- serca przy przyciskach wsparcia biją po najechaniu lub ustawieniu fokusu;
- udane udostępnienie albo skopiowanie linku wywołuje małą celebrację;
- wpisanie na klawiaturze sekwencji `LEMON` uruchamia ukryty deszcz cytryn.

Efekty nie korzystają z zewnętrznych bibliotek. Tymczasowe cząsteczki są automatycznie usuwane z DOM, nie przechwytują kliknięć i mają ograniczoną liczbę. Przy ustawieniu systemowym `prefers-reduced-motion: reduce` animacje przestrzenne są pomijane, a użytkownik otrzymuje wyłącznie komunikat tekstowy.


deployment info