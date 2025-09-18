import React, { useState, useEffect, useMemo } from "react";
import { Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const SearchableDropdown = ({
  // Data and API
  data = [],
  fetchData = null,
  dataKey = "id",
  labelKey = "name",
  searchKey = "name",

  // Value and onChange
  value,
  onChange,

  // UI Configuration
  placeholder = "Select option...",
  searchPlaceholder = "Search...",
  emptyMessage = "No options found.",
  loadingMessage = "Loading...",

  // Display options
  showBadge = false,
  badgeVariant = "secondary",
  multiple = false,
  maxDisplayItems = 3,

  // Styling
  className = "",
  triggerClassName = "",
  contentClassName = "",

  // Validation
  required = false,
  disabled = false,

  // Custom rendering
  renderOption = null,
  renderSelected = null,

  // Dependencies for refetching
  dependencies = [],

  // Callbacks
  onDataFetch = null,
  onSearch = null,
}) => {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [localData, setLocalData] = useState(data);

  // Fetch data when component mounts or dependencies change
  useEffect(() => {
    if (fetchData) {
      const loadData = async () => {
        setIsLoading(true);
        try {
          const result = await fetchData();
          setLocalData(result);
          if (onDataFetch) {
            onDataFetch(result);
          }
        } catch (error) {
          console.error("Failed to fetch data:", error);
          setLocalData([]);
        } finally {
          setIsLoading(false);
        }
      };

      loadData();
    } else {
      setLocalData(data);
    }
  }, [fetchData, data, ...dependencies]);

  // Filter data based on search
  const filteredData = useMemo(() => {
    if (!searchValue) return localData;

    const searchTerm = searchValue.toLowerCase();
    const filtered = localData.filter((item) => {
      const searchField = item[searchKey];
      if (typeof searchField === "string") {
        return searchField.toLowerCase().includes(searchTerm);
      }
      return false;
    });

    return filtered;
  }, [localData, searchValue, searchKey]);

  // Handle option selection
  const handleSelect = (selectedValue) => {
    if (multiple) {
      const currentValues = Array.isArray(value) ? value : [];
      const newValues = currentValues.includes(selectedValue)
        ? currentValues.filter((v) => v !== selectedValue)
        : [...currentValues, selectedValue];
      onChange(newValues);
    } else {
      onChange(selectedValue);
      setOpen(false);
    }
  };

  // Check if option is selected
  const isSelected = (optionValue) => {
    if (multiple) {
      return Array.isArray(value) && value.includes(optionValue);
    }
    return value === optionValue;
  };

  // Get selected items for display
  const selectedItems = useMemo(() => {
    if (!value) return [];

    if (multiple) {
      return Array.isArray(value) ? value : [];
    }

    return [value];
  }, [value, multiple]);

  // Render selected value(s)
  const renderSelectedValue = () => {
    if (renderSelected) {
      return renderSelected(selectedItems, localData);
    }

    if (selectedItems.length === 0) {
      return placeholder;
    }

    if (multiple) {
      if (selectedItems.length <= maxDisplayItems) {
        return selectedItems
          .map((itemValue) => {
            const item = localData.find((d) => d[dataKey] === itemValue);
            return item ? item[labelKey] : itemValue;
          })
          .join(", ");
      } else {
        return `${selectedItems.length} items selected`;
      }
    } else {
      const item = localData.find((d) => d[dataKey] === selectedItems[0]);
      return item ? item[labelKey] : selectedItems[0];
    }
  };

  // Render individual option
  const renderOptionItem = (item) => {
    if (renderOption) {
      return renderOption(item);
    }

    return (
      <div className="flex items-center gap-2">
        <span>{item[labelKey]}</span>
        {showBadge && item.badge && (
          <Badge variant={badgeVariant} className="ml-auto">
            {item.badge}
          </Badge>
        )}
      </div>
    );
  };

  return (
    <div className={cn("relative w-80", className)}>
      {/* Search Input Field */}
      <div className="relative">
        <input
          type="text"
          placeholder={value && searchValue === "" ? "" : searchPlaceholder}
          value={
            value && searchValue === "" ? renderSelectedValue() : searchValue
          }
          onChange={(e) => {
            setSearchValue(e.target.value);
            setOpen(e.target.value.length > 0 || open);
            if (onSearch) onSearch(e.target.value);
          }}
          onFocus={() => {
            setOpen(true);
            // Clear the input when focusing to allow searching
            if (value && searchValue === "") {
              setSearchValue("");
            }
          }}
          className={cn(
            "w-full h-10 px-3 py-2 text-sm border border-input bg-background rounded-md",
            "placeholder:text-muted-foreground",
            "focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent",
            "disabled:cursor-not-allowed disabled:opacity-50",
            triggerClassName
          )}
          disabled={disabled}
        />
        {isLoading && (
          <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
        )}
      </div>

      {/* Options Dropdown */}
      {open && (
        <div
          className={cn(
            "absolute top-full left-0 right-0 z-50 mt-1 bg-popover border border-border rounded-md shadow-md max-h-60 overflow-auto",
            contentClassName
          )}
        >
          {isLoading ? (
            <div className="flex items-center justify-center py-6">
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              <span className="text-sm text-muted-foreground">
                {loadingMessage}
              </span>
            </div>
          ) : filteredData.length === 0 ? (
            <div className="py-6 text-center text-sm text-muted-foreground">
              {emptyMessage}
            </div>
          ) : (
            <div className="p-1">
              {filteredData.map((item) => {
                const itemValue = item[dataKey];
                return (
                  <div
                    key={itemValue}
                    onClick={() => {
                      handleSelect(itemValue);
                      setSearchValue("");
                      setOpen(false);
                    }}
                    className={cn(
                      "flex items-center px-2 py-2 text-sm cursor-pointer rounded-sm",
                      "hover:bg-accent hover:text-accent-foreground",
                      isSelected(itemValue) &&
                        "bg-accent text-accent-foreground"
                    )}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        isSelected(itemValue) ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {renderOptionItem(item)}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Backdrop to close dropdown */}
      {open && (
        <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
      )}
    </div>
  );
};

export default SearchableDropdown;
