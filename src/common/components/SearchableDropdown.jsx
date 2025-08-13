import React, { useState, useEffect, useMemo } from "react";
import { Check, ChevronsUpDown, Search, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
    return localData.filter((item) => {
      const searchField = item[searchKey];
      if (typeof searchField === "string") {
        return searchField.toLowerCase().includes(searchTerm);
      }
      return false;
    });
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
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between",
            !value ||
              (Array.isArray(value) &&
                value.length === 0 &&
                "text-muted-foreground"),
            triggerClassName
          )}
          disabled={disabled}
        >
          {renderSelectedValue()}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className={cn("w-full p-0", contentClassName)}>
        <Command>
          <CommandInput
            placeholder={searchPlaceholder}
            value={searchValue}
            onValueChange={(search) => {
              setSearchValue(search);
              if (onSearch) onSearch(search);
            }}
          />

          <CommandList>
            {isLoading ? (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                {loadingMessage}
              </div>
            ) : filteredData.length === 0 ? (
              <CommandEmpty>{emptyMessage}</CommandEmpty>
            ) : (
              <CommandGroup>
                {filteredData.map((item) => {
                  const itemValue = item[dataKey];
                  return (
                    <CommandItem
                      key={itemValue}
                      value={itemValue}
                      onSelect={() => handleSelect(itemValue)}
                      className="cursor-pointer"
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          isSelected(itemValue) ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {renderOptionItem(item)}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default SearchableDropdown;
