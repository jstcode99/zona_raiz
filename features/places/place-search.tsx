"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { IconMapPin, IconLoader2, IconX } from "@tabler/icons-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { buildSearchUrl } from "@/i18n/client-router";
import { Lang } from "@/i18n/settings";
import { slugify } from "@/lib/utils";

type Prediction = {
  place_id: string;
  description: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
  terms: { value: string }[];
};

export type ParsedPlace = {
  city?: string;
  state?: string;
  neighborhood?: string;
  label?: string;
};

interface PlaceSearchProps {
  lang: Lang;
  placeholder?: string;
  className?: string;
  navigate?: boolean;
  onSelect?: (place: ParsedPlace) => void;
}

function useGooglePlaces() {
  const [ready, setReady] = useState(
    () => typeof window !== "undefined" && !!window.google?.maps?.places,
  );

  useEffect(() => {
    if (window.google?.maps?.places) return;

    const existing = document.getElementById("google-places-script");
    const onLoad = () => setReady(true);

    if (existing) {
      existing.addEventListener("load", onLoad);
      return () => existing.removeEventListener("load", onLoad);
    }

    const script = document.createElement("script");
    script.id = "google-places-script";
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.GOOGLE_MAPS_API_KEY}&libraries=places&language=es`;
    script.async = true;
    script.defer = true;
    script.addEventListener("load", onLoad);
    document.head.appendChild(script);
    return () => script.removeEventListener("load", onLoad);
  }, []);

  return ready;
}

// ─────────────────────────────────────────────
// Parsear desde los `terms` de la predicción
// terms[0] = barrio/ciudad, terms[1] = ciudad/estado, terms[2] = estado, terms[3] = país
// ─────────────────────────────────────────────
function parsePredictionTerms(prediction: Prediction): ParsedPlace {
  const terms = prediction.terms.map((t) => slugify(t.value));

  // Si hay 4+ términos: barrio, ciudad, estado, país
  if (terms.length >= 4) {
    return {
      neighborhood: terms[0],
      city: terms[1],
      state: terms[2],
    };
  }

  // Si hay 3 términos: ciudad, estado, país
  if (terms.length === 3) {
    return {
      city: terms[0],
      state: terms[1],
    };
  }

  // Si hay 2 términos: ciudad/estado, país
  if (terms.length === 2) {
    return {
      city: terms[0],
    };
  }

  return { city: terms[0] };
}

export function PlaceSearch({
  lang,
  placeholder = "Buscar ciudad, barrio...",
  className,
  navigate = true,
  onSelect,
}: PlaceSearchProps) {
  const router = useRouter();
  const ready = useGooglePlaces();
  const serviceRef = useRef<google.maps.places.AutocompleteService | null>(
    null,
  );

  const [query, setQuery] = useState("");
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<ParsedPlace | null>(null);
  const debounceRef = useRef<NodeJS.Timeout | undefined>(undefined);

  useEffect(() => {
    if (!ready) return;
    serviceRef.current = new google.maps.places.AutocompleteService();
  }, [ready]);

  const fetchPredictions = useCallback((input: string) => {
    if (!serviceRef.current || input.length < 2) {
      setPredictions([]);
      return;
    }
    clearTimeout(debounceRef.current);
    setLoading(true);
    debounceRef.current = setTimeout(() => {
      serviceRef.current!.getPlacePredictions(
        {
          input,
          componentRestrictions: { country: "co" },
          types: ["(regions)"],
        },
        (results, status) => {
          setLoading(false);
          if (status === google.maps.places.PlacesServiceStatus.OK && results) {
            setPredictions(results as unknown as Prediction[]);
          } else {
            setPredictions([]);
          }
        },
      );
    }, 300);
  }, []);

  const handleInput = (value: string) => {
    setSelected(null);
    setQuery(value);
    setOpen(value.length >= 2);
    fetchPredictions(value);
  };

  const handleSelect = (prediction: Prediction) => {
    setOpen(false);
    setPredictions([]);

    // Parsear directo desde los terms — sin Geocoder
    const parsed = parsePredictionTerms(prediction);
    const place = {
      ...parsed,
      label: prediction.structured_formatting.main_text,
    };

    setSelected(place);
    setQuery("");
    onSelect?.(place);

    if (navigate) {
      router.push(
        buildSearchUrl({
          lang,
          city: parsed.city,
          neighborhood: parsed.neighborhood,
        }),
      );
    }
  };

  const handleClear = () => {
    setSelected(null);
    setQuery("");
    onSelect?.({});
  };

  return (
    <div className={`relative ${className ?? ""}`}>
      <Command shouldFilter={false} className="rounded-xl border shadow-sm">
        <div className="flex items-center px-3 gap-2 min-h-[44px]">
          {loading ? (
            <IconLoader2 className="size-4 text-muted-foreground animate-spin shrink-0" />
          ) : (
            <IconMapPin className="size-4 text-muted-foreground shrink-0" />
          )}

          {selected ? (
            <div className="flex items-center gap-1.5 bg-primary/10 text-primary text-xs font-medium px-2.5 py-1 rounded-full border border-primary/20">
              <IconMapPin className="size-3" />
              <span>{selected.label}</span>
              <button
                type="button"
                onClick={handleClear}
                className="hover:text-destructive transition-colors ml-0.5"
              >
                <IconX className="size-3" />
              </button>
            </div>
          ) : (
            <CommandInput
              value={query}
              onValueChange={handleInput}
              placeholder={placeholder}
              className="border-0 focus:ring-0 h-10 px-0 flex-1"
            />
          )}
        </div>
      </Command>

      {open && (
        <div className="absolute z-50 w-full bg-popover border rounded-xl shadow-lg mt-1 overflow-hidden">
          <Command shouldFilter={false}>
            <CommandList>
              {predictions.length === 0 && !loading && (
                <CommandEmpty className="py-4 text-center text-sm text-muted-foreground">
                  Sin resultados
                </CommandEmpty>
              )}
              {predictions.length > 0 && (
                <CommandGroup heading="Lugares">
                  {predictions.map((p) => (
                    <CommandItem
                      key={p.place_id}
                      value={p.place_id}
                      onSelect={() => handleSelect(p)}
                      className="flex items-start gap-2 py-2.5 cursor-pointer"
                    >
                      <IconMapPin className="size-4 text-muted-foreground mt-0.5 shrink-0" />
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">
                          {p.structured_formatting.main_text}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {p.structured_formatting.secondary_text}
                        </span>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </div>
      )}
    </div>
  );
}
