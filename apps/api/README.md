# Osiedlsie Backend API

Backend API dla projektu Osiedlsie zbudowany w NestJS z PostgreSQL.

## Wymagania

- Node.js (v18+)
- PostgreSQL (v14+)
- pnpm


1. Zainstaluj zależności z głównego folderu projektu:
```bash
pnpm install
```

2. Skopiuj `.env.example` do `.env` i dostosuj zmienne:
```bash
cp .env.example .env
```

3. Edytuj `.env` z własnymi danymi do bazy:
```env
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=twoje_haslo
DATABASE_NAME=osiedlsie
JWT_SECRET=zmien-na-bezpieczny-klucz
```

4. Skonfiguruj bazę danych PostgreSQL:

**Automatycznie (zalecane):**
```bash
./scripts/init-db.sh
```

**Ręcznie:**
```bash
# Utwórz bazę danych
createdb osiedlsie

# Lub za pomocą psql:
psql -U postgres
CREATE DATABASE osiedlsie;
```

## Uruchomienie

### Development
```bash
pnpm dev
```

### Production
```bash
pnpm build
pnpm start:prod
```

## Endpointy API

Wszystkie endpointy są dostępne pod prefiksem `/api`

### Autentykacja

#### Rejestracja
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "Jan Kowalski"
}
```

Odpowiedź:
```json
{
  "accessToken": "jwt.token.here",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "Jan Kowalski",
    "role": "USER"
  }
}
```

#### Logowanie
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

Odpowiedź:
```json
{
  "accessToken": "jwt.token.here",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "Jan Kowalski",
    "role": "USER"
  }
}
```

### Chronione endpointy

Aby uzyskać dostęp do chronionych endpointów, dołącz token JWT w nagłówku:
```http
Authorization: Bearer your.jwt.token.here
```

#### Przykłady:

**Pobierz profil użytkownika** (wymaga zalogowania):
```http
GET /api/users/profile
Authorization: Bearer your.jwt.token
```

**Endpoint dla admina** (wymaga roli ADMIN):
```http
GET /api/users/admin
Authorization: Bearer admin.jwt.token
```

**Publiczne dane** (nie wymaga logowania):
```http
GET /api/users/public
```

## Struktura projektu

```
src/
├── auth/               # Moduł autentykacji
│   ├── dto/           # Data Transfer Objects
│   ├── guards/        # Guards (JWT, Roles)
│   ├── strategies/    # Passport strategies
│   ├── decorators/    # Dekoratory (CurrentUser, Roles)
│   └── interfaces/    # Interfejsy TypeScript
├── users/             # Moduł użytkowników
│   ├── entities/      # Encje TypeORM
│   ├── dto/          # DTOs dla użytkowników
│   └── users.controller.ts  # Przykładowy kontroler
├── app.module.ts      # Główny moduł aplikacji
└── main.ts           # Entry point
```

## Jak używać autentykacji w kontrolerach

### Endpoint chroniony (wymaga zalogowania)
```typescript
@Get('profile')
@UseGuards(JwtAuthGuard)
getProfile(@CurrentUser() user: any) {
  return { user };
}
```

### Endpoint dla określonej roli
```typescript
@Get('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
getAdminData(@CurrentUser() user: any) {
  return { user };
}
```

### Endpoint publiczny
```typescript
@Get('public')
getPublicData() {
  return { message: 'Dostępne dla wszystkich' };
}
```

## Technologie

- **NestJS** - Framework backend
- **TypeORM** - ORM dla PostgreSQL
- **PostgreSQL** - Baza danych
- **JWT** - Autentykacja
- **bcrypt** - Haszowanie haseł
- **Zod** - Walidacja (współdzielona z frontendem)
- **Passport** - Strategie autentykacji

## Bezpieczeństwo

- Hasła są haszowane za pomocą bcrypt (10 rund)
- JWT tokeny z konfigurowalnością czasu wygaśnięcia
- CORS skonfigurowany dla bezpiecznej komunikacji z frontendem
- Walidacja danych wejściowych z Zod
- TypeORM z zabezpieczeniami przed SQL injection

## Development

### Testy
```bash
# Unit testy
pnpm test

# E2E testy
pnpm test:e2e

# Test coverage
pnpm test:cov
```

### Linting
```bash
pnpm lint
```

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
