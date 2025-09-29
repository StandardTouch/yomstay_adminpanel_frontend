import React, { useEffect, useState, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useApi } from "../../../contexts/ApiContext";
import { fetchCountries, setCountriesSearchTerm } from "../locationSlice";
import {
  selectCountriesFormatted,
  selectCountriesLoading,
  selectCountriesError,
  selectCountriesSearchTerm,
} from "../locationSelectors";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, Loader2, Check, ChevronDown } from "lucide-react";
import { showError } from "../../../utils/toast";
import { cn } from "@/lib/utils";

const CountriesDropdown = ({
  value,
  onValueChange,
  placeholder = "Search and select a country",
  label = "Country",
  className = "",
  disabled = false,
  required = false,
}) => {
  const dispatch = useDispatch();
  const apiClient = useApi();
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  const countries = useSelector(selectCountriesFormatted);
  const loading = useSelector(selectCountriesLoading);
  const error = useSelector(selectCountriesError);
  const searchTerm = useSelector(selectCountriesSearchTerm);

  // Get selected country for display
  const selectedCountry = countries.find((country) => country.value === value);

  // Initialize input value when selected country changes (only on actual selection, not during search)
  useEffect(() => {
    if (selectedCountry && value) {
      setInputValue(selectedCountry.label);
    } else if (!value) {
      setInputValue("");
    }
  }, [value]); // Only depend on value, not selectedCountry

  // Fetch countries on component mount
  useEffect(() => {
    if (apiClient?.locations) {
      dispatch(fetchCountries({ apiClient }));
    }
  }, [dispatch, apiClient]);

  // Handle search with debouncing
  useEffect(() => {
    if (!apiClient) return;

    const timeoutId = setTimeout(() => {
      if (inputValue !== searchTerm) {
        dispatch(setCountriesSearchTerm(inputValue));
        dispatch(fetchCountries({ search: inputValue, apiClient }));
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [inputValue, searchTerm, dispatch, apiClient]);

  // Handle error
  useEffect(() => {
    if (error) {
      showError(error);
    }
  }, [error]);

  // Handle input change
  const handleInputChange = useCallback(
    (e) => {
      const newValue = e.target.value;
      setInputValue(newValue);
      setIsOpen(true);
      setHighlightedIndex(-1);

      // If input is cleared, clear selection
      if (!newValue) {
        onValueChange("");
      }
    },
    [onValueChange]
  );

  // Handle country selection
  const handleCountrySelect = useCallback(
    (country) => {
      setInputValue(country.label);
      onValueChange(country.value);
      setIsOpen(false);
      setHighlightedIndex(-1);
      inputRef.current?.blur();
    },
    [onValueChange]
  );

  // Handle keyboard navigation
  const handleKeyDown = useCallback(
    (e) => {
      if (!isOpen) {
        if (e.key === "ArrowDown" || e.key === "Enter") {
          setIsOpen(true);
          return;
        }
      }

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setHighlightedIndex((prev) =>
            prev < countries.length - 1 ? prev + 1 : 0
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setHighlightedIndex((prev) =>
            prev > 0 ? prev - 1 : countries.length - 1
          );
          break;
        case "Enter":
          e.preventDefault();
          if (highlightedIndex >= 0 && countries[highlightedIndex]) {
            handleCountrySelect(countries[highlightedIndex]);
          }
          break;
        case "Escape":
          setIsOpen(false);
          setHighlightedIndex(-1);
          inputRef.current?.blur();
          break;
      }
    },
    [isOpen, highlightedIndex, countries, handleCountrySelect]
  );

  // Handle input focus
  const handleFocus = useCallback(() => {
    setIsOpen(true);
  }, []);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        listRef.current &&
        !listRef.current.contains(event.target) &&
        inputRef.current &&
        !inputRef.current.contains(event.target)
      ) {
        setIsOpen(false);
        setHighlightedIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Scroll highlighted item into view
  useEffect(() => {
    if (highlightedIndex >= 0 && listRef.current) {
      const highlightedItem = listRef.current.children[highlightedIndex];
      if (highlightedItem) {
        highlightedItem.scrollIntoView({
          block: "nearest",
          behavior: "smooth",
        });
      }
    }
  }, [highlightedIndex]);

  return (
    <div className={`relative ${className}`}>
      {label && (
        <Label className="text-sm font-medium mb-2 block">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}

      {/* Searchable Text Field */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          className="pl-10 pr-10 bg-background text-foreground border-input"
        />
        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      </div>

      {/* Dropdown List */}
      {isOpen && (
        <div
          ref={listRef}
          className="absolute z-50 w-full mt-1 bg-background border border-border rounded-md shadow-lg max-h-60 overflow-auto"
        >
          {loading ? (
            <div className="flex items-center justify-center p-4">
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              <span className="text-sm text-muted-foreground">
                Loading countries...
              </span>
            </div>
          ) : countries.length === 0 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              {inputValue ? "No countries found" : "No countries available"}
            </div>
          ) : (
            countries.map((country, index) => (
              <div
                key={country.value}
                className={cn(
                  "flex items-center justify-between px-4 py-2 cursor-pointer hover:bg-accent hover:text-accent-foreground",
                  highlightedIndex === index &&
                    "bg-accent text-accent-foreground",
                  value === country.value && "bg-primary/10 text-primary"
                )}
                onClick={() => handleCountrySelect(country)}
                onMouseEnter={() => setHighlightedIndex(index)}
              >
                <div className="flex items-center gap-2">
                  <span className="font-medium">{country.label}</span>
                  <span className="text-xs text-muted-foreground">
                    {country.iso2}
                  </span>
                </div>
                {value === country.value && (
                  <Check className="h-4 w-4 text-primary" />
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default CountriesDropdown;
