#!/bin/bash

# Kolory dla output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Inicjalizacja bazy danych PostgreSQL dla projektu Osiedlsie${NC}\n"

# Sprawdź czy PostgreSQL jest zainstalowany
if ! command -v psql &> /dev/null; then
    echo -e "${RED}❌ PostgreSQL nie jest zainstalowany!${NC}"
    echo -e "${YELLOW}Zainstaluj PostgreSQL:${NC}"
    echo "  - macOS: brew install postgresql@16"
    echo "  - Ubuntu: sudo apt install postgresql"
    exit 1
fi

echo -e "${GREEN}✓ PostgreSQL jest zainstalowany${NC}"

# Wczytaj zmienne z .env jeśli istnieje
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
    echo -e "${GREEN}✓ Załadowano konfigurację z .env${NC}"
else
    echo -e "${YELLOW}⚠ Plik .env nie istnieje, używam wartości domyślnych${NC}"
    DATABASE_NAME=${DATABASE_NAME:-osiedlsie}
    DATABASE_USER=${DATABASE_USER:-postgres}
fi

echo -e "\n${YELLOW}Parametry bazy danych:${NC}"
echo "  Database: ${DATABASE_NAME}"
echo "  User: ${DATABASE_USER}"

# Sprawdź czy baza już istnieje
if psql -U "$DATABASE_USER" -lqt | cut -d \| -f 1 | grep -qw "$DATABASE_NAME"; then
    echo -e "\n${YELLOW}⚠ Baza danych '$DATABASE_NAME' już istnieje${NC}"
    read -p "Czy chcesz ją usunąć i utworzyć ponownie? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${YELLOW}Usuwam bazę danych...${NC}"
        dropdb -U "$DATABASE_USER" "$DATABASE_NAME"
        echo -e "${GREEN}✓ Baza danych usunięta${NC}"
    else
        echo -e "${GREEN}Zachowuję istniejącą bazę danych${NC}"
        exit 0
    fi
fi

# Utwórz bazę danych
echo -e "\n${YELLOW}Tworzę bazę danych...${NC}"
createdb -U "$DATABASE_USER" "$DATABASE_NAME"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Baza danych '$DATABASE_NAME' została utworzona${NC}"
    echo -e "\n${GREEN}🎉 Inicjalizacja zakończona pomyślnie!${NC}"
    echo -e "\n${YELLOW}Następne kroki:${NC}"
    echo "  1. Sprawdź konfigurację w pliku .env"
    echo "  2. Uruchom backend: pnpm dev"
    echo "  3. TypeORM automatycznie utworzy tabele przy pierwszym uruchomieniu"
else
    echo -e "${RED}❌ Błąd podczas tworzenia bazy danych${NC}"
    exit 1
fi
