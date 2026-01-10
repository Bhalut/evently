"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api, Event, ApiError } from "@/lib/api";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import styles from "./dashboard.module.css";

interface StatCard {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  trend?: { value: number; isUp: boolean };
}

export default function DashboardPage() {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  const stats = useMemo(() => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    const upcoming = events.filter((e) => new Date(e.date) >= now);
    const thisMonth = events.filter((e) => new Date(e.date) >= startOfMonth);
    const lastMonth = events.filter((e) => {
      const d = new Date(e.date);
      return d >= startOfLastMonth && d <= endOfLastMonth;
    });

    // Calculate unique locations
    const locations = new Set(events.map((e) => e.place));

    return {
      total: events.length,
      upcoming: upcoming.length,
      thisMonth: thisMonth.length,
      lastMonth: lastMonth.length,
      locations: locations.size,
    };
  }, [events]);

  const upcomingEvents = useMemo(() => {
    const now = new Date();
    return events
      .filter((e) => new Date(e.date) >= now)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 5);
  }, [events]);

  const monthlyData = useMemo(() => {
    const data: { month: string; count: number }[] = [];
    const now = new Date();

    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEvents = events.filter((e) => {
        const eventDate = new Date(e.date);
        return (
          eventDate.getMonth() === date.getMonth() &&
          eventDate.getFullYear() === date.getFullYear()
        );
      });
      data.push({
        month: date.toLocaleDateString("en-US", { month: "short" }),
        count: monthEvents.length,
      });
    }
    return data;
  }, [events]);

  const maxMonthlyCount = Math.max(...monthlyData.map((d) => d.count), 1);

  if (isLoading) {
    return (
      <div className={styles.container}>
        <LoadingSpinner size="lg" text="Loading dashboard..." />
      </div>
    );
  }

  const statCards: StatCard[] = [
    {
      label: "Total Events",
      value: stats.total,
      color: "#6366f1",
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      ),
    },
    {
      label: "Upcoming",
      value: stats.upcoming,
      color: "#22c55e",
      trend:
        stats.lastMonth > 0
          ? {
              value: Math.round((stats.thisMonth / stats.lastMonth - 1) * 100),
              isUp: stats.thisMonth >= stats.lastMonth,
            }
          : undefined,
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      ),
    },
    {
      label: "This Month",
      value: stats.thisMonth,
      color: "#f59e0b",
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
        </svg>
      ),
    },
    {
      label: "Locations",
      value: stats.locations,
      color: "#8b5cf6",
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
      ),
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Dashboard</h1>
        <div className={styles.headerActions}>
          <Link href="/events" className="btn btn-outline">
            View All Events
          </Link>
          <Link href="/events/new" className="btn btn-primary">
            Create Event
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className={styles.statsGrid}>
        {statCards.map((stat, i) => (
          <div
            key={stat.label}
            className={styles.statCard}
            style={
              {
                "--delay": `${i * 0.1}s`,
                "--accent": stat.color,
              } as React.CSSProperties
            }
          >
            <div
              className={styles.statIcon}
              style={{ background: `${stat.color}20`, color: stat.color }}
            >
              {stat.icon}
            </div>
            <div className={styles.statContent}>
              <span className={styles.statValue}>{stat.value}</span>
              <span className={styles.statLabel}>{stat.label}</span>
            </div>
            {stat.trend && (
              <div
                className={`${styles.trend} ${stat.trend.isUp ? styles.trendUp : styles.trendDown}`}
              >
                {stat.trend.isUp ? "↑" : "↓"} {Math.abs(stat.trend.value)}%
              </div>
            )}
          </div>
        ))}
      </div>

      <div className={styles.mainGrid}>
        {/* Chart Section */}
        <div className={styles.chartCard}>
          <h2 className={styles.cardTitle}>Events by Month</h2>
          <div className={styles.chart}>
            {monthlyData.map((data, i) => (
              <div
                key={data.month}
                className={styles.chartBar}
                style={{ "--delay": `${i * 0.1}s` } as React.CSSProperties}
              >
                <div
                  className={styles.bar}
                  style={{ height: `${(data.count / maxMonthlyCount) * 100}%` }}
                >
                  <span className={styles.barValue}>{data.count}</span>
                </div>
                <span className={styles.barLabel}>{data.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className={styles.upcomingCard}>
          <h2 className={styles.cardTitle}>Upcoming Events</h2>
          {upcomingEvents.length === 0 ? (
            <div className={styles.emptyState}>No upcoming events</div>
          ) : (
            <div className={styles.eventList}>
              {upcomingEvents.map((event, i) => (
                <Link
                  key={event.id}
                  href={`/events/${event.id}`}
                  className={styles.eventItem}
                  style={{ "--delay": `${i * 0.05}s` } as React.CSSProperties}
                >
                  <div className={styles.eventDate}>
                    <span className={styles.eventDay}>
                      {new Date(event.date).getDate()}
                    </span>
                    <span className={styles.eventMonth}>
                      {new Date(event.date).toLocaleDateString("en-US", {
                        month: "short",
                      })}
                    </span>
                  </div>
                  <div className={styles.eventDetails}>
                    <span className={styles.eventName}>{event.name}</span>
                    <span className={styles.eventLocation}>
                      📍 {event.place}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
