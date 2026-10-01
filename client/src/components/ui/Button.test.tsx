import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Button } from "./Button";

describe("Button component", () => {
  it("renders children correctly", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole("button", { name: /click me/i })).toBeInTheDocument();
  });

  it("applies primary styles by default", () => {
    render(<Button>Primary Button</Button>);
    const btn = screen.getByRole("button", { name: /primary button/i });
    expect(btn.className).toContain("bg-emerald-600");
  });
});
