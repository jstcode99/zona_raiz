'use client'

import {
    MapPin,
    Bed,
    Bath,
    Maximize2,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { ListingEntity, listingTypeLabels } from '@/domain/entities/listing.entity';
import {
    Card,
    CardHeader,
    CardTitle,
    CardAction,
    CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface FeaturedListingCardProps {
    listing: ListingEntity;
}

export const FeaturedListingCard = ({ listing }: FeaturedListingCardProps) => {
    const { t } = useTranslation();
    const property = listing.property;
    const images = property.property_images || [];
    const mainImage = images.length > 0 ? images[0].public_url : null;

    return (
        <Card
            className="overflow-hidden cursor-pointer pt-0 card-hover active:scale-[0.99] transition-all min-w-70 max-w-70"
        >
            <div className="relative h-40 overflow-hidden">
                {mainImage ? (
                    <img
                        src={mainImage}
                        alt={property.title}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                        <span className="text-muted-foreground">{t('words:without_image')}</span>
                    </div>
                )}

                <div className="absolute top-3 left-3 flex gap-2">
                    <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm">
                        {listingTypeLabels[listing.listing_type]}
                    </Badge>
                    {listing.featured && (
                        <Badge className="bg-amber-500 hover:bg-amber-600 capitalize">
                            {t('words:featured')}
                        </Badge>
                    )}
                </div>
            </div>

            <div className="p-4">
                <div className="text-lg font-bold text-primary">
                    {listing.currency} {listing.price.toLocaleString('es-ES')}
                    {listing.price_negotiable && <span className="text-xs font-normal text-muted-foreground ml-1">{t('words:negotiable')}</span>}
                </div>

                <h3 className="font-semibold text-foreground line-clamp-1 mt-1 capitalize">{property.title}</h3>

                <div className="flex items-center gap-1 mt-1.5 text-muted-foreground">
                    <MapPin className="size-4 shrink-0" />
                    <span className="text-sm truncate capitalize">{property.neighborhood || property.city}</span>
                </div>

                <div className="flex items-center gap-4 mt-3">
                    {property.bedrooms !== null && property.bedrooms > 0 && (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Bed className="size-4" />
                            <span>{property.bedrooms}</span>
                        </div>
                    )}
                    {property.bathrooms !== null && property.bathrooms > 0 && (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Bath className="size-4" />
                            <span>{property.bathrooms}</span>
                        </div>
                    )}
                    {property.total_area && (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Maximize2 className="size-4" />
                            <span>{property.total_area} m²</span>
                        </div>
                    )}
                </div>
            </div>
        </Card>
    );
}

interface FeaturedListingsSliderProps extends React.ComponentProps<"div"> {
    listings: ListingEntity[];
}

export function FeaturedListingsSlider({ listings, ...props }: FeaturedListingsSliderProps) {
    const { t } = useTranslation('common');

    const scrollRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const scrollAmount = 300;
            scrollRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    if (listings.length === 0) {
        return null;
    }

    return (
        <Card className="relative" {...props}>
            <CardHeader>
                <CardTitle className="text-base">
                    {t('sections:features_listings')}
                </CardTitle>
                <CardAction className='flex gap-2'>
                    <Button onClick={() => scroll('left')}>
                        <ChevronLeft className="size-4" />
                    </Button>
                    <Button onClick={() => scroll('right')}>
                        <ChevronRight className="size-4" />
                    </Button>
                </CardAction>
            </CardHeader>
            <CardContent className="flex-col items-start text-sm lg:min-h-92">
                <div
                    ref={scrollRef}
                    className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {listings.map((listing) => (
                        <FeaturedListingCard key={listing.id} listing={listing} />
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
