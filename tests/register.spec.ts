import { test, expect } from "@playwright/test";

test.describe("Strona rejestracji", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/register");
  });

  test("wyświetla formularz rejestracji", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "Rejestracja" })).toBeVisible();
    await expect(page.getByPlaceholder("Email")).toBeVisible();
    await expect(page.getByPlaceholder("Hasło", { exact: true })).toBeVisible();
    await expect(page.getByPlaceholder("Powtórz hasło")).toBeVisible();
    await expect(page.getByRole("button", { name: "Zarejestruj" })).toBeVisible();
  });

  test("pokazuje błędy przy pustym formularzu", async ({ page }) => {
    await page.getByRole("button", { name: "Zarejestruj" }).click();
    await expect(page.getByText("Nieprawidłowy adres email")).toBeVisible();
    await expect(page.getByText("Hasło musi mieć minimum 6 znaków")).toBeVisible();
  });

  test("pokazuje błąd gdy hasło jest za krótkie", async ({ page }) => {
    await page.getByPlaceholder("Email").fill("test@test.com");
    await page.getByPlaceholder("Hasło", { exact: true }).fill("abc");
    await page.getByPlaceholder("Powtórz hasło").fill("abc");
    await page.getByRole("button", { name: "Zarejestruj" }).click();
    await expect(page.getByText("Hasło musi mieć minimum 6 znaków")).toBeVisible();
  });

  test("pokazuje błąd gdy hasła nie są identyczne", async ({ page }) => {
    await page.getByPlaceholder("Email").fill("test@test.com");
    await page.getByPlaceholder("Hasło", { exact: true }).fill("haslo123");
    await page.getByPlaceholder("Powtórz hasło").fill("inne-haslo");
    await page.getByRole("button", { name: "Zarejestruj" }).click();
    await expect(page.getByText("Hasła nie są identyczne")).toBeVisible();
  });

  test("przekierowuje na /login po udanej rejestracji", async ({ page }) => {
    await page.route("**/auth/register", (route) =>
      route.fulfill({ status: 201, body: "" })
    );

    await page.getByPlaceholder("Email").fill("nowy@test.com");
    await page.getByPlaceholder("Hasło", { exact: true }).fill("haslo123");
    await page.getByPlaceholder("Powtórz hasło").fill("haslo123");
    await page.getByRole("button", { name: "Zarejestruj" }).click();
    await expect(page).toHaveURL("/login");
  });

  test("pokazuje błąd gdy email jest już zajęty", async ({ page }) => {
    await page.route("**/auth/register", (route) =>
      route.fulfill({ status: 409, body: "Conflict" })
    );

    await page.getByPlaceholder("Email").fill("zajety@test.com");
    await page.getByPlaceholder("Hasło", { exact: true }).fill("haslo123");
    await page.getByPlaceholder("Powtórz hasło").fill("haslo123");
    await page.getByRole("button", { name: "Zarejestruj" }).click();
    await expect(page.getByText("Użytkownik z tym emailem już istnieje")).toBeVisible();
  });

  test("link 'Zaloguj się' prowadzi na /login", async ({ page }) => {
    await page.getByRole("link", { name: "Zaloguj się" }).click();
    await expect(page).toHaveURL("/login");
  });
});
