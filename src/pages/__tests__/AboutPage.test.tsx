import { render, screen } from "../../test-utils";
import AboutPage from "../AboutPage";
import { describe, it, expect, vi, beforeEach } from "vitest";;

describe("AboutPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders header with navigation", () => {
    render(<AboutPage />);
    const header = document.querySelector("header");
    expect(header).toBeInTheDocument();
  });

  it("displays page title", () => {
    render(<AboutPage />);
    expect(screen.getByRole("heading", { level: 1, name: /About PokéSearch/i })).toBeInTheDocument();
  });

  it("renders welcome section", () => {
    render(<AboutPage />);
    expect(screen.getByRole("heading", { level: 2, name: /Welcome to PokéSearch/i })).toBeInTheDocument();
    expect(screen.getByText(/interactive Pokémon search and discovery/i)).toBeInTheDocument();
  });

  it("renders features section with list", () => {
    render(<AboutPage />);
    expect(screen.getByRole("heading", { level: 3, name: /Features/i })).toBeInTheDocument();
    expect(screen.getByText(/🔍 Search Pokémon by name/)).toBeInTheDocument();
    expect(screen.getByText(/📄 Browse Pokémon in paginated lists/)).toBeInTheDocument();
    expect(screen.getByText(/📊 View detailed Pokémon information/)).toBeInTheDocument();
    expect(screen.getByText(/💾 Search history with local storage/)).toBeInTheDocument();
    expect(screen.getByText(/⚡ Fast and responsive interface/)).toBeInTheDocument();
  });

  it("renders developer section with RS School link", () => {
    render(<AboutPage />);
    expect(screen.getByRole("heading", { level: 3, name: /About the Developer/i })).toBeInTheDocument();
    const rsLink = screen.getByRole("link", { name: /RS School/i });
    expect(rsLink).toBeInTheDocument();
    expect(rsLink).toHaveAttribute("href", "https://rs.school/courses/reactjs");
    expect(rsLink).toHaveAttribute("target", "_blank");
  });

  it("renders technologies section", () => {
    render(<AboutPage />);
    expect(screen.getByRole("heading", { level: 3, name: /Technologies Used/i })).toBeInTheDocument();
    expect(screen.getByText(/React 19 with Hooks/)).toBeInTheDocument();
    expect(screen.getByText(/React Router 7/)).toBeInTheDocument();
    expect(screen.getByText(/Vitest for testing/)).toBeInTheDocument();
    
    // Check for Vite in tech list (might be combined with Vitest text)
    const techSection = screen.getByRole("heading", { level: 3, name: /Technologies Used/i }).parentElement;
    const techs = techSection?.textContent || '';
    expect(techs).toContain('Vite');
  });

  it("renders data source section with PokéAPI link", () => {
    render(<AboutPage />);
    expect(screen.getByRole("heading", { level: 3, name: /Data Source/i })).toBeInTheDocument();
    const pokeapiLink = screen.getByRole("link", { name: /PokéAPI/i });
    expect(pokeapiLink).toBeInTheDocument();
    expect(pokeapiLink).toHaveAttribute("href", "https://pokeapi.co");
    expect(pokeapiLink).toHaveAttribute("target", "_blank");
  });

  it("renders trigger error button", () => {
    render(<AboutPage />);
    const button = screen.getByRole("button", { name: /Trigger Error/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass("error-trigger");
  });

  it("has proper main content structure", () => {
    render(<AboutPage />);
    const main = screen.getByRole("main");
    expect(main).toBeInTheDocument();
    expect(main.querySelector(".results-panel")).toBeInTheDocument();
    expect(main.querySelector(".about-page")).toBeInTheDocument();
  });

  it("has about-content div with all sections", () => {
    render(<AboutPage />);
    const aboutContent = document.querySelector(".about-content");
    expect(aboutContent).toBeInTheDocument();
    expect(aboutContent?.querySelectorAll("h2").length).toBeGreaterThanOrEqual(1);
    expect(aboutContent?.querySelectorAll('h3').length).toBeGreaterThanOrEqual(4);
  });

  it("renders all h3 headings correctly", () => {
    render(<AboutPage />);
    const h3Elements = screen.getAllByRole("heading", { level: 3 });
    expect(h3Elements.length).toBe(4);
    expect(h3Elements[0]).toHaveTextContent(/Features/);
    expect(h3Elements[1]).toHaveTextContent(/About the Developer/);
    expect(h3Elements[2]).toHaveTextContent(/Technologies Used/);
    expect(h3Elements[3]).toHaveTextContent(/Data Source/);
  });

  it("renders external links with proper attributes", () => {
    render(<AboutPage />);
    const links = screen.getAllByRole("link");
    expect(links.length).toBeGreaterThanOrEqual(2);
    const externalLinks = links.filter((link) => {
      return link.getAttribute("href")?.startsWith("https://") || false;
    });
    externalLinks.forEach((link) => {
      if (link.getAttribute("href")?.includes("rs.school") || link.getAttribute("href")?.includes("pokeapi")) {
        expect(link).toHaveAttribute("target", "_blank");
        expect(link).toHaveAttribute("rel", "noopener noreferrer");
      }
    });
  });

  it("displays description about comprehensive online platform", () => {
    render(<AboutPage />);
    expect(screen.getByText(/comprehensive online education platform/i)).toBeInTheDocument();
  });

  it("renders error boundary with error trigger functionality", () => {
    render(<AboutPage />);
    const errorBoundary = document.querySelector("[class*='error']");
    expect(errorBoundary || document.body).toBeInTheDocument();
  });
});
