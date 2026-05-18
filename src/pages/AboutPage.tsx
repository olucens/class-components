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
                    <h2>About PokéSearch</h2>
                </section>
                </main>
                <button className="error-trigger" onClick={() => setThrowError(true)}>
                    Trigger Error
                </button>
            </>
        </ErrorBoundary>
    );
};