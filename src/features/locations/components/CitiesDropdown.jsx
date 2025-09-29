import React, { useEffect, useState, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useApi } from "../../../contexts/ApiContext";
import {
  fetchCities,
  setCitiesSearchTerm,
  setCitiesCountryId,
  setCitiesStateId,
} from "../locationSlice";
import {
  selectCitiesFormatted,
  selectCitiesLoading,
  selectCitiesError,
  selectCitiesSearchTerm,
  selectCitiesCountryId,
  selectCitiesStateId,
} from "../locationSelectors";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, Loader2, Check, ChevronDown } from "lucide-react";
import { showError } from "../../../utils/toast";
import { cn } from "@/lib/utils";

const CitiesDropdown = ({
  value,
  onValueChange,
  countryId,
  stateId,
  placeholder = "Search and select a city",
  label = "City",
  className = "",
  disabled = false,
  required = false,
  limit = 50,
}) => {
  const dispatch = useDispatch();
  const apiClient = useApi();
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  const cities = useSelector(selectCitiesFormatted);
  const loading = useSelector(selectCitiesLoading);
  const error = useSelector(selectCitiesError);
  const searchTerm = useSelector(selectCitiesSearchTerm);
  const currentCountryId = useSelector(selectCitiesCountryId);
  const currentStateId = useSelector(selectCitiesStateId);

  // Get selected city for display
  const selectedCity = cities.find((city) => city.value === value);

  // Initialize input value when selected city changes (only on actual selection, not during search)
  useEffect(() => {
    if (selectedCity && value) {
      setInputValue(selectedCity.label);
    } else if (!value) {
      setInputValue("");
    }
  }, [value]); // Only depend on value, not selectedCity

  // Update country filter when countryId prop changes
  useEffect(() => {
    if (countryId && countryId !== currentCountryId) {
      dispatch(setCitiesCountryId(countryId));
    }
  }, [countryId, currentCountryId, dispatch]);

  // Update state filter when stateId prop changes
  useEffect(() => {
    if (stateId && stateId !== currentStateId) {
      dispatch(setCitiesStateId(stateId));
    }
  }, [stateId, currentStateId, dispatch]);

  // Fetch cities when country or state is selected
  useEffect(() => {
    if (apiClient?.locations && (countryId || stateId)) {
      dispatch(
        fetchCities({
          countryId,
          stateId,
          limit,
          apiClient,
        })
      );
    }
  }, [dispatch, apiClient, countryId, stateId, limit]);

  // Handle search with debouncing
  useEffect(() => {
    if (!apiClient || (!countryId && !stateId)) return;

    const timeoutId = setTimeout(() => {
      if (inputValue !== searchTerm) {
        dispatch(setCitiesSearchTerm(inputValue));
        dispatch(
          fetchCities({
            countryId,
            stateId,
            search: inputValue,
            limit,
            apiClient,
          })
        );
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [inputValue, searchTerm, dispatch, apiClient, countryId, stateId, limit]);

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

  // Handle city selection
  const handleCitySelect = useCallback(
    (city) => {
      setInputValue(city.label);
      onValueChange(city.value);
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
            prev < cities.length - 1 ? prev + 1 : 0
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setHighlightedIndex((prev) =>
            prev > 0 ? prev - 1 : cities.length - 1
          );
          break;
        case "Enter":
          e.preventDefault();
          if (highlightedIndex >= 0 && cities[highlightedIndex]) {
            handleCitySelect(cities[highlightedIndex]);
          }
          break;
        case "Escape":
          setIsOpen(false);
          setHighlightedIndex(-1);
          inputRef.current?.blur();
          break;
      }
    },
    [isOpen, highlightedIndex, cities, handleCitySelect]
  );

  // Handle input focus
  const handleFocus = useCallback(() => {
    if (countryId || stateId) {
      setIsOpen(true);
    }
  }, [countryId, stateId]);

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

  const isDisabled = disabled || (!countryId && !stateId);

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
          placeholder={
            isDisabled ? "Select a country and state first" : placeholder
          }
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
          disabled={isDisabled}
          className="pl-10 pr-10 bg-background text-foreground border-input"
        />
        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      </div>

      {/* Dropdown List */}
      {isOpen && !isDisabled && (
        <div
          ref={listRef}
          className="absolute z-50 w-full mt-1 bg-background border border-border rounded-md shadow-lg max-h-60 overflow-auto"
        >
          {loading ? (
            <div className="flex items-center justify-center p-4">
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              <span className="text-sm text-muted-foreground">
                Loading cities...
              </span>
            </div>
          ) : cities.length === 0 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              {inputValue ? "No cities found" : "No cities available"}
            </div>
          ) : (
            cities.map((city, index) => (
              <div
                key={city.value}
                className={cn(
                  "flex items-center justify-between px-4 py-2 cursor-pointer hover:bg-accent hover:text-accent-foreground",
                  highlightedIndex === index &&
                    "bg-accent text-accent-foreground",
                  value === city.value && "bg-primary/10 text-primary"
                )}
                onClick={() => handleCitySelect(city)}
                onMouseEnter={() => setHighlightedIndex(index)}
              >
                <div className="flex items-center gap-2">
                  <span className="font-medium">{city.label}</span>
                  {city.breadcrumb && (
                    <span className="text-xs text-muted-foreground">
                      {city.breadcrumb}
                    </span>
                  )}
                </div>
                {value === city.value && (
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

export default CitiesDropdown;
