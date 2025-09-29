# Countries Feature

This feature provides a reusable countries dropdown component that integrates with the `/countries` API endpoint.

## Features

- 🔍 **Search functionality** - Search countries by name with debounced input
- 🌍 **Complete country data** - Includes name, ISO2, ISO3, and slug
- ⚡ **Redux integration** - Cached data with loading states
- 🎨 **ShadCN/UI components** - Consistent with design system
- 📱 **Responsive design** - Works on all screen sizes

## API Integration

Uses the `/countries` endpoint with the following schema:

```typescript
interface CountryEntity {
  id: string; // UUID
  name: string; // "Saudi Arabia"
  iso2: string; // "SA"
  iso3: string; // "SAU"
  slug: string; // "saudi-arabia"
}
```

## Usage

### Basic Usage

```jsx
import { CountriesDropdown } from "@/features/countries";

function MyComponent() {
  const [selectedCountry, setSelectedCountry] = useState("");

  return (
    <CountriesDropdown
      value={selectedCountry}
      onValueChange={setSelectedCountry}
      placeholder="Select a country"
      label="Country"
      required
    />
  );
}
```

### Advanced Usage

```jsx
import { CountriesDropdown } from "@/features/countries";

function HotelForm() {
  const [formData, setFormData] = useState({
    countryId: "",
    countryName: "",
  });

  const handleCountryChange = (countryId) => {
    // You can also get the full country object if needed
    const selectedCountry = countries.find((c) => c.value === countryId);

    setFormData((prev) => ({
      ...prev,
      countryId,
      countryName: selectedCountry?.label || "",
    }));
  };

  return (
    <CountriesDropdown
      value={formData.countryId}
      onValueChange={handleCountryChange}
      placeholder="Select a country"
      label="Country"
      required
      showSearch={true}
      disabled={false}
      className="w-full"
    />
  );
}
```

## Props

| Prop            | Type                          | Default              | Description                   |
| --------------- | ----------------------------- | -------------------- | ----------------------------- |
| `value`         | `string`                      | -                    | Selected country ID           |
| `onValueChange` | `(countryId: string) => void` | -                    | Callback when country changes |
| `placeholder`   | `string`                      | `"Select a country"` | Placeholder text              |
| `label`         | `string`                      | `"Country"`          | Label text                    |
| `className`     | `string`                      | `""`                 | Additional CSS classes        |
| `disabled`      | `boolean`                     | `false`              | Disable the dropdown          |
| `required`      | `boolean`                     | `false`              | Show required indicator       |
| `showSearch`    | `boolean`                     | `true`               | Show search input             |

## Redux State

The component automatically manages Redux state:

```javascript
// State structure
{
  countries: {
    data: CountryEntity[],
    loading: boolean,
    error: string | null,
    searchTerm: string
  }
}
```

## API Calls

- **Initial load**: Fetches all countries on component mount
- **Search**: Debounced search with 300ms delay
- **Caching**: Data is cached in Redux store

## Error Handling

- Displays error toasts for API failures
- Shows loading states during API calls
- Graceful fallback for missing data

## Styling

Uses ShadCN/UI components with Tailwind CSS:

- `Select` for the dropdown
- `Input` for search
- `Label` for form labels
- Consistent with design system
