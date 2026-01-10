"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api, Event, ApiError } from "@/lib/api";
import { logger } from "@/lib/logger";
import styles from "./event-detail.module.css";

export default function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id } = use(params);

  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const data = await api.get<Event>(`/events/${id}`);
        setEvent(data || null);
      } catch (err: unknown) {
        if ((err as ApiError)?.statusCode === 404) {
          setError("Event not found");
        } else {
          setError("Failed to load event details");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await api.delete(`/events/${id}`);
      router.push("/events");
    } catch (error) {
      logger.error({ eventId: id, error }, "Failed to delete event");
      setDeleteError(true);
      setShowDeleteConfirm(false);
      setIsDeleting(false);
    }
  };

  if (isLoading)
    return <div className={styles.container}>Loading details...</div>;
  if (error || !event)
    return (
      <div className={styles.container} style={{ color: "var(--color-error)" }}>
        {error || "Event not found"}
      </div>
    );

  return (
    <div className={styles.container}>
      <Link href="/events" className={styles.backButton}>
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        Back to Events
      </Link>

      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>{event.name}</h1>
          <div className={styles.date}>
            📅{" "}
            {new Date(event.date).toLocaleDateString(undefined, {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionLabel}>Location</div>
          <div className={styles.location}>📍 {event.place}</div>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionLabel}>Description</div>
          <div className={styles.description}>{event.description}</div>
        </div>

        <div className={styles.actions}>
          <button
            className="btn btn-danger"
            onClick={() => setShowDeleteConfirm(true)}
          >
            Delete
          </button>
          <Link href={`/events/${id}/edit`} className="btn btn-primary">
            Edit Event
          </Link>
        </div>
      </div>

      {showDeleteConfirm && (
        <div className={styles.confirmDelete}>
          <div className={styles.confirmDialog}>
            <h3>Delete Event?</h3>
            <p>
              Are you sure you want to delete <strong>{event.name}</strong>?
              This action cannot be undone.
            </p>
            <div className={styles.dialogButtons}>
              <button
                className="btn btn-outline"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                className="btn btn-danger"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Confirm Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteError && (
        <div className={styles.confirmDelete}>
          <div className={styles.confirmDialog}>
            <h3>Error</h3>
            <p>Failed to delete the event. Please try again later.</p>
            <div className={styles.dialogButtons}>
              <button
                className="btn btn-primary"
                onClick={() => setDeleteError(false)}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
