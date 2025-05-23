# SurvivorQuest Monorepo

**SurvivorQuest** to platforma dla firm i organizatorów, umożliwiająca prowadzenie nowoczesnych gier terenowych, eventów integracyjnych i team buildingu z wykorzystaniem aplikacji mobilnej, panelu admina i backendu.

## Struktura

- `apps/mobile` – aplikacja mobilna (React Native + Expo) dla uczestników: mapa, zadania, punkty, tryb offline/SOS
- `apps/admin` – panel administratora (React + Vite + Tailwind) do zarządzania grą, scenariuszami, rankingami
- `apps/backend` – backend API (Node.js + Express + MongoDB) do obsługi użytkowników, gier, scoringu, autoryzacji
- `packages/shared` – współdzielone moduły (TypeScript)

## Szybki start

1. Instalacja zależności:
   ```sh
   pnpm install
   ```
2. Uruchomienie aplikacji mobilnej:
   ```sh
   npm run mobile
   ```
3. Uruchomienie panelu admina:
   ```sh
   npm run admin
   ```
4. Uruchomienie backendu:
   ```sh
   npm run backend
   ```

## Skrypty

- `npm run mobile` – startuje Expo (React Native)
- `npm run admin` – startuje panel admina (Vite + React + Tailwind)
- `npm run backend` – startuje backend (Express)

## Stack technologiczny

- **Frontend (mobile):** React Native + Expo
- **Frontend (web):** React.js + Vite + Tailwind CSS
- **Backend:** Node.js + Express + MongoDB
- **Mapy:** Mapbox GL
- **Auth:** Firebase Auth / JWT

---

Platforma pozwala na:

- Tworzenie i zarządzanie grami terenowymi oraz zadaniami
- Śledzenie postępów i rankingów zespołów w czasie rzeczywistym
- Integrację z mapami, scoringiem, trybem offline i awaryjnym
- Eksport wyników i raportów dla firm

Wspólny kod i typy umieszczaj w `packages/shared`. Każda aplikacja korzysta z workspace pnpm.
