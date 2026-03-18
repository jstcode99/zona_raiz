import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { FavoriteToggleButton } from "../../../features/favorites/favorite-toggle-button";
import * as favoriteAction from "@/application/actions/favorite.action";
import { toast } from "sonner";

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe("FavoriteToggleButton", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders with initial favorite state", () => {
    render(<FavoriteToggleButton listingId="123" isFavInitial={true} />);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("text-red-500");
  });

  it("renders with initial not favorited state", () => {
    render(<FavoriteToggleButton listingId="123" isFavInitial={false} />);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("text-muted-foreground");
  });

  it("toggles favorite state on click (success)", async () => {
    vi.spyOn(favoriteAction, "toggleFavoriteAction").mockResolvedValue({
      success: true,
    });

    render(<FavoriteToggleButton listingId="123" isFavInitial={false} />);

    const button = screen.getByRole("button");
    expect(button).toHaveClass("text-muted-foreground");

    fireEvent.click(button);

    await waitFor(() => {
      expect(button).toHaveClass("text-red-500");
    });

    await waitFor(() => {
      expect(favoriteAction.toggleFavoriteAction).toHaveBeenCalledWith("123");
      expect(toast.success).toHaveBeenCalledWith(expect.any(String));
    });
  });

  it("rolls back state on error", async () => {
    vi.spyOn(favoriteAction, "toggleFavoriteAction").mockRejectedValue(
      new Error("Test error"),
    );

    render(<FavoriteToggleButton listingId="123" isFavInitial={false} />);

    const button = screen.getByRole("button");

    fireEvent.click(button);

    await waitFor(() => {
      expect(button).toHaveClass("text-red-500");
    });

    await waitFor(() => {
      expect(button).toHaveClass("text-muted-foreground");
      expect(toast.error).toHaveBeenCalled();
    });
  });

  it("handles different sizes correctly", () => {
    const { rerender } = render(
      <FavoriteToggleButton listingId="123" size="sm" />,
    );
    let button = screen.getByRole("button");
    expect(button).toHaveClass("h-8");
    expect(button).toHaveClass("w-8");

    rerender(<FavoriteToggleButton listingId="123" size="lg" />);
    button = screen.getByRole("button");
    expect(button).toHaveClass("h-12");
    expect(button).toHaveClass("w-12");
  });
});
