import locations from "./countries.json";

export const STATES_SET = new Set(
  locations.flatMap((country) => country.states.map((s) => s.value)),
);

export const CITIES_SET = new Set(
  locations.flatMap((country) =>
    country.states.flatMap((state) => state.cities.map((c) => c.value)),
  ),
);

export const CITY_TO_STATE: Record<string, string> = Object.fromEntries(
  locations.flatMap((country) =>
    country.states.flatMap((state) =>
      state.cities.map((city) => [city.value, state.value]),
    ),
  ),
);

export const STATE_LABELS: Record<string, string> = Object.fromEntries(
  locations.flatMap((country) => country.states.map((s) => [s.value, s.label])),
);

export const CITY_LABELS: Record<string, string> = Object.fromEntries(
  locations.flatMap((country) =>
    country.states.flatMap((state) =>
      state.cities.map((c) => [c.value, c.label]),
    ),
  ),
);
