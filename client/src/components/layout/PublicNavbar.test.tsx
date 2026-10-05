import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { PublicNavbar } from "./PublicNavbar";

describe("PublicNavbar", () => {
  it("renders brand logo linking to home", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <PublicNavbar />
      </MemoryRouter>
    );

    const brandLink = screen.getAllByRole("link").find((l) => l.getAttribute("href") === "/");
    expect(brandLink).toBeDefined();
  });

  it("renders all core public navigation links and actions without redundant profile icon", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <PublicNavbar />
      </MemoryRouter>
    );

    expect(screen.getByRole("link", { name: "Games" })).toHaveAttribute("href", "/games");
    expect(screen.getByRole("link", { name: "Tournaments" })).toHaveAttribute("href", "/tournaments");
    expect(screen.getByRole("link", { name: "How It Works" })).toHaveAttribute("href", "/how-it-works");
    expect(screen.getByRole("link", { name: "For Developers" })).toHaveAttribute("href", "/for-developers");
    expect(screen.getAllByRole("link", { name: "Log In" })[0]).toHaveAttribute("href", "/login");
    expect(screen.getAllByRole("link", { name: "Create an account" })[0]).toHaveAttribute("href", "/signup");

    // Profile icon button should be completely absent
    expect(screen.queryByLabelText(/account profile/i)).not.toBeInTheDocument();
  });
});
