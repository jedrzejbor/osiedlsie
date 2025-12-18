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

### Development (wszystkie aplikacje)
```bash
pnpm dev
```

### Frontend (web)
```bash
pnpm --filter web dev
```

### Backend (api)
```bash
pnpm --filter api dev
```

API będzie dostępne na: `http://localhost:3001/api`

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
