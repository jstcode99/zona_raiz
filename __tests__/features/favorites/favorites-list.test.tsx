import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import {
  FavoritesList,
  FavoriteWithListing,
} from "../../../features/favorites/favorites-list";
import {
  ListingType,
  ListingStatus,
} from "../../../domain/entities/listing.enums";
import { PropertyType } from "../../../domain/entities/property.enums";

describe("FavoritesList", () => {
  const mockFavorites: FavoriteWithListing[] = [
    {
      id: "fav-1",
      listing_id: "listing-1",
      created_at: "2024-01-01",
      listing: {
        id: "listing-1",
        property_id: "prop-1",
        agent_id: "agent-1",
        listing_type: ListingType.RENT,
        price: 1000,
        currency: "USD",
        price_negotiable: false,
        expenses_amount: 0,
        expenses_included: false,
        status: ListingStatus.ACTIVE,
        featured: false,
        views_count: 0,
        enquiries_count: 0,
        whatsapp_clicks: 0,
        created_at: "2024-01-01",
        updated_at: "2024-01-01",
        property: {
          id: "prop-1",
          real_estate_id: "real-1",
          title: "Test Property",
          slug: "test-property",
          description: "Test Description",
          property_type: PropertyType.Apartment,
          street: "Test Street",
          city: "Test City",
          state: "Test State",
          country: "Test Country",
          postal_code: "12345",
          latitude: 0,
          longitude: 0,
          neighborhood: "Test Neighborhood",
          bedrooms: 2,
          bathrooms: 1,
          total_area: 100,
          built_area: 80,
          lot_area: 200,
          floors: 1,
          year_built: 2020,
          parking_spots: 1,
          amenities: [],
          created_by: null,
          created_at: "2024-01-01",
          updated_at: "2024-01-01",
          property_images: [
            {
              id: "img-1",
              property_id: "prop-1",
              public_url: "https://example.com/image.jpg",
              filename: "image.jpg",
              is_primary: true,
            },
          ],
        },
      },
    },
  ];

  it("renders empty state when no favorites", () => {
    render(<FavoritesList favorites={[]} />);
    expect(screen.getByText(/no tienes favoritos/i)).toBeInTheDocument();
  });

  it("renders favorites list correctly", () => {
    render(<FavoritesList favorites={mockFavorites} />);

    expect(screen.getByText(/favoritos/i)).toBeInTheDocument();
    expect(screen.getByText("Test Property")).toBeInTheDocument();
  });

  it("renders correct number of favorites", () => {
    const multipleFavorites = [
      ...mockFavorites,
      { ...mockFavorites[0], id: "fav-2", listing_id: "listing-2" },
    ];
    render(<FavoritesList favorites={multipleFavorites} />);

    expect(screen.getByText(/Favoritos.*2/)).toBeInTheDocument();
  });

  it("renders only first 5 favorites", () => {
    const manyFavorites = Array.from({ length: 10 }, (_, i) => ({
      ...mockFavorites[0],
      id: `fav-${i}`,
      listing_id: `listing-${i}`,
    }));
    render(<FavoritesList favorites={manyFavorites} />);

    const cards = screen.getAllByRole("link");
    expect(cards.length).toBe(5);
  });

  it("renders link with correct href", () => {
    render(<FavoritesList favorites={mockFavorites} />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", expect.stringContaining("listing-1"));
  });

  it("renders with image when available", () => {
    render(<FavoritesList favorites={mockFavorites} />);
    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("src", "https://example.com/image.jpg");
  });
});
