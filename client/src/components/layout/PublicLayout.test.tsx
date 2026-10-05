import { describe, it, expect } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { PublicLayout } from "./PublicLayout";
import { HowItWorksPage } from "../../pages/HowItWorksPage";
import { ForDevelopersPage } from "../../pages/ForDevelopersPage";

describe("PublicLayout integration", () => {
  it("renders shared public navbar and footer when navigating to /how-it-works", () => {
    render(
      <MemoryRouter initialEntries={["/how-it-works"]}>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/how-it-works" element={<HowItWorksPage />} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    // Verify main navigation landmark and links within the navbar
    const nav = screen.getByRole("navigation", { name: "Main Navigation" });
    expect(within(nav).getByRole("link", { name: "How It Works" })).toHaveAttribute("href", "/how-it-works");
    expect(within(nav).getByRole("link", { name: "For Developers" })).toHaveAttribute("href", "/for-developers");
    expect(within(nav).getByRole("link", { name: "Games" })).toHaveAttribute("href", "/games");
    expect(within(nav).getByRole("link", { name: "Tournaments" })).toHaveAttribute("href", "/tournaments");

    // Verify header CTAs
    expect(screen.getAllByRole("link", { name: /Create an account/i })[0]).toHaveAttribute("href", "/signup");

    // Verify page hero content renders inside Outlet
    expect(
      screen.getByRole("heading", { name: /HOW RIYADAH ELITE WORKS/i })
    ).toBeInTheDocument();
  });

  it("renders shared public navbar and footer when navigating to /for-developers", () => {
    render(
      <MemoryRouter initialEntries={["/for-developers"]}>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/for-developers" element={<ForDevelopersPage />} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    // Verify main navigation landmark and links within the navbar
    const nav = screen.getByRole("navigation", { name: "Main Navigation" });
    expect(within(nav).getByRole("link", { name: "How It Works" })).toHaveAttribute("href", "/how-it-works");
    expect(within(nav).getByRole("link", { name: "For Developers" })).toHaveAttribute("href", "/for-developers");
    expect(within(nav).getByRole("link", { name: "Games" })).toHaveAttribute("href", "/games");

    // Verify page hero content renders inside Outlet
    expect(
      screen.getByRole("heading", { name: /Put your game in front of/i })
    ).toBeInTheDocument();
  });
});
