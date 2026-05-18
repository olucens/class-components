export default function Header() {
  return (
    <header className="header">
      <div className="header__inner">
        <a href="/" style={{ textDecoration: "none", color: "inherit" }}>
          <span className="header__logo">⚡ PokéSearch</span>
        </a>
        <nav className="header__nav">
          <a href="/" style={{ marginRight: "20px", textDecoration: "none" }}>
            Home
          </a>
          <a href="/about" style={{ textDecoration: "none" }}>
            About
          </a>
        </nav>
      </div>
    </header>
  );
}
