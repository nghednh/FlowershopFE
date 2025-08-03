import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { searchProducts } from "../../config/api";
import { Input } from "../Input";

export const SearchBarWithAutocomplete = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [input, setInput] = useState(searchParams.get("searchTerm") || "");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [debounceTimer, setDebounceTimer] = useState<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (input.length < 2 && false) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    if (debounceTimer) clearTimeout(debounceTimer);
    const timer = setTimeout(() => {
      searchProducts(input)
        .then((res) => {
            console.log('RAW response:', res);
            setSuggestions(res.products);
            setShowDropdown(true);
        })
        .catch((err) => {
            console.error("Search error:", err); // <--- ADD THIS
          setSuggestions([]);
          setShowDropdown(true);
        });
    }, 300);

    setDebounceTimer(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input]);

  const handleSelect = (productName: string) => {
    setInput(productName);
    searchParams.set("searchTerm", productName);
    setSearchParams(searchParams);
    setShowDropdown(false);
  };

  return (
    <div className="relative w-full max-w-md">
      <Input
        label="Search by bar"
        value={input}
        onChange={(e) => {
          const val = e.target.value;
          setInput(val);
          searchParams.set("searchTerm", val);
          setSearchParams(searchParams);
        }}
      />
      {showDropdown && suggestions.length > 0 && (
        <ul className="absolute z-50 bg-white border w-full mt-1 rounded shadow max-h-60 overflow-auto">
          {suggestions.map((product) => (
            <li
              key={product.id}
              className="p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleSelect(product.name)}
            >
              {product.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};