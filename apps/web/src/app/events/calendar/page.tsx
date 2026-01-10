"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api, Event, ApiError } from "@/lib/api";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import styles from "./calendar.module.css";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default function CalendarPage() {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [hoveredDay, setHoveredDay] = useState<number | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await api.get<Event[]>("/events");
        setEvents(data || []);
      } catch (err: unknown) {
        if ((err as ApiError)?.statusCode === 401) {
          router.push("/login");
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchEvents();
  }, [router]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const getEventsForDay = (day: number) => {
    return events.filter((event) => {
      const eventDate = new Date(event.date);
      return (
        eventDate.getFullYear() === year &&
        eventDate.getMonth() === month &&
        eventDate.getDate() === day
      );
    });
  };

  const isToday = (day: number) => {
    const today = new Date();
    return (
      today.getFullYear() === year &&
      today.getMonth() === month &&
      today.getDate() === day
    );
  };

  const days = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(<div key={`empty-${i}`} className={styles.emptyDay}></div>);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    const dayEvents = getEventsForDay(day);
    const isCurrentDay = isToday(day);
    const isHovered = hoveredDay === day;

    days.push(
      <div
        key={day}
        className={`${styles.day} ${isCurrentDay ? styles.today : ""} ${dayEvents.length > 0 ? styles.hasEvents : ""}`}
        onMouseEnter={() => setHoveredDay(day)}
        onMouseLeave={() => setHoveredDay(null)}
      >
        <span className={styles.dayNumber}>{day}</span>
        {dayEvents.length > 0 && (
          <div className={styles.eventDots}>
            {dayEvents.slice(0, 3).map((event, i) => (
              <span
                key={event.id}
                className={styles.eventDot}
                style={{ animationDelay: `${i * 0.1}s` }}
              ></span>
            ))}
            {dayEvents.length > 3 && (
              <span className={styles.moreIndicator}>
                +{dayEvents.length - 3}
              </span>
            )}
          </div>
        )}
        {isHovered && dayEvents.length > 0 && (
          <div className={styles.tooltip}>
            {dayEvents.map((event) => (
              <Link
                key={event.id}
                href={`/events/${event.id}`}
                className={styles.tooltipEvent}
              >
                <span className={styles.tooltipTime}>
                  {new Date(event.date).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
                <span className={styles.tooltipName}>{event.name}</span>
              </Link>
            ))}
          </div>
        )}
      </div>,
    );
  }

  if (isLoading) {
    return (
      <div className={styles.container}>
        <LoadingSpinner size="lg" text="Loading calendar..." />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.navigation}>
          <button onClick={prevMonth} className={styles.navButton}>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <h1 className={styles.title}>
            {MONTHS[month]} {year}
          </h1>
          <button onClick={nextMonth} className={styles.navButton}>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>
        <div className={styles.actions}>
          <button onClick={goToToday} className={styles.todayButton}>
            Today
          </button>
          <Link href="/events" className={styles.viewToggle}>
            List View
          </Link>
        </div>
      </div>

      <div className={styles.calendar}>
        <div className={styles.weekdays}>
          {DAYS.map((day) => (
            <div key={day} className={styles.weekday}>
              {day}
            </div>
          ))}
        </div>
        <div className={styles.days}>{days}</div>
      </div>

      <Link href="/events/new" className={styles.fab} aria-label="Create Event">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
      </Link>
    </div>
  );
}
