import { test, expect } from "@playwright/test";

test.describe("Strona logowania", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
  });

  test("wyświetla formularz logowania", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "Logowanie" })).toBeVisible();
    await expect(page.getByPlaceholder("Email")).toBeVisible();
    await expect(page.getByPlaceholder("Hasło")).toBeVisible();
    await expect(page.getByRole("button", { name: "Zaloguj" })).toBeVisible();
  });

  test("pokazuje błąd przy pustym formularzu", async ({ page }) => {
    await page.getByRole("button", { name: "Zaloguj" }).click();
    await expect(page.getByText("Nieprawidłowy adres email")).toBeVisible();
    await expect(page.getByText("Hasło jest wymagane")).toBeVisible();
  });

  test("pokazuje błąd przy pustym emailu i wypełnionym haśle", async ({ page }) => {
    await page.getByPlaceholder("Hasło").fill("haslo123");
    await page.getByRole("button", { name: "Zaloguj" }).click();
    await expect(page.getByText("Nieprawidłowy adres email")).toBeVisible();
    await expect(page.getByText("Hasło jest wymagane")).not.toBeVisible();
  });

  test("przekierowuje na /tasks po poprawnym logowaniu", async ({ page }) => {
    // Mockujemy odpowiedź API — nie potrzebujemy działającego NestJS
    await page.route("**/auth/login", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ token: "fake-jwt-token" }),
      })
    );

    await page.getByPlaceholder("Email").fill("test@test.com");
    await page.getByPlaceholder("Hasło").fill("haslo123");
    await page.getByRole("button", { name: "Zaloguj" }).click();
    await expect(page).toHaveURL("/tasks");
  });

  test("pokazuje błąd gdy dane logowania są nieprawidłowe", async ({ page }) => {
    await page.route("**/auth/login", (route) =>
      route.fulfill({ status: 401, body: "Unauthorized" })
    );

    await page.getByPlaceholder("Email").fill("test@test.com");
    await page.getByPlaceholder("Hasło").fill("zle-haslo");
    await page.getByRole("button", { name: "Zaloguj" }).click();
    await expect(page.getByText("Nieprawidłowy email lub hasło")).toBeVisible();
  });
});
