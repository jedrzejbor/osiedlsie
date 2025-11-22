// Przykładowe dane, jakie mogłyby przyjść z backendu dla filtrów
// Później możesz je zastąpić fetchem z API.

export type ListingType = "SIEDLISKO" | "DZIALKA" | "DOM_DZIALKA";

export type FilterConfig = {
  provinces: string[];
  price: {
    min: number;
    max: number;
    step: number;
  };
  plotArea: {
    min: number;
    max: number;
    step: number;
  };
  listingTypes: {
    value: ListingType;
    label: string;
  }[];
  tags: {
    value: string;
    label: string;
  }[];
};

export const filtersConfig: FilterConfig = {
  provinces: [
    "Dowolne",
    "Podkarpackie",
    "Warmińsko-Mazurskie",
    "Lubelskie",
    "Małopolskie",
    "Podlaskie",
  ],
  price: {
    min: 50000,
    max: 1500000,
    step: 50000,
  },
  plotArea: {
    min: 1000,    // m²
    max: 50000,
    step: 1000,
  },
  listingTypes: [
    { value: "SIEDLISKO", label: "Siedlisko" },
    { value: "DZIALKA", label: "Działka pod siedlisko" },
    { value: "DOM_DZIALKA", label: "Dom + działka" },
  ],
  tags: [
    { value: "PRZY_LESIE", label: "Przy lesie" },
    { value: "BEZ_SASIADOW", label: "Bez sąsiadów 300 m" },
    { value: "DO_REMONTU", label: "Do remontu" },
    { value: "GOTOWE", label: "Gotowe do zamieszkania" },
  ],
};
