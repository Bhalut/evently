"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { api, Event, ApiError } from "../lib/api";
import styles from "../app/events/form.module.css";

const eventSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  date: z
    .string()
    .refine(
      (date) => new Date(date).toString() !== "Invalid Date",
      "Invalid date"
    ),
  description: z.string().min(10, "Description must be at least 10 characters"),
  place: z.string().min(3, "Location is required"),
});

interface EventFormProps {
  initialData?: Partial<Event>;
  isEditing?: boolean;
}

export default function EventForm({
  initialData,
  isEditing = false,
}: EventFormProps) {
  const router = useRouter();

  /**
   * Formats an ISO date string for the `datetime-local` input.
   *
   * The `datetime-local` input expects the format `YYYY-MM-DDTHH:mm` in local time,
   * but our API stores dates in UTC. This function converts UTC to the user's
   * local timezone for display in the form.
   *
   * @param dateString - ISO 8601 date string from the API (UTC)
   * @returns Local datetime string formatted as `YYYY-MM-DDTHH:mm`, or empty string if no date
   */
  const formatDateForInput = (dateString?: string): string => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const offset = date.getTimezoneOffset() * 60000;
    const localISOTime = new Date(date.getTime() - offset)
      .toISOString()
      .slice(0, 16);
    return localISOTime;
  };

  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    date: formatDateForInput(initialData?.date),
    description: initialData?.description || "",
    place: initialData?.place || "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generalError, setGeneralError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setGeneralError("");

    const result = eventSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          fieldErrors[issue.path[0].toString()] = issue.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        ...formData,
        date: new Date(formData.date).toISOString(), // Convert local time to UTC
      };

      if (isEditing && initialData?.id) {
        await api.put(`/events/${initialData.id}`, payload);
        router.push(`/events/${initialData.id}`);
      } else {
        await api.post("/events", payload);
        router.push("/events");
      }
      router.refresh();
    } catch (err: unknown) {
      const apiError = err as ApiError;
      setGeneralError(
        (Array.isArray(apiError.message)
          ? apiError.message[0]
          : apiError.message) || "Failed to save event"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.formContainer}>
      <h2 className={styles.title}>
        {isEditing ? "Edit Event" : "Create New Event"}
      </h2>

      {generalError && (
        <div style={{ color: "var(--color-error)", marginBottom: "1rem" }}>
          {generalError}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="name">
            Event Name
          </label>
          <input
            id="name"
            type="text"
            className={styles.input}
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Annual Gala"
            disabled={isSubmitting}
          />
          {errors.name && <div className={styles.error}>{errors.name}</div>}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="date">
            Date & Time
          </label>
          <input
            id="date"
            type="datetime-local"
            className={styles.input}
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            disabled={isSubmitting}
          />
          {errors.date && <div className={styles.error}>{errors.date}</div>}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="place">
            Location (Place)
          </label>
          <input
            id="place"
            type="text"
            className={styles.input}
            value={formData.place}
            onChange={(e) =>
              setFormData({ ...formData, place: e.target.value })
            }
            placeholder="123 Main St, New York, NY"
            disabled={isSubmitting}
          />
          {errors.place && <div className={styles.error}>{errors.place}</div>}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="description">
            Description
          </label>
          <textarea
            id="description"
            className={styles.textarea}
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            placeholder="Event details..."
            disabled={isSubmitting}
          />
          {errors.description && (
            <div className={styles.error}>{errors.description}</div>
          )}
        </div>

        <div className={styles.actions}>
          <button
            type="button"
            className="btn btn-outline"
            style={{ flex: 1 }}
            onClick={() => router.back()}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            style={{ flex: 1 }}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save Event"}
          </button>
        </div>
      </form>
    </div>
  );
}
