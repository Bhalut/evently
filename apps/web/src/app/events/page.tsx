"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api, Event, ApiError } from "@/lib/api";
import styles from "./events.module.css";

export default function EventsPage() {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isDeleting, setIsDeleting] = useState<number | null>(null);

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
      setEvents(events.filter((e) => e.id !== id));
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

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Events</h1>
        </div>
        <div>Loading events...</div>
      </div>
    );
  }

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

      {error && (
        <div style={{ color: "var(--color-error)", marginBottom: "1rem" }}>
          {error}
        </div>
      )}

      <div className={styles.grid}>
        {events.length === 0 && !error ? (
          <div className={styles.emptyState}>
            No events found. Create your first event!
          </div>
        ) : (
          events.map((event) => (
            <div key={event.id} className={styles.card}>
              <Link href={`/events/${event.id}`} className={styles.cardLink}>
                <div className={styles.cardContent}>
                  <h2 className={styles.eventName}>{event.name}</h2>
                  <div className={styles.eventDate}>
                    {new Date(event.date).toLocaleDateString(undefined, {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
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
