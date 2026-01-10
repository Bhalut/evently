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
            <Link
              href={`/events/${event.id}`}
              key={event.id}
              className={styles.card}
            >
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
            </Link>
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
