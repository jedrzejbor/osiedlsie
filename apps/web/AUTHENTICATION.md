# Integracja autentykacji Frontend + Backend

## ✅ Co zostało zaimplementowane

### Backend (NestJS + PostgreSQL)
- ✅ Rejestracja użytkowników z walidacją Zod
- ✅ Logowanie z bcrypt i JWT
- ✅ Endpointy: `/api/auth/register`, `/api/auth/login`
- ✅ Guards: `JwtAuthGuard`, `RolesGuard`
- ✅ Dekoratory: `@CurrentUser()`, `@Roles()`

### Frontend (Next.js)
- ✅ Auth Context z React Context API
- ✅ API Client z obsługą JWT tokenów
- ✅ Strony logowania i rejestracji z walidacją
- ✅ Middleware do ochrony chronionych stron
- ✅ Przechowywanie tokenów w cookies
- ✅ Przechowywanie danych użytkownika w localStorage
- ✅ Automatyczne przekierowania
- ✅ Wyświetlanie błędów z backendu

## 🚀 Jak to działa

### 1. Rejestracja nowego użytkownika

**Frontend:**
```typescript
// Użytkownik wypełnia formularz na /register
const { register } = useAuth();
await register({ email, password, name });
// Automatyczne przekierowanie do /main
```

**Backend:**
```typescript
POST /api/auth/register
{
  "email": "user@example.com",
  "password": "password123",
  "name": "Jan Kowalski"
}

// Odpowiedź:
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

### 2. Logowanie użytkownika

**Frontend:**
```typescript
const { login } = useAuth();
await login({ email, password });
// Token zapisany w cookies, dane użytkownika w localStorage
```

**Backend:**
```typescript
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "password123"
}
```

### 3. Chronione strony

**Middleware automatycznie sprawdza:**
- Czy użytkownik ma token w cookies
- Przekierowuje do `/login` jeśli brak tokenu
- Przekierowuje do `/main` jeśli zalogowany próbuje dostać się do `/login` lub `/register`

**Chronione ścieżki:**
- `/main` - strona główna (dla zalogowanych)
- `/konto` - profil użytkownika
- `/ogloszenia/nowe` - dodawanie ogłoszenia

### 4. Wylogowanie

```typescript
const { logout } = useAuth();
logout(); // Czyści token i localStorage, przekierowuje do /login
```

## 📁 Struktura plików

```
apps/web/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx          # Strona logowania
│   │   └── register/page.tsx       # Strona rejestracji
│   ├── konto/page.tsx               # Profil użytkownika
│   └── main/page.tsx                # Strona główna (chroniona)
├── components/
│   ├── layout/MainNav.tsx           # Nawigacja z auth
│   └── providers.tsx                # AuthProvider wrapper
├── contexts/
│   └── auth-context.tsx             # Context autentykacji
├── lib/
│   ├── api-client.ts                # HTTP client
│   ├── auth-storage.ts              # Zarządzanie cookies/localStorage
│   ├── config.ts                    # Konfiguracja API
│   ├── services/
│   │   └── auth.service.ts          # Serwis autentykacji
│   └── types/
│       └── auth.ts                  # Typy TypeScript
└── middleware.ts                    # Ochrona stron
```

## 🔐 Bezpieczeństwo

### Token JWT
- Przechowywany w **cookies** z flagą `httpOnly` (w produkcji)
- Ważność: 7 dni (konfigurowalne w `.env`)
- Automatycznie dodawany do requestów przez `api-client`

### Dane użytkownika
- Podstawowe dane w `localStorage` (bez hasła)
- Pełne dane pobierane z API przy potrzebie

### Middleware
- Sprawdza token przed dostępem do chronionych stron
- Automatyczne przekierowania
- Zapobiega dostępowi do stron auth gdy użytkownik zalogowany

## 🎯 Użycie w komponentach

### Dostęp do danych użytkownika
```tsx
'use client';

