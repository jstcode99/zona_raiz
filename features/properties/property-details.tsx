"use client"

import { useState } from 'react';
import {
    MapPin,
    Bed,
    Bath,
    Maximize2,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { PropertyEntity } from '@/domain/entities/property.entity';

interface PropertyDetailProps {
    property: PropertyEntity;
    images: string[];
}

export const PropertyDetail = ({ property, images }: PropertyDetailProps) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    return (
        <div className="bg-background">
            {/* Content */}
            <div className="pt-2">
                {/* Image Gallery */}
                <div className="relative h-72">
                    <img
                        src={images[currentImageIndex]}
                        alt={property.title}
                        className="w-full h-full object-cover rounded-xl"
                    />

                    {/* Image indicators */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                        {images.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrentImageIndex(idx)}
                                className={cn(
                                    'w-2 h-2 rounded-full transition-all',
                                    idx === currentImageIndex ? 'bg-white w-4' : 'bg-white/50'
                                )}
                            />
                        ))}
                    </div>
                </div>

                <div className="px-4 py-6 space-y-6">
                    {/* Title & Price */}
                    <div>

                        <h2 className="text-2xl font-bold text-foreground uppercase">{property.title}</h2>
                        <div className="flex items-center gap-1 mt-2 text-muted-foreground">
                            <MapPin className="w-4 h-4" />
                            <span className='uppercase'>{property.country} | {property.state.replaceAll('_', ' ')} - {property.city}</span>
                        </div>
                    </div>

                    {/* Features Grid */}
                    <div className="grid grid-cols-4 gap-4">
                        {property.bedrooms !== null && property.bedrooms > 0 && (
                            <div className="text-center p-3 rounded-xl bg-secondary">
                                <Bed className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
                                <p className="font-semibold">{property.bedrooms}</p>
                                <p className="text-xs text-muted-foreground">Dorm.</p>
                            </div>
                        )}
                        {property.bathrooms !== null && property.bathrooms > 0 && (
                            <div className="text-center p-3 rounded-xl bg-secondary">
                                <Bath className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
                                <p className="font-semibold">{property.bathrooms}</p>
                                <p className="text-xs text-muted-foreground">Baños</p>
                            </div>
                        )}
                        {property.total_area && (
                            <div className="text-center p-3 rounded-xl bg-secondary">
                                <Maximize2 className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
                                <p className="font-semibold">{property.total_area}</p>
                                <p className="text-xs text-muted-foreground">m² tot.</p>
                            </div>
                        )}
                        {property.parking_spots !== null && property.parking_spots > 0 && (
                            <div className="text-center p-3 rounded-xl bg-secondary">
                                <div className="w-5 h-5 mx-auto mb-1 text-muted-foreground flex items-center justify-center font-bold text-sm">P</div>
                                <p className="font-semibold">{property.parking_spots}</p>
                                <p className="text-xs text-muted-foreground">Coch.</p>
                            </div>
                        )}
                    </div>

                    {/* Description */}
                    {property.description && (
                        <div>
                            <h3 className="font-semibold mb-2">Descripción</h3>
                            <p className="text-muted-foreground text-sm leading-relaxed">
                                {property.description}
                            </p>
                        </div>
                    )}

                    {/* Amenities */}
                    {property.amenities.length > 0 && (
                        <div>
                            <h3 className="font-semibold mb-3">Amenities</h3>
                            <div className="flex flex-wrap gap-2">
                                {property.amenities.map((amenity) => (
                                    <Badge key={amenity.label} variant="secondary" className="px-3 py-1.5">
                                        {amenity.label}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}
