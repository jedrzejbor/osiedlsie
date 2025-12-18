# Testowanie API z użyciem curl lub httpie

## Rejestracja nowego użytkownika

```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Jan Kowalski"
  }'
```

lub z httpie:

```bash
http POST localhost:3001/api/auth/register \
  email=test@example.com \
  password=password123 \
  name="Jan Kowalski"
```

## Logowanie

```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

lub z httpie:

```bash
http POST localhost:3001/api/auth/login \
  email=test@example.com \
  password=password123
```

Odpowiedź zawiera token JWT:
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "test@example.com",
    "name": "Jan Kowalski",
    "role": "USER"
  }
}
```

## Użycie tokenu JWT w chronnych endpointach

```bash
curl -X GET http://localhost:3001/api/protected-route \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

lub z httpie:

```bash
http GET localhost:3001/api/protected-route \
  Authorization:"Bearer YOUR_JWT_TOKEN_HERE"
```

## Testowanie z Thunder Client / Postman

1. POST `http://localhost:3001/api/auth/register`
   - Body (JSON):
   ```json
   {
     "email": "test@example.com",
     "password": "password123",
     "name": "Jan Kowalski"
   }
   ```

2. POST `http://localhost:3001/api/auth/login`
   - Body (JSON):
   ```json
   {
     "email": "test@example.com",
     "password": "password123"
   }
   ```

3. Skopiuj `accessToken` z odpowiedzi

4. Dla chronionych endpointów dodaj header:
   - Key: `Authorization`
   - Value: `Bearer YOUR_ACCESS_TOKEN`
