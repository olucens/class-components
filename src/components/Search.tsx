import { useState, type ChangeEvent, type KeyboardEvent } from "react";
import useLocalStorage from "../hooks/useLocalStorage";

interface SearchProps {
  onSearch: (term: string) => void;
}

export default function Search(props: SearchProps) {
  const { onSearch } = props;
  
  const [cache, setCache] = useLocalStorage("searchTerm", "");
  const [inputValue, setInputValue] = useState(cache || "");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSearch = () => {
    const trimmed = inputValue.trim();
    if (trimmed !== cache) {
      setCache(trimmed);
      onSearch(trimmed);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="search">
      <input
        type="text"
        placeholder="Search Pokémon..."
        value={inputValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />
      <button onClick={handleSearch}>Search</button>
    </div>
  );
};
