import Header from "../components/Header";
import ErrorBoundary from "../components/ErrorBoundary";
import { useState } from "react";

export default function AboutPage() {
  const [throwError, setThrowError] = useState(false);

  if (throwError) {
    throw new Error("Test error triggered!");
  }

  return (
    <ErrorBoundary onReset={() => setThrowError(false)}>
      <>
        <Header />
        <main>
          <section className="results-panel">
            <div className="about-page">
              <h1>About PokéSearch</h1>
              <div className="about-content">
                <h2>Welcome to PokéSearch</h2>
                <p>
                  PokéSearch is an interactive Pokémon search and discovery
                  application built with React, TypeScript, and React Router.
                  Explore the vast world of Pokémon with an intuitive search
                  interface and detailed information about your favorite
                  creatures.
                </p>

                <h3>Features</h3>
                <ul>
                  <li>🔍 Search Pokémon by name</li>
                  <li>📄 Browse Pokémon in paginated lists</li>
                  <li>📊 View detailed Pokémon information</li>
                  <li>💾 Search history with local storage</li>
                  <li>⚡ Fast and responsive interface</li>
                </ul>

                <h3>About the Developer</h3>
                <p>
                  This application was created as part of the React course at{" "}
                  <a
                    href="https://rs.school/courses/reactjs"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    RS School
                  </a>
                  , a comprehensive online education platform dedicated to
                  teaching web development skills.
                </p>

                <h3>Technologies Used</h3>
                <ul>
                  <li>React 19 with Hooks</li>
                  <li>TypeScript</li>
                  <li>React Router 7</li>
                  <li>Vite</li>
                  <li>Vitest for testing</li>
                </ul>

                <h3>Data Source</h3>
                <p>
                  All Pokémon data is fetched from the{" "}
                  <a
                    href="https://pokeapi.co"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    PokéAPI
                  </a>
                  , a free and open-source Pokémon API.
                </p>
              </div>
            </div>
          </section>
        </main>
        <button
          className="error-trigger"
          onClick={() => setThrowError(true)}
        >
          Trigger Error
        </button>
      </>
    </ErrorBoundary>
  );
}