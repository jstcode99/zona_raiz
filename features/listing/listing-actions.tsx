"use client";

import { useEffect, useState } from "react"; // Añadido para el origin
import { Share2 } from "lucide-react";
import { FavoriteToggleButton } from "../favorites/favorite-toggle-button";
import { Button } from "@/components/ui/button";
import { IconBrandWhatsapp } from "@tabler/icons-react";
import { ListingEntity } from "@/domain/entities/listing.entity";
import { useTranslation } from "react-i18next";
import { useRoutes } from "@/i18n/client-router";

interface ListingDetailProps {
  listing: ListingEntity | null | undefined;
  isFavInitial?: boolean;
}

export function ListingActions({
  listing,
  isFavInitial = false,
}: ListingDetailProps) {
  const { t } = useTranslation("listings");
  const routes = useRoutes();
  const [baseUrl, setBaseUrl] = useState("");

  useEffect(() => {
    setBaseUrl(window.location.origin);
  }, []);

  if (!listing) return null;

  const propertyUrl = `${baseUrl}${routes.listings_public(listing.property.slug)}`;
  const messageText = `Hola, me interesa esta propiedad, ${propertyUrl}`;
  const encodedMessage = encodeURIComponent(messageText);
  const whatsappLink = `https://wa.me/${listing.whatsapp_contact}?text=${encodedMessage}`;

  return (
    <div className="flex items-center py-2 space-x-1">
      {/* Cambiamos el Button para que sea el contenedor del link o usamos 'asChild' */}
      <Button
        className="grow bg-green-600/80 text-white hover:bg-green-600 hover:text-white"
        asChild
      >
        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2"
        >
          <IconBrandWhatsapp className="size-5" />
          {t("detail.actions.whatsapp")}
        </a>
      </Button>

      <div className="flex gap-1 items-center">
        <FavoriteToggleButton
          listingId={listing.id}
          isFavInitial={isFavInitial}
        />
        <Button title={t("detail.actions.share")} variant="ghost" size="icon">
          <Share2 className="w-5 h-5 stroke-[1.5]" />
        </Button>
      </div>
    </div>
  );
}
