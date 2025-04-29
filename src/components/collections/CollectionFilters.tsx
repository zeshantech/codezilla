"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchInput } from "../ui/search-input";
import { Selector } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { debounce } from "@/lib/utils";

export interface ICollectionFilters {
  search?: string;
  tags?: string[];
  featured?: boolean;
  sortBy?: "popularity" | "newest" | "title";
}

export function CollectionFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState<ICollectionFilters>({
    search: searchParams.get("search") || "",
    tags: searchParams.getAll("tag"),
    featured: searchParams.get("featured") === "true",
    sortBy: (searchParams.get("sortBy") as ICollectionFilters["sortBy"]) || "popularity",
  });

  const [searchQuery, setSearchQuery] = useState<string>(filters.search || "");

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();

    if (filters.search) {
      params.set("search", filters.search);
    }

    if (filters.sortBy) {
      params.set("sortBy", filters.sortBy);
    }

    if (filters.featured) {
      params.set("featured", "true");
    }

    if (filters.tags && filters.tags.length > 0) {
      filters.tags.forEach((tag) => {
        params.append("tag", tag);
      });
    }

    const queryString = params.toString();
    router.push(queryString ? `?${queryString}` : "");
  }, [filters, router]);

  // Update filters and URL
  const updateFilters = (newFilters: Partial<ICollectionFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  // Debounced search handler
  const debouncedSearch = debounce((value: string) => {
    updateFilters({ search: value });
  }, 800);

  // Handle search input
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    debouncedSearch(value);
  };

  // Handle sort change
  const handleSortChange = (value: string) => {
    updateFilters({ sortBy: value as ICollectionFilters["sortBy"] });
  };

  // Handle featured toggle
  const handleFeaturedToggle = () => {
    updateFilters({ featured: !filters.featured });
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      sortBy: "popularity",
    });
    setSearchQuery("");
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <SearchInput
        placeholder="Search problems..."
        value={searchQuery}
        onChange={handleSearchChange}
        onClear={() => {
          setSearchQuery("");
          updateFilters({ search: "" });
        }}
        className="flex-grow"
      />

      <div className="flex flex-wrap gap-2 ml-auto">
        <Selector
          value={filters.sortBy || "popularity"}
          onChange={handleSortChange}
          options={[
            { value: "popularity", label: "Most Popular" },
            { value: "newest", label: "Newest" },
            { value: "title", label: "Title A-Z" },
          ]}
          placeholder="Sort by"
          className="w-40"
        />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-40 flex justify-start gap-2">
              <Filter />
              <span>Filters</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuCheckboxItem checked={filters.featured} onCheckedChange={handleFeaturedToggle}>
              Featured Only
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {(filters.search || filters.tags?.length || filters.featured) && (
          <Button variant="outline" onClick={clearFilters}>
            <X />
            Clear
          </Button>
        )}
      </div>
    </div>
  );
}
