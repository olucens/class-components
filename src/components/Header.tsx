import { Component } from "react";

class Header extends Component {
  render() {
    return (
      <header className="header">
        <div className="header__inner">
          <span className="header__logo">⚡ PokéSearch</span>
        </div>
      </header>
    );
  }
}

export default Header;
