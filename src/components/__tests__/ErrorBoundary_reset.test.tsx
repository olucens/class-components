import React from "react";
import { render, screen } from "@testing-library/react";
import ErrorBoundary from "../ErrorBoundary";

function Bomb() {
  throw new Error("boom");
}

describe("ErrorBoundary onReset", () => {
  it("renders fallback and calls onReset when reset clicked", () => {
    const onReset = vi.fn();
    render(
      <ErrorBoundary onReset={onReset}>
        <Bomb />
      </ErrorBoundary>
    );

    expect(screen.getByText(/something went wrong/i)).toBeDefined();
    const btn = screen.getByRole("button");
    btn.click();
    expect(onReset).toHaveBeenCalled();
  });
});
