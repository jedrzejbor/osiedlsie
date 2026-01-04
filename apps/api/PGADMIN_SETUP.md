# Konfiguracja bazy danych PostgreSQL w pgAdmin 4

## Wymagania
- PostgreSQL zainstalowany na komputerze
- pgAdmin 4 zainstalowany

## Krok 1: Uruchom PostgreSQL

### macOS (Homebrew):
```bash
# Sprawdź czy PostgreSQL jest zainstalowany
brew services list

# Uruchom PostgreSQL
brew services start postgresql@14

# Lub jeśli masz nowszą wersję:
brew services start postgresql
```

### macOS (Postgres.app):
1. Otwórz aplikację Postgres.app
2. Kliknij "Start" aby uruchomić serwer

### Sprawdź czy działa:
```bash
# Sprawdź czy port 5432 jest otwarty
lsof -i :5432

# Lub
psql postgres -c "SELECT version();"
```

## Krok 2: Otwórz pgAdmin 4

1. Uruchom pgAdmin 4 z Applications
2. Ustaw hasło główne (master password) jeśli jest to pierwsze uruchomienie

## Krok 3: Dodaj serwer PostgreSQL

### 3.1 Kliknij prawym przyciskiem na "Servers" → "Register" → "Server"

### 3.2 W zakładce "General":
- **Name**: `localhost` (lub `Osiedlsie Local`)
- **Server group**: Servers
- **Connect now**: ✓

### 3.3 W zakładce "Connection":
- **Host name/address**: `localhost`
- **Port**: `5432`
- **Maintenance database**: `postgres`
- **Username**: `postgres` (lub twoja nazwa użytkownika macOS)
- **Password**: (zostaw puste jeśli używasz autentykacji lokalnej, lub wpisz hasło jeśli je ustawiłeś)
- **Save password**: ✓ (opcjonalnie)

### 3.4 Kliknij "Save"

## Krok 4: Utwórz bazę danych "osiedlsie"

### Metoda 1: Przez pgAdmin 4 (GUI)

1. W lewym panelu rozwiń:
   - **Servers** → **localhost** (lub nazwa którą nadałeś)
   - Kliknij prawym na **Databases**
   - Wybierz **Create** → **Database...**

2. W oknie "Create - Database":
   - **Database**: `osiedlsie`
   - **Owner**: `postgres`
   - **Encoding**: `UTF8`
   - **Template**: `template0`
   - **Collation**: `pl_PL.UTF-8` (lub `en_US.UTF-8`)
   - **Character type**: `pl_PL.UTF-8` (lub `en_US.UTF-8`)

3. Kliknij **Save**

### Metoda 2: Przez Query Tool

1. W pgAdmin, kliknij prawym na **postgres** database
2. Wybierz **Query Tool**
3. Wpisz:
   ```sql
   CREATE DATABASE osiedlsie
       WITH 
       OWNER = postgres
       ENCODING = 'UTF8'
       LC_COLLATE = 'pl_PL.UTF-8'
       LC_CTYPE = 'pl_PL.UTF-8'
       TABLESPACE = pg_default
       CONNECTION LIMIT = -1;
   ```
4. Kliknij **Execute** (F5)

### Metoda 3: Przez terminal (najszybsza)

```bash
createdb osiedlsie
```

## Krok 5: Sprawdź czy baza została utworzona

1. W pgAdmin, rozwiń **Servers** → **localhost** → **Databases**
2. Powinieneś zobaczyć bazę **osiedlsie**
3. Kliknij na nią aby ją wybrać

## Krok 6: Skonfiguruj połączenie w aplikacji

### 6.1 Upewnij się że masz plik `.env` w folderze `apps/api/`:

```bash
cd /Users/jedrek/Desktop/osiedlsie/apps/api
cat .env
```

### 6.2 Jeśli nie istnieje lub jest niepoprawny, utwórz/edytuj:

```bash
cd /Users/jedrek/Desktop/osiedlsie/apps/api
nano .env
```

Wklej:
```env
# Database
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=
DATABASE_NAME=osiedlsie

# JWT
JWT_SECRET=dev-secret-key-change-in-production
JWT_EXPIRES_IN=7d

# App
PORT=3001
NODE_ENV=development
```

**Uwaga**: Jeśli ustawiłeś hasło dla użytkownika `postgres`, wpisz je w `DATABASE_PASSWORD=`

Zapisz: `Ctrl+O`, `Enter`, `Ctrl+X`

## Krok 7: Uruchom backend i sprawdź połączenie

```bash
cd /Users/jedrek/Desktop/osiedlsie/apps/api
pnpm dev
```

Powinieneś zobaczyć:
```
[Nest] LOG [InstanceLoader] TypeOrmModule dependencies initialized
[Nest] LOG [RoutesResolver] AppController {/}:
[Nest] LOG [RouterExplorer] Mapped {/api/auth/register, POST} route
[Nest] LOG [RouterExplorer] Mapped {/api/auth/login, POST} route
🚀 Application is running on: http://localhost:3001/api
```

## Krok 8: Sprawdź tabele w pgAdmin

1. W pgAdmin, rozwiń:
   - **Servers** → **localhost**
   - **Databases** → **osiedlsie**
   - **Schemas** → **public**
   - **Tables**

2. Powinieneś zobaczyć tabelę **users** (TypeORM utworzy ją automatycznie przy pierwszym uruchomieniu)

3. Kliknij prawym na **users** → **View/Edit Data** → **All Rows**

## Troubleshooting

### Problem: "role postgres does not exist"

```bash
# Utwórz użytkownika postgres
createuser -s postgres
```

### Problem: "password authentication failed"

1. Znajdź plik `pg_hba.conf`:
   ```bash
   psql -U postgres -c "SHOW hba_file;"
   ```

2. Edytuj plik i zmień metodę auth na `trust` dla localhost:
   ```
   # TYPE  DATABASE        USER            ADDRESS                 METHOD
   local   all             all                                     trust
   host    all             all             127.0.0.1/32            trust
   host    all             all             ::1/128                 trust
   ```

3. Zrestartuj PostgreSQL:
   ```bash
   brew services restart postgresql
   ```

### Problem: "Could not connect to server"

Sprawdź czy PostgreSQL działa:
```bash
# Sprawdź status
brew services list | grep postgres

# Sprawdź logi
tail -f /opt/homebrew/var/log/postgresql@14.log

# Lub
tail -f ~/Library/Application\ Support/Postgres/var-14/postgresql.log
```

### Problem: Nie widzę bazy "osiedlsie" w pgAdmin

1. Kliknij prawym na **Databases** → **Refresh**
2. Lub uruchom w Query Tool: `SELECT datname FROM pg_database;`

## Weryfikacja końcowa

### Test 1: Połączenie z backendem
```bash
curl http://localhost:3001/api/users/public
```

### Test 2: Rejestracja użytkownika
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User"
  }'
```

### Test 3: Sprawdź w pgAdmin
1. Otwórz tabelę **users** w pgAdmin
2. Powinieneś zobaczyć nowo utworzonego użytkownika
3. Hasło będzie zahashowane przez bcrypt

## Gotowe! 🎉

Teraz masz:
- ✅ PostgreSQL uruchomiony
- ✅ Bazę danych `osiedlsie` utworzoną
- ✅ pgAdmin 4 skonfigurowany i połączony
- ✅ Backend połączony z bazą danych
- ✅ Tabele utworzone automatycznie przez TypeORM

Możesz teraz:
- Przeglądać dane w pgAdmin
- Dodawać użytkowników przez API
- Wykonywać zapytania SQL w Query Tool
- Monitorować logi połączeń
