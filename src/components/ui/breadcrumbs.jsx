import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { Separator } from "@/components/ui/separator";
import { selectSingleHotel } from "@/features/hotels/singleHotelSelectors";

export function Breadcrumbs() {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter(Boolean);

  // Get hotel data if on single hotel page
  const hotel = useSelector(selectSingleHotel);
  const isHotelDetailPage =
    pathnames.length === 3 &&
    pathnames[0] === "dashboard" &&
    pathnames[1] === "hotels";

  // If on /dashboard or root, just show Dashboard as bold
  if (pathnames.length === 1 && pathnames[0] === "dashboard") {
    return (
      <nav
        className="flex items-center text-sm text-muted-foreground overflow-hidden"
        aria-label="Breadcrumb"
      >
        <span className="font-semibold text-foreground capitalize truncate">
          Dashboard
        </span>
      </nav>
    );
  }

  return (
    <nav
      className="flex items-center text-sm text-muted-foreground overflow-hidden flex-wrap gap-x-2"
      aria-label="Breadcrumb"
    >
      <Link to="/dashboard" className="hover:underline truncate">
        Dashboard
      </Link>
      {pathnames.map((segment, idx) => {
        // Skip the first 'dashboard' segment to avoid repetition
        if (idx === 0 && segment === "dashboard") return null;
        const to = `/${pathnames.slice(0, idx + 1).join("/")}`;
        const isLast = idx === pathnames.length - 1;

        // For hotel detail page, show hotel name instead of ID
        let displayText = segment.replace(/-/g, " ");
        if (isHotelDetailPage && idx === 2 && hotel?.name) {
          displayText = hotel.name;
        }

        return (
          <React.Fragment key={to}>
            <Separator
              orientation="vertical"
              className="mx-2 h-4 flex-shrink-0"
            />
            {isLast ? (
              <span
                className="font-semibold text-foreground capitalize truncate max-w-[200px] sm:max-w-[300px] md:max-w-none"
                title={displayText}
              >
                {displayText}
              </span>
            ) : (
              <Link
                to={to}
                className="hover:underline capitalize truncate max-w-[200px] sm:max-w-[300px] md:max-w-none"
                title={displayText}
              >
                {displayText}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
