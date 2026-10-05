import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { LoginPage } from "./LoginPage";
import { SignupPage } from "./SignupPage";
import { ForgotPasswordPage } from "./ForgotPasswordPage";
import { ResetPasswordPage } from "./ResetPasswordPage";
import { AccountCreatedSuccessPage } from "./AccountCreatedSuccessPage";
import { PasswordChangedSuccessPage } from "./PasswordChangedSuccessPage";

describe("Authentication Pages Rendering", () => {
  it("renders LoginPage with email, password fields and sign in CTA", () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    expect(screen.getByRole("heading", { name: /welcome back/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /sign in to riyadah elite/i })).toBeInTheDocument();
  });

  it("renders SignupPage with gamer registration fields and password checklist", () => {
    render(
      <MemoryRouter>
        <SignupPage />
      </MemoryRouter>
    );

    expect(screen.getByRole("heading", { name: /create your riyadah elite account/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /complete registration/i })).toBeInTheDocument();
  });

  it("renders ForgotPasswordPage with recovery form", () => {
    render(
      <MemoryRouter>
        <ForgotPasswordPage />
      </MemoryRouter>
    );

    expect(screen.getByRole("heading", { name: /forgot.*password/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /send reset link/i })).toBeInTheDocument();
  });

  it("renders ResetPasswordPage with token input handling", () => {
    render(
      <MemoryRouter initialEntries={["/reset-password?token=sample-test-token-1234"]}>
        <ResetPasswordPage />
      </MemoryRouter>
    );

    expect(screen.getByRole("heading", { name: /create.*new password/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/^new password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm new password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /reset password/i })).toBeInTheDocument();
  });

  it("renders AccountCreatedSuccessPage with platform links", () => {
    render(
      <MemoryRouter>
        <AccountCreatedSuccessPage />
      </MemoryRouter>
    );

    expect(screen.getByRole("heading", { name: /account created successfully/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /explore game testing/i })).toBeInTheDocument();
  });

  it("renders PasswordChangedSuccessPage with proceed to sign in link", () => {
    render(
      <MemoryRouter>
        <PasswordChangedSuccessPage />
      </MemoryRouter>
    );

    expect(screen.getByRole("heading", { name: /password changed successfully/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /proceed to sign in/i })).toBeInTheDocument();
  });

  it("verifies LoginPage contains a working accessible Forgot password? link to /forgot-password", () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    const forgotLink = screen.getByRole("link", { name: /forgot password\?/i });
    expect(forgotLink).toBeInTheDocument();
    expect(forgotLink).toHaveAttribute("href", "/forgot-password");
  });

  it("renders ResetPasswordPage warning when reset token is missing", () => {
    render(
      <MemoryRouter initialEntries={["/reset-password"]}>
        <ResetPasswordPage />
      </MemoryRouter>
    );

    expect(screen.getByText(/missing reset token/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /request new link/i })).toHaveAttribute("href", "/forgot-password");
  });
});
