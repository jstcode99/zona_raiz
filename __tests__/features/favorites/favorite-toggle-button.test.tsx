import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { FavoriteToggleButton } from "../../../features/favorites/favorite-toggle-button";
import { toggleFavoriteAction } from "@/application/actions/favorite.action";
import { toast } from "sonner";

// Mock toggleFavoriteAction is already set up in components.tsx

describe("FavoriteToggleButton", () => {
  const mockToggleFavoriteAction = vi.mocked(toggleFavoriteAction);

  beforeEach(() => {
    vi.clearAllMocks();
    mockToggleFavoriteAction.mockReset();
  });

  it("renders with initial favorite state", () => {
    render(<FavoriteToggleButton listingId="123" isFavInitial={true} />);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("text-red-500");
    expect(button).toBeDisabled(); // Initially in pending state after click
  });

  it("renders with initial not favorited state", () => {
    render(<FavoriteToggleButton listingId="123" isFavInitial={false} />);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("text-muted-foreground");
  });

  it("toggles favorite state on click (success)", async () => {
    mockToggleFavoriteAction.mockResolvedValue({ success: true });

    render(<FavoriteToggleButton listingId="123" isFavInitial={false} />);

    const button = screen.getByRole("button");
    expect(button).toHaveClass("text-muted-foreground");

    fireEvent.click(button);

    // Optimistic update
    await waitFor(() => {
      expect(button).toHaveClass("text-red-500");
    });

    // Wait for action to complete
    await waitFor(() => {
      expect(mockToggleFavoriteAction).toHaveBeenCalledWith("123");
      expect(toast.success).toHaveBeenCalledWith("favorite_added");
    });
  });

  it("rolls back state on error", async () => {
    mockToggleFavoriteAction.mockRejectedValue(new Error("Test error"));

    render(<FavoriteToggleButton listingId="123" isFavInitial={false} />);

    const button = screen.getByRole("button");

    fireEvent.click(button);

    // Optimistic update
    await waitFor(() => {
      expect(button).toHaveClass("text-red-500");
    });

    // Wait for error handling
    await waitFor(() => {
      expect(button).toHaveClass("text-muted-foreground"); // Rolled back
      expect(toast.error).toHaveBeenCalled();
    });
  });

  it("disables button while pending", async () => {
    let resolveAction: (value: any) => void;
    mockToggleFavoriteAction.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveAction = resolve;
        }),
    );

    render(<FavoriteToggleButton listingId="123" isFavInitial={false} />);

    const button = screen.getByRole("button");

    fireEvent.click(button);

    // Button should be disabled immediately after click
    expect(button).toBeDisabled();

    // Resolve the action
    resolveAction!({ success: true });

    await waitFor(() => {
      expect(button).not.toBeDisabled();
    });
  });

  it("handles different sizes correctly", () => {
    const { rerender } = render(
      <FavoriteToggleButton listingId="123" size="sm" />,
    );
    let button = screen.getByRole("button");
    expect(button).toHaveClass("h-8 w-8");

    rerender(<FavoriteToggleButton listingId="123" size="lg" />);
    button = screen.getByRole("button");
    expect(button).toHaveClass("h-12 w-12");
  });
});
