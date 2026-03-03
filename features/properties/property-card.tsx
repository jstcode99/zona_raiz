import {
    MapPin,
    Bed,
    Bath,
    Maximize2,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

import { PropertyEntity, propertyTypeLabels } from '@/domain/entities/property.entity';

interface PropertyCardProps {
    property: PropertyEntity;
    images: string[];
}

export const PropertyCard = ({ property, images = [] }: PropertyCardProps) => {
    return (
        <Card
            className="overflow-hidden cursor-pointer card-hover active:scale-[0.99] transition-all"
        >
            {/* Image */}
            <div className="relative h-48 overflow-hidden">
                <img
                    src={images[0]}
                    alt={property.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />

                {/* Badges */}
                <div className="absolute top-3 left-3 flex gap-2">
                    <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm">
                        {propertyTypeLabels[property.property_type]}
                    </Badge>
                </div>
            </div>

            {/* Content */}
            <div className="p-4">
                <h3 className="font-semibold text-foreground line-clamp-1">{property.title}</h3>

                <div className="flex items-center gap-1 mt-1.5 text-muted-foreground">
                    <MapPin className="w-3.5 h-3.5 shrink-0" />
                    <span className="text-sm truncate">{property.neighborhood || property.city}</span>
                </div>

                {/* Features */}
                <div className="flex items-center gap-4 mt-3">
                    {property.bedrooms !== null && property.bedrooms > 0 && (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Bed className="w-4 h-4" />
                            <span>{property.bedrooms}</span>
                        </div>
                    )}
                    {property.bathrooms !== null && property.bathrooms > 0 && (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Bath className="w-4 h-4" />
                            <span>{property.bathrooms}</span>
                        </div>
                    )}
                    {property.total_area && (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Maximize2 className="w-4 h-4" />
                            <span>{property.total_area} m²</span>
                        </div>
                    )}
                </div>
            </div>
        </Card>
    );
}
