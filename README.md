# Osiedlsie - Portal ogłoszeń

Monorepo Turborepo z Next.js (frontend) i NestJS (backend API) dla portalu ogłoszeń nieruchomości.

## Struktura projektu

- `apps/web` - Frontend Next.js z shadcn/ui
- `apps/api` - Backend NestJS z PostgreSQL
- `packages/ui` - Współdzielone komponenty UI
- `packages/zod-validation` - Współdzielone schematy walidacji
- `packages/typescript-config` - Współdzielona konfiguracja TypeScript
- `packages/eslint-config` - Współdzielona konfiguracja ESLint

## Wymagania

- Node.js (v18+)
- pnpm
- PostgreSQL (v14+)

## Instalacja

```bash
pnpm install
```

## Konfiguracja bazy danych

1. Utwórz bazę danych PostgreSQL:
```bash
createdb osiedlsie
```

2. Skonfiguruj zmienne środowiskowe w `apps/api/.env`:
```env
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=twoje_haslo
DATABASE_NAME=osiedlsie
JWT_SECRET=twoj-bezpieczny-klucz
```

## Uruchomienie

### Krok 1: Uruchom bazę danych PostgreSQL
```bash
# Utwórz bazę danych
createdb osiedlsie

# Lub z psql:
psql -U postgres
CREATE DATABASE osiedlsie;
```

### Krok 2: Skonfiguruj zmienne środowiskowe

**Backend (`apps/api/.env`):**
```bash
cd apps/api
cp .env.example .env
# Edytuj .env z danymi do bazy
```

**Frontend (`apps/web/.env.local`):**
```bash
cd apps/web
cp .env.example .env.local
```

### Krok 3: Uruchom aplikacje

#### Development (wszystkie aplikacje)
```bash
pnpm dev
```

**Aplikacje będą dostępne pod:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001/api

### Frontend (web)
```bash
pnpm --filter web dev
```

### Backend (api)
```bash
pnpm --filter api dev
```

## 🔐 Autentykacja

System autentykacji został w pełni zintegrowany:

### Dostępne funkcje:
- ✅ Rejestracja użytkowników
- ✅ Logowanie z JWT
- ✅ Ochrona chronionych stron (middleware)
- ✅ Wylogowanie
- ✅ Zarządzanie sesją (cookies + localStorage)
- ✅ Walidacja formularzy (Zod)

### Strony:
- `/register` lub `/rejestracja` - Rejestracja
- `/login` lub `/logowanie` - Logowanie
- `/konto` - Profil użytkownika (chronione)
- `/main` - Strona główna dla zalogowanych (chronione)

### Dokumentacja:
- Backend: `apps/api/README.md`
- Frontend Auth: `apps/web/AUTHENTICATION.md`
- API Testing: `apps/api/API_TESTING.md`

## Endpointy API

### Autentykacja
- `POST /api/auth/register` - Rejestracja
- `POST /api/auth/login` - Logowanie

### Użytkownicy
- `GET /api/users/profile` - Profil (wymaga JWT)
- `GET /api/users/admin` - Admin (wymaga roli ADMIN)
- `GET /api/users/public` - Publiczne dane

Szczegółowa dokumentacja: `apps/api/README.md`

## Adding components

To add components to your app, run the following command at the root of your `web` app:

```bash
pnpm dlx shadcn@latest add button -c apps/web
```

This will place the ui components in the `packages/ui/src/components` directory.

## Tailwind

Your `tailwind.config.ts` and `globals.css` are already set up to use the components from the `ui` package.

## Using components

To use the components in your app, import them from the `ui` package.

```tsx
import { Button } from "@workspace/ui/components/button"
```
