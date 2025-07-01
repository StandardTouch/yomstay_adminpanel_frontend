import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Separator } from "@/components/ui/separator";

export function Breadcrumbs() {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter(Boolean);

  // If on /dashboard or root, just show Dashboard as bold
  if (pathnames.length === 1 && pathnames[0] === "dashboard") {
    return (
      <nav className="flex items-center text-sm text-muted-foreground" aria-label="Breadcrumb">
        <span className="font-semibold text-foreground capitalize">Dashboard</span>
      </nav>
    );
  }

  return (
    <nav className="flex items-center text-sm text-muted-foreground" aria-label="Breadcrumb">
      <Link to="/dashboard" className="hover:underline">Dashboard</Link>
      {pathnames.map((segment, idx) => {
        // Skip the first 'dashboard' segment to avoid repetition
        if (idx === 0 && segment === "dashboard") return null;
        const to = `/${pathnames.slice(0, idx + 1).join("/")}`;
        const isLast = idx === pathnames.length - 1;
        return (
          <React.Fragment key={to}>
            <Separator orientation="vertical" className="mx-2 h-4" />
            {isLast ? (
              <span className="font-semibold text-foreground capitalize">{segment.replace(/-/g, ' ')}</span>
            ) : (
              <Link to={to} className="hover:underline capitalize">{segment.replace(/-/g, ' ')}</Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
} 