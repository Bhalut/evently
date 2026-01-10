"use client";

import { useState, useRef, useEffect } from "react";
import styles from "./SearchBar.module.css";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchBar({
  value,
  onChange,
  placeholder = "Search events...",
}: SearchBarProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isExpanded]);

  const handleClear = () => {
    onChange("");
    inputRef.current?.focus();
  };

  return (
    <div
      className={`${styles.searchContainer} ${isExpanded || value ? styles.expanded : ""}`}
    >
      <button
        className={styles.searchButton}
        onClick={() => setIsExpanded(!isExpanded)}
        aria-label="Search"
      >
        <svg
          className={styles.searchIcon}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21l-4.35-4.35" />
        </svg>
      </button>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={styles.searchInput}
        onBlur={() => !value && setIsExpanded(false)}
      />
      {value && (
        <button
          className={styles.clearButton}
          onClick={handleClear}
          aria-label="Clear search"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}

interface FilterChip {
  id: string;
  label: string;
  active: boolean;
}

interface FilterChipsProps {
  filters: FilterChip[];
  onToggle: (id: string) => void;
}

export function FilterChips({ filters, onToggle }: FilterChipsProps) {
  return (
    <div className={styles.filterChips}>
      {filters.map((filter) => (
        <button
          key={filter.id}
          className={`${styles.filterChip} ${filter.active ? styles.active : ""}`}
          onClick={() => onToggle(filter.id)}
        >
          {filter.label}
          {filter.active && (
            <svg
              className={styles.checkIcon}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
            >
              <path d="M20 6L9 17l-5-5" />
            </svg>
          )}
        </button>
      ))}
    </div>
  );
}
