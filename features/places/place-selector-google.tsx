"use client";

import { useState, useCallback, useRef } from "react";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import usePlacesAutocomplete, { getGeocode, getLatLng } from "use-places-autocomplete";
import { Command, CommandInput, CommandList, CommandEmpty, CommandItem } from "@/components/ui/command";
import { useTranslation } from "react-i18next"
import { Input } from "@/components/ui/input";

export type PlaceData = {
  address: string;
  city: string;
  state: string;
  country: string;
  latitude: number;
  longitude: number;
  google_maps_url: string;
};

type PlaceSelectorProps = {
  onSelect: (place: PlaceData) => void;
  defaultPlace?: PlaceData; // Valor por defecto opcional
};

const mapContainerStyle = { width: "100%", height: "300px" };
const defaultCenter = { lat: 4.711, lng: -74.072 }; // Bogotá por defecto

export const PlaceSelectorGoogle: React.FC<PlaceSelectorProps> = ({ onSelect, defaultPlace }) => {
  const { t } = useTranslation('common')

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries: ["places"] as any,
  });

  const [selectedPlace, setSelectedPlace] = useState<PlaceData | null>(defaultPlace || null);
  const [markerPosition, setMarkerPosition] = useState<{ lat: number; lng: number } | null>(
    defaultPlace ? { lat: defaultPlace.latitude, lng: defaultPlace.longitude } : null
  );

  const mapRef = useRef<google.maps.Map | null>(null);
  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
    if (defaultPlace) {
      map.panTo({ lat: defaultPlace.latitude, lng: defaultPlace.longitude });
      map.setZoom(16);
    }
  }, [defaultPlace]);

  // Autocomplete
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    defaultValue: defaultPlace?.address || "",
  });

  const handleSelect = async (address: string) => {
    setValue(address, false);
    clearSuggestions();

    const results = await getGeocode({ address });
    const { lat, lng } = await getLatLng(results[0]);
    const address_components = results[0].address_components;

    const city =
      address_components.find((c) => c.types.includes("locality"))?.long_name ||
      address_components.find((c) => c.types.includes("administrative_area_level_2"))?.long_name ||
      "";
    const state =
      address_components.find((c) => c.types.includes("administrative_area_level_1"))?.long_name || "";
    const country = address_components.find((c) => c.types.includes("country"))?.long_name || "";

    const place: PlaceData = {
      address: results[0].formatted_address,
      city,
      state,
      country,
      latitude: lat,
      longitude: lng,
      google_maps_url: `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`,
    };

    setSelectedPlace(place);
    setMarkerPosition({ lat, lng });
    mapRef.current?.panTo({ lat, lng });
    mapRef.current?.setZoom(16);
  };

  const handleMarkerDragEnd = async (event: google.maps.MapMouseEvent) => {
    if (!event.latLng) return;
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();

    const results = await getGeocode({ location: { lat, lng } });
    const address_components = results[0].address_components;

    const city =
      address_components.find((c) => c.types.includes("locality"))?.long_name ||
      address_components.find((c) => c.types.includes("administrative_area_level_2"))?.long_name ||
      "";
    const state =
      address_components.find((c) => c.types.includes("administrative_area_level_1"))?.long_name || "";
    const country = address_components.find((c) => c.types.includes("country"))?.long_name || "";

    setSelectedPlace({
      address: results[0].formatted_address,
      city,
      state,
      country,
      latitude: lat,
      longitude: lng,
      google_maps_url: `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`,
    });

    setMarkerPosition({ lat, lng });
  };

  if (!isLoaded) return <div>{t("words.loadingMaps")}</div>;

  return (
    <div className="space-y-4">
      {/* Command search */}
      <Command>
        <CommandInput
          placeholder={t("words.searchPlace")}
          value={value}
          onValueChange={setValue}
          disabled={!ready}
        />
        <CommandList>
          <CommandEmpty>{t("words.noResults")}</CommandEmpty>
          {status === "OK" &&
            data.map((item) => (
              <CommandItem key={item.place_id} onSelect={() => handleSelect(item.description)}>
                {item.description}
              </CommandItem>
            ))}
        </CommandList>
      </Command>

      {/* Map */}
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={markerPosition || defaultCenter}
        zoom={markerPosition ? 16 : 12}
        onLoad={onMapLoad}
        onClick={(e) => {
          if (e.latLng) handleMarkerDragEnd({ latLng: e.latLng } as google.maps.MapMouseEvent);
        }}
      >
        {markerPosition && <Marker position={markerPosition} draggable onDragEnd={handleMarkerDragEnd} />}
      </GoogleMap>

      {/* Inputs dinámicos */}
      {selectedPlace && (
        <div className="space-y-2">
          <Input
            value={selectedPlace.address}
            placeholder={t("words.address")}
            onChange={(e) => setSelectedPlace({ ...selectedPlace, address: e.target.value })}
          />
          <div className="flex gap-2">
            <Input
              value={selectedPlace.city}
              placeholder={t("words.city")}
              onChange={(e) => setSelectedPlace({ ...selectedPlace, city: e.target.value })}
            />
            <Input
              value={selectedPlace.state}
              placeholder={t("words.state")}
              onChange={(e) => setSelectedPlace({ ...selectedPlace, state: e.target.value })}
            />
            <Input
              value={selectedPlace.country}
              placeholder={t("words.country")}
              onChange={(e) => setSelectedPlace({ ...selectedPlace, country: e.target.value })}
            />
          </div>
        </div>
      )}

      {/* Confirmar */}
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded-md"
        disabled={!selectedPlace}
        onClick={() => selectedPlace && onSelect(selectedPlace)}
      >
        {t("words.confirm")}
      </button>
    </div>
  );
};
