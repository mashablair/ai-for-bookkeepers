import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
test("public pages, themes, accessibility and responsive layout", async ({
  page,
}, info) => {
  for (const path of [
    "/",
    "/private-training",
    "/workshops",
    "/about",
    "/contact",
    "/privacy",
    "/assessment",
    "/admin/login",
  ]) {
    await page.goto(path);
    await expect(page.locator("h1,legend").first()).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    const scan = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(
      scan.violations.map(
        (v) => `${v.id}: ${v.nodes.map((n) => n.target).join(",")}`,
      ),
    ).toEqual([]);
  }
  await page.goto("/");
  await page.getByRole("button", { name: "Switch to dark theme" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  const scan = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa"])
    .analyze();
  expect(scan.violations).toEqual([]);
  await page.screenshot({
    path: `test-results/${info.project.name}-dark.png`,
    fullPage: true,
  });
  await page.getByRole("button", { name: "Switch to light theme" }).click();
  await page.screenshot({
    path: `test-results/${info.project.name}-light.png`,
    fullPage: true,
  });
});
for (const tool of ["Neither yet", "Both"])
  test(`${tool} completes assessment without contact capture`, async ({
    page,
  }) => {
    await page.goto("/assessment?ref=anna");
    await page.getByRole("radio", { name: tool, exact: true }).check();
    await page.getByRole("button", { name: "Continue" }).click();
    for (let i = 0; i < 20; i++) {
      if (page.url().endsWith("/results")) break;
      await page.getByRole("radio").first().check();
      const end = page.getByRole("button", { name: "See my results" });
      if (await end.isVisible()) {
        await end.click();
        break;
      }
      await page.getByRole("button", { name: "Continue" }).click();
    }
    await expect(page).toHaveURL(/\/results$/);
    await expect(
      page.getByRole("heading", { name: "Your capability map." }),
    ).toBeVisible();
    expect(await page.evaluate(() => sessionStorage.getItem("referral"))).toBe(
      "anna",
    );
    await expect(
      page.getByText("have not been saved", { exact: false }),
    ).toBeVisible();
    const scan = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa"])
      .analyze();
    expect(scan.violations).toEqual([]);
    await page
      .getByRole("link", { name: "Request Personalized Training", exact: true })
      .click();
    expect(await page.evaluate(() => sessionStorage.getItem("referral"))).toBe(
      "anna",
    );
  });
test("unconfigured submission is not a successful conversion", async ({
  page,
}) => {
  await page.goto("/contact?format=workshop");
  await page.getByLabel("Name", { exact: true }).fill("Test Person");
  await page.getByLabel("Email", { exact: true }).fill("test@example.com");
  await page
    .getByLabel("What would you like help with?")
    .fill("Practice safe prompting with fictional data");
  await page.getByRole("checkbox").check();
  await page.waitForTimeout(2600);
  await page.getByRole("button", { name: "Request a workshop" }).click();
  await expect(page.locator("p[role=alert]")).toContainText(
    "has not been sent",
  );
});
test("private pages and cross-origin writes fail closed", async ({
  page,
  request,
}) => {
  await page.goto("/admin");
  await expect(page).toHaveURL(/\/admin\/login$/);
  const r = await request.post("/api/leads", {
    headers: { origin: "https://evil.example" },
    data: {},
  });
  expect(r.status()).toBe(403);
  const a = await request.post("/api/admin/agenda", {
    headers: { origin: "http://127.0.0.1:3000" },
    data: {},
  });
  expect([401, 503]).toContain(a.status());
  const robots = await request.get("/robots.txt");
  expect(await robots.text()).toContain("Disallow: /");
});
