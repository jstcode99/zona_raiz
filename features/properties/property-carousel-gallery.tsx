"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";
import { useState } from "react";

export default function PropertyCarouselGallery({
  images,
}: {
  images: string[];
}) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!images || images.length === 0) return null;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 lg:px-0">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        <div className="lg:col-span-8  relative w-full aspect-video md:8/3 lg:aspect-8/3 overflow-hidden rounded-3xl bg-muted">
          <Image
            src={images[currentImageIndex]}
            alt={`Propiedad - imagen ${currentImageIndex + 1}`}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover transition-all duration-500"
          />
          {/* Badge de contador opcional */}
          <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs">
            {currentImageIndex + 1} / {images.length}
          </div>
        </div>
        <div className="lg:col-span-4 flex flex-col gap-4 w-full h-full lg:justify-start justify-center">
          <Carousel
            className="w-full"
            opts={{
              align: "start",
              loop: true,
            }}
          >
            <CarouselContent className="-ml-2">
              {images.map((image, index) => (
                <CarouselItem
                  className="pl-2 basis-1/3 md:basis-1/4 lg:basis-3/5"
                  key={`${image}-${index}`}
                >
                  <button
                    onClick={() => setCurrentImageIndex(index)}
                    className={`relative w-full aspect-square rounded-xl overflow-hidden transition-all duration-200 ring-offset-background
                      ${currentImageIndex === index ? "ring-2 ring-primary ring-offset-2 scale-95" : "opacity-70 hover:opacity-100"}
                    `}
                  >
                    <Image
                      alt={`Thumbnail ${index + 1}`}
                      fill
                      src={image}
                      sizes="(max-width: 768px) 33vw, 15vw"
                      className="object-cover"
                    />
                  </button>
                </CarouselItem>
              ))}
            </CarouselContent>

            {/* Controles del Carousel */}
            <div className="flex items-center justify-end gap-2 lg:relative">
              <CarouselPrevious className="static translate-y-0" />
              <CarouselNext className="static translate-y-0" />
            </div>
          </Carousel>
        </div>
      </div>
    </div>
  );
}
