"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api, Event, ApiError } from "@/lib/api";
import { SkeletonGrid } from "@/components/LoadingSpinner";
import { SearchBar, FilterChips } from "@/components/SearchBar";
import styles from "./events.module.css";

const TIME_FILTERS = [
  { id: "all", label: "All Events", active: true },
  { id: "upcoming", label: "Upcoming", active: false },
  { id: "thisWeek", label: "This Week", active: false },
  { id: "thisMonth", label: "This Month", active: false },
];

export default function EventsPage() {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState(TIME_FILTERS);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await api.get<Event[]>("/events");
        setEvents(data || []);
      } catch (err: unknown) {
        if ((err as ApiError)?.statusCode === 401) {
          router.push("/login");
          return;
        }
        setError("Failed to load events");
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, [router]);

  const handleDelete = async (e: React.MouseEvent, id: number) => {
    e.preventDefault();
    e.stopPropagation();

    if (!confirm("Are you sure you want to delete this event?")) return;

    setIsDeleting(id);
    try {
      await api.delete(`/events/${id}`);
      setEvents(events.filter((ev) => ev.id !== id));
    } catch (err) {
      console.error("Failed to delete event", err);
      alert("Failed to delete event");
    } finally {
      setIsDeleting(null);
    }
  };

  const handleEdit = (e: React.MouseEvent, id: number) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/events/${id}/edit`);
  };

  const handleFilterToggle = (id: string) => {
    setFilters(filters.map((f) => ({ ...f, active: f.id === id })));
  };

  const filteredEvents = useMemo(() => {
    let result = events;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (event) =>
          event.name.toLowerCase().includes(query) ||
          event.place?.toLowerCase().includes(query),
      );
    }

    const activeFilter = filters.find((f) => f.active)?.id || "all";
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 7);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    switch (activeFilter) {
      case "upcoming":
        result = result.filter((event) => new Date(event.date) >= now);
        break;
      case "thisWeek":
        result = result.filter((event) => {
          const eventDate = new Date(event.date);
          return eventDate >= startOfWeek && eventDate < endOfWeek;
        });
        break;
      case "thisMonth":
        result = result.filter((event) => {
          const eventDate = new Date(event.date);
          return eventDate >= startOfMonth && eventDate <= endOfMonth;
        });
        break;
    }

    return result;
  }, [events, searchQuery, filters]);

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Events</h1>
          <div className={styles.headerActions}>
            <Link href="/events/new" className="btn btn-primary">
              Add Event
            </Link>
          </div>
        </div>
        <div className={styles.grid}>
          <SkeletonGrid count={6} />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Events</h1>
        <div className={styles.headerActions}>
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
          <Link href="/events/calendar" className="btn btn-outline">
            Calendar
          </Link>
          <Link href="/events/new" className="btn btn-primary">
            Add Event
          </Link>
        </div>
      </div>

      <div className={styles.filterSection}>
        <FilterChips filters={filters} onToggle={handleFilterToggle} />
      </div>

      {error && (
        <div style={{ color: "var(--color-error)", marginBottom: "1rem" }}>
          {error}
        </div>
      )}

      <div className={styles.grid}>
        {filteredEvents.length === 0 && !error ? (
          <div className={styles.emptyState}>
            {searchQuery || filters.find((f) => f.active)?.id !== "all"
              ? "No events match your filters. Try adjusting your search."
              : "No events found. Create your first event!"}
          </div>
        ) : (
          filteredEvents.map((event) => (
            <div key={event.id} className={styles.card}>
              <Link href={`/events/${event.id}`} className={styles.cardLink}>
                <div className={styles.cardContent}>
                  <div className={styles.eventDate}>
                    {new Date(event.date).toLocaleDateString(undefined, {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                  <h2 className={styles.eventName}>{event.name}</h2>
                  <div className={styles.eventLocation}>📍 {event.place}</div>
                </div>
              </Link>

              <div className={styles.cardActions}>
                <button
                  className={`${styles.cardActionBtn} ${styles.editBtn}`}
                  onClick={(e) => handleEdit(e, event.id)}
                >
                  Edit
                </button>
                <button
                  className={`${styles.cardActionBtn} ${styles.deleteBtn}`}
                  onClick={(e) => handleDelete(e, event.id)}
                  disabled={isDeleting === event.id}
                >
                  {isDeleting === event.id ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <Link href="/events/new" className={styles.fab} aria-label="Create Event">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className={styles.fabIcon}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 4.5v15m7.5-7.5h-15"
          />
        </svg>
      </Link>
    </div>
  );
}
