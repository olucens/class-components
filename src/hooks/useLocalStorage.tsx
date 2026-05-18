import { useState } from "react";

export default function useLocalStorage(key: string, initialValue: string) {
  const [storageValue, setStorageValue] = useState(() => {
    const saved = localStorage.getItem(key);
    return saved !== null ? saved : initialValue;
  });

  const setValue = (value: string) => {
    localStorage.setItem(key, value);
    setStorageValue(value);
  };

  return [storageValue, setValue] as const;
}