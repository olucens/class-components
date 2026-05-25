import { useNavigate } from "react-router-dom";
import Header from "../components/Header";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <>
      <Header />
      <main>
        <section className="results-panel">
          <div className="error-boundary">
            <h2>404 - Page Not Found 😕</h2>
            <p className="error-boundary__message">
              Sorry, the page you're looking for doesn't exist.
            </p>
            <button onClick={() => navigate("/")}>Back to Home</button>
          </div>
        </section>
      </main>
    </>
  );
}