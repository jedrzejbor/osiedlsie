# 🎉 Backend dla logowania i rejestracji - Gotowe!

## Co zostało zaimplementowane:

### ✅ Struktura backendu
- **NestJS** - nowoczesny framework backend
- **TypeORM** - ORM do obsługi PostgreSQL
- **PostgreSQL** - baza danych
- **JWT** - bezpieczna autentykacja z tokenami
- **Passport** - strategie autentykacji
- **bcrypt** - bezpieczne haszowanie haseł

### ✅ Moduły

#### 1. **Users Module** (`src/users/`)
- `User` entity z polami: id, email, password, name, role
- `UsersService` - logika biznesowa użytkowników
- `UsersController` - przykładowe endpointy (publiczne, chronione, admin)

#### 2. **Auth Module** (`src/auth/`)
- `AuthService` - logika rejestracji i logowania
- `AuthController` - endpointy `/api/auth/register` i `/api/auth/login`
- `JwtStrategy` - strategia walidacji tokenów JWT
- `JwtAuthGuard` - guard do ochrony endpointów
- `RolesGuard` - guard do sprawdzania ról
- Dekoratory: `@CurrentUser()`, `@Roles()`

### ✅ Konfiguracja

#### Pliki środowiskowe:
- `.env.example` - szablon konfiguracji
- `.env` - konfiguracja development (dodana do .gitignore)

#### Zmienne środowiskowe:
```env
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=osiedlsie
JWT_SECRET=dev-secret-key
JWT_EXPIRES_IN=7d
PORT=3001
NODE_ENV=development
```

### ✅ API Endpoints

#### Autentykacja:
- `POST /api/auth/register` - Rejestracja nowego użytkownika
- `POST /api/auth/login` - Logowanie użytkownika

#### Użytkownicy (przykłady):
- `GET /api/users/profile` - Profil zalogowanego użytkownika (chronione)
- `GET /api/users/admin` - Dane dla admina (tylko dla roli ADMIN)
- `GET /api/users/public` - Publiczne dane (dostępne dla wszystkich)

### ✅ Bezpieczeństwo

- **Haszowanie haseł**: bcrypt z 10 rundami
- **JWT tokeny**: bezpieczne, z konfigurowalnością czasu wygaśnięcia (7 dni)
- **CORS**: skonfigurowany dla frontendu (localhost:3000)
- **Walidacja**: Zod schemas współdzielone z frontendem
- **SQL Injection**: zabezpieczenia TypeORM
- **Role-based access**: system ról (USER, ADMIN)

### ✅ Dokumentacja i narzędzia

1. **README.md** - kompletna dokumentacja backendu
2. **API_TESTING.md** - przykłady testowania z curl/httpie
3. **api-test.http** - plik do testowania w VS Code (REST Client)
4. **scripts/init-db.sh** - automatyczny skrypt inicjalizacji bazy danych

### ✅ Walidacja danych

Walidacja wykorzystuje Zod schemas z `@workspace/zod-validation`:
- `userRegisterSchema` - walidacja rejestracji
- `userLoginSchema` - walidacja logowania
- Błędy zwracane w czytelnym formacie JSON

## 🚀 Jak uruchomić?

### 1. Zainstaluj zależności
```bash
cd /Users/jedrek/Desktop/osiedlsie
pnpm install
```

### 2. Skonfiguruj bazę danych
```bash
cd apps/api
cp .env.example .env
# Edytuj .env z własnymi danymi

# Inicjalizuj bazę danych
./scripts/init-db.sh
```

### 3. Uruchom backend
```bash
pnpm dev
```

Backend będzie dostępny na: `http://localhost:3001/api`

### 4. Testuj API

**Opcja A: REST Client w VS Code**
- Zainstaluj rozszerzenie "REST Client"
- Otwórz `api-test.http`
- Klikaj "Send Request" przy każdym endpoincie

**Opcja B: curl**
```bash
# Rejestracja
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","name":"Jan"}'

# Logowanie
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

## 📝 Przykład użycia w kontrolerach

```typescript
import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('example')
export class ExampleController {
  // Endpoint chroniony - wymaga zalogowania
  @Get('protected')
  @UseGuards(JwtAuthGuard)
  getProtected(@CurrentUser() user: any) {
    return { message: 'Dane dla zalogowanego użytkownika', user };
  }

  // Endpoint tylko dla adminów
  @Get('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  getAdminOnly(@CurrentUser() user: any) {
    return { message: 'Dane tylko dla administratora', user };
  }

  // Endpoint publiczny
  @Get('public')
  getPublic() {
    return { message: 'Dostępne dla wszystkich' };
  }
}
```

## 🔄 Następne kroki

### Gotowe do implementacji:
1. ✅ Autentykacja i autoryzacja
2. ✅ Rejestracja i logowanie użytkowników
3. ✅ Ochrona endpointów z JWT
4. ✅ System ról (USER, ADMIN)

### Do rozważenia w przyszłości:
- [ ] Reset hasła (już masz schematy Zod w `zod-validation`)
- [ ] Potwierdzenie email
- [ ] Refresh tokeny
- [ ] Rate limiting
- [ ] Logger (Winston, Pino)
- [ ] Swagger/OpenAPI documentation
- [ ] Testy jednostkowe i E2E
- [ ] Docker Compose dla dev environment
- [ ] Migrations (jeśli chcesz kontrolować schemat bazy)

## 🔗 Integracja z frontendem

Backend jest skonfigurowany do współpracy z frontendem Next.js:
- **CORS**: włączony dla `localhost:3000`
- **API prefix**: wszystkie endpointy pod `/api`
- **Wspólna walidacja**: Zod schemas z `@workspace/zod-validation`
- **JWT**: token do wysyłania w headerze `Authorization: Bearer {token}`

### Przykład z frontendu (Next.js):
```typescript
// Logowanie
const response = await fetch('http://localhost:3001/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password }),
});
const { accessToken, user } = await response.json();

// Chroniony request
const profileResponse = await fetch('http://localhost:3001/api/users/profile', {
  headers: { 'Authorization': `Bearer ${accessToken}` },
});
```

## 🎊 Gotowe!

Backend dla autentykacji jest w pełni funkcjonalny i gotowy do użycia. 

Możesz teraz:
1. Uruchomić backend i przetestować endpointy
2. Zintegrować z frontendem Next.js
3. Dodawać kolejne moduły (ogłoszenia, wiadomości, etc.)
