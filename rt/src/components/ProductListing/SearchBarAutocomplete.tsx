import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { searchProducts } from "../../config/api";
import { Input } from "../Input";
import "./SearchBar.css";
import "../SharedStyles.css";

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
    <div className="search-container">
      <div className="search-input-wrapper">
        <svg className="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
        </svg>
        <input
          type="text"
          value={input}
          onChange={(e) => {
            const val = e.target.value;
            setInput(val);
            searchParams.set("searchTerm", val);
            setSearchParams(searchParams);
          }}
          placeholder="Search flowers..."
          className="search-input"
        />
        {input && (
          <button
            onClick={() => {
              setInput("");
              searchParams.delete("searchTerm");
              setSearchParams(searchParams);
              setShowDropdown(false);
            }}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Enhanced Dropdown */}
      {showDropdown && suggestions.length > 0 && (
        <div className="search-dropdown custom-scrollbar">
          <div className="p-2">
            <div className="text-xs text-gray-500 px-3 py-2 border-b border-gray-100 flex items-center gap-2">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Quick suggestions
            </div>
            {suggestions.map((product, index) => (
              <div
                key={product.id}
                className="search-dropdown-item"
                onClick={() => handleSelect(product.name)}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full transition-transform duration-200"></div>
                  <div className="flex-1">
                    <span className="font-semibold text-sm">
                      {product.name}
                    </span>
                    {product.categories && product.categories.length > 0 && (
                      <div className="text-xs text-gray-500 mt-1">
                        {product.categories.map((cat: any) => cat.name).join(", ")}
                      </div>
                    )}
                  </div>
                  <svg className="w-4 h-4 text-gray-400 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};