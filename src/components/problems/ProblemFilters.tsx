"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Filter, X } from "lucide-react";
import { Difficulty } from "@/types";
import { Button } from "@/components/ui/button";
import { SearchInput } from "../ui/search-input";
import { Selector } from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CATEGORIES } from "@/data/mock/categories";

export interface IProblemFilters {
  search?: string;
  difficulties?: Difficulty[];
  categories?: string[];
  sortBy?: "popularity" | "newest" | "title" | "difficulty" | "completion_rate";
}

export function ProblemFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize filters from URL params
  const [filters, setFilters] = useState<IProblemFilters>({
    search: searchParams.get("search") || "",
    difficulties: searchParams.getAll("difficulty") as Difficulty[],
    categories: searchParams.getAll("category"),
    sortBy:
      (searchParams.get("sortBy") as IProblemFilters["sortBy"]) || "popularity",
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

    if (filters.difficulties && filters.difficulties.length > 0) {
      filters.difficulties.forEach((difficulty) => {
        params.append("difficulty", difficulty);
      });
    }

    if (filters.categories && filters.categories.length > 0) {
      filters.categories.forEach((category) => {
        params.append("category", category);
      });
    }

    const queryString = params.toString();
    router.push(queryString ? `?${queryString}` : "");
  }, [filters, router]);

  // Update filters and URL
  const updateFilters = (newFilters: Partial<IProblemFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  // Handle search input
  const handleSearch = () => {
    updateFilters({ search: searchQuery });
  };

  // Handle sort change
  const handleSortChange = (sortOption: string) => {
    updateFilters({
      sortBy: sortOption as IProblemFilters["sortBy"],
    });
  };

  // Toggle a difficulty in the filter
  const toggleDifficulty = (difficulty: Difficulty) => {
    const currentDifficulties = filters.difficulties || [];
    const updatedDifficulties = currentDifficulties.includes(difficulty)
      ? currentDifficulties.filter((d) => d !== difficulty)
      : [...currentDifficulties, difficulty];

    updateFilters({ difficulties: updatedDifficulties });
  };

  // Toggle a category in the filter
  const toggleCategory = (category: string) => {
    const currentCategories = filters.categories || [];
    const updatedCategories = currentCategories.includes(category)
      ? currentCategories.filter((c) => c !== category)
      : [...currentCategories, category];

    updateFilters({ categories: updatedCategories });
  };

  // Clear all filters
  const clearAllFilters = () => {
    setSearchQuery("");
    setFilters({
      sortBy: "popularity",
    });
  };

  // Check if any filters are active
  const hasActiveFilters =
    !!filters.search ||
    (filters.difficulties && filters.difficulties.length > 0) ||
    (filters.categories && filters.categories.length > 0);

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <SearchInput
        placeholder="Search problems..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onSearch={handleSearch}
        onClear={() => {
          setSearchQuery("");
          if (filters.search) {
            updateFilters({ search: "" });
          }
        }}
        className="flex-grow"
      />

      <div className="flex gap-2">
        {/* Difficulties Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-40 flex justify-between">
              <div className="flex items-center">
                <Filter className="mr-2" />
                <span>Difficulty</span>
              </div>
              {filters.difficulties && filters.difficulties.length > 0 && (
                <span className="ml-1 rounded-full bg-primary text-primary-foreground w-5 h-5 text-xs flex items-center justify-center">
                  {filters.difficulties.length}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Difficulty Level</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {(["Easy", "Medium", "Hard"] as Difficulty[]).map((difficulty) => (
              <DropdownMenuCheckboxItem
                key={difficulty}
                checked={filters.difficulties?.includes(difficulty)}
                onCheckedChange={() => toggleDifficulty(difficulty)}
              >
                <span
                  className={`mr-2 rounded-full size-2 inline-block
                        ${
                          difficulty === "Easy"
                            ? "bg-success"
                            : difficulty === "Medium"
                            ? "bg-warning"
                            : "bg-error"
                        }`}
                />
                {difficulty}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Categories Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-40 flex justify-between">
              <div className="flex items-center">
                <Filter className="mr-2" />
                <span>Categories</span>
              </div>
              {filters.categories && filters.categories.length > 0 && (
                <span className="ml-1 rounded-full bg-primary text-primary-foreground w-5 h-5 text-xs flex items-center justify-center">
                  {filters.categories.length}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Categories</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {CATEGORIES.map((category) => (
              <DropdownMenuCheckboxItem
                key={category.id}
                checked={filters.categories?.includes(category.id)}
                onCheckedChange={() => toggleCategory(category.id)}
              >
                {category.icon && <category.icon className="mr-2" />}
                {category.name}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Sort Options */}
        <Selector
          options={[
            { label: "Most Popular", value: "popularity" },
            { label: "Newest", value: "newest" },
            { label: "A-Z", value: "title" },
            { label: "Difficulty", value: "difficulty" },
            { label: "Completion Rate", value: "completion_rate" },
          ]}
          value={filters.sortBy || "popularity"}
          onChange={handleSortChange}
          placeholder="Sort by"
          className="w-40"
        />

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <Button variant="outline" onClick={clearAllFilters}>
            <X />
            Clear
          </Button>
        )}
      </div>
    </div>
  );
}

export default ProblemFilters;