import { useAuth } from '@/contexts/auth-context';

export function MyComponent() {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <div>Ładowanie...</div>;
  
  if (!isAuthenticated) return <div>Zaloguj się</div>;

  return (
    <div>
      <p>Witaj, {user?.name || user?.email}!</p>
      <p>Twoja rola: {user?.role}</p>
    </div>
  );
}
```

### Chroniony komponent
```tsx
'use client';

import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function ProtectedComponent() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) return <div>Ładowanie...</div>;
  if (!isAuthenticated) return null;

  return <div>Chroniona zawartość</div>;
}
```

### Wywołanie API z autentykacją
```tsx
import { apiClient } from '@/lib/api-client';

// Automatycznie dodaje token z cookies
const profile = await apiClient.get('/users/profile', true);
```

## 🧪 Testowanie

### 1. Uruchom backend
```bash
cd apps/api
pnpm dev
# Backend na http://localhost:3001
```

### 2. Uruchom frontend
```bash
cd apps/web
pnpm dev
# Frontend na http://localhost:3000
```

### 3. Przetestuj flow
1. Otwórz http://localhost:3000
2. Kliknij "Rejestracja"
3. Wypełnij formularz i zarejestruj się
4. Zostaniesz przekierowany do `/main`
5. Sprawdź nawigację - pokaże się Twój email
6. Przejdź do "Moje konto" - zobaczysz swoje dane
7. Kliknij "Wyloguj" - zostaniesz przekierowany do `/login`

## 🔄 Przepływ danych

```
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│   Browser   │      │   Frontend  │      │   Backend   │
│             │      │   Next.js   │      │   NestJS    │
└─────────────┘      └─────────────┘      └─────────────┘
       │                     │                     │
       │  1. Submit form     │                     │
       │────────────────────>│                     │
       │                     │                     │
       │                     │  2. POST /register  │
       │                     │────────────────────>│
       │                     │                     │
       │                     │  3. JWT + user data │
       │                     │<────────────────────│
       │                     │                     │
       │                     │ 4. Save to cookies  │
       │                     │    & localStorage   │
       │                     │                     │
       │  5. Redirect /main  │                     │
       │<────────────────────│                     │
       │                     │                     │
       │  6. Access /main    │                     │
       │────────────────────>│                     │
       │                     │                     │
       │                     │ 7. Check middleware │
       │                     │    (token exists)   │
       │                     │                     │
       │  8. Render page     │                     │
       │<────────────────────│                     │
```

## 📝 Zmienne środowiskowe

### Backend (`apps/api/.env`)
```env
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=osiedlsie
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
PORT=3001
```

### Frontend (`apps/web/.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

## 🐛 Debugging

### Token nie jest dodawany do requestów
- Sprawdź czy token jest w cookies: DevTools → Application → Cookies
- Sprawdź `authStorage.getToken()`

### Przekierowanie nie działa
- Sprawdź middleware: `apps/web/middleware.ts`
- Sprawdź czy ścieżka jest w `protectedRoutes` lub `authRoutes`

### Użytkownik nie jest zapisany
- Sprawdź localStorage: DevTools → Application → Local Storage
- Sprawdź `authStorage.getUser()`

### CORS errors
- Sprawdź konfigurację w `apps/api/src/main.ts`
- Frontend musi być na `localhost:3000`, backend na `localhost:3001`

## 🎊 Gotowe!

Autentykacja działa end-to-end:
- ✅ Rejestracja użytkowników
- ✅ Logowanie z JWT
- ✅ Ochrona chronionych stron
- ✅ Przechowywanie sesji
- ✅ Wylogowanie
- ✅ Wyświetlanie danych użytkownika
- ✅ Walidacja formularzy
- ✅ Obsługa błędów

Możesz teraz:
1. Rozbudować profil użytkownika
2. Dodać reset hasła
3. Dodać potwierdzenie email
4. Implementować kolejne funkcje aplikacji
