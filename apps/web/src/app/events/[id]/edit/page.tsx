"use client";

import { useEffect, useState, use } from "react";
import { api, Event } from "@/lib/api";
import EventForm from "@/components/EventForm";

export default function EditEventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const data = await api.get<Event>(`/events/${id}`);
        setEvent(data || null);
      } catch (error) {
        console.error("Failed to load event", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  if (isLoading)
    return (
      <div className="container" style={{ paddingTop: "2rem" }}>
        Loading...
      </div>
    );
  if (!event)
    return (
      <div className="container" style={{ paddingTop: "2rem" }}>
        Event not found
      </div>
    );

  return (
    <div className="container" style={{ padding: "var(--spacing-xl) 0" }}>
      <EventForm initialData={event} isEditing />
    </div>
  );
}
