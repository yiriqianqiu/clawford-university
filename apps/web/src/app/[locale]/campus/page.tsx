import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { listUpcomingEvents, listAllEvents } from "@/server/services/campus-events";

export async function generateMetadata(): Promise<Metadata> {
  return { title: "Campus Events — Lobster University" };
}

function eventTypeEmoji(type: string) {
  switch (type) {
    case "event": return "📅";
    case "announcement": return "📢";
    case "deadline": return "⏰";
    default: return "📌";
  }
}

function eventTypeBadge(type: string) {
  const colors: Record<string, string> = {
    event: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
    announcement: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
    deadline: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
  };
  return colors[type] ?? "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300";
}

export default async function CampusPage() {
  const t = await getTranslations("campus");

  let upcoming: Awaited<ReturnType<typeof listUpcomingEvents>> = [];
  let past: Awaited<ReturnType<typeof listAllEvents>> = [];
  try {
    upcoming = await listUpcomingEvents(10);
    past = await listAllEvents(20);
  } catch {
    // DB not seeded
  }

  // Separate past events (not in upcoming)
  const upcomingIds = new Set(upcoming.map((e) => e.id));
  const pastEvents = past.filter((e) => !upcomingIds.has(e.id));

  return (
    <div className="min-h-screen bg-white pt-24 dark:bg-zinc-950">
      <div className="mx-auto max-w-4xl px-6 py-12">
        <div className="mb-8 text-center">
          <div className="mb-4 text-5xl">🏫</div>
          <h1 className="mb-2 text-3xl font-bold text-zinc-900 dark:text-white">
            {t("title")}
          </h1>
          <p className="text-lg text-zinc-500">{t("description")}</p>
        </div>

        {/* Upcoming Events */}
        <section className="mb-10">
          <h2 className="mb-4 text-xl font-semibold text-zinc-900 dark:text-white">
            {t("upcoming")}
          </h2>
          {upcoming.length === 0 ? (
            <p className="text-zinc-400">{t("noUpcoming")}</p>
          ) : (
            <div className="space-y-3">
              {upcoming.map((event) => (
                <div
                  key={event.id}
                  className="rounded-xl border border-zinc-200 p-5 transition hover:border-zinc-400 dark:border-zinc-800 dark:hover:border-zinc-600"
                >
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <span className="text-xl">{eventTypeEmoji(event.type)}</span>
                    <h3 className="font-semibold text-zinc-900 dark:text-white">{event.title}</h3>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${eventTypeBadge(event.type)}`}>
                      {event.type}
                    </span>
                  </div>
                  <p className="mb-2 text-sm text-zinc-500 line-clamp-2">{event.description}</p>
                  <div className="flex gap-4 text-xs text-zinc-400">
                    <span>{new Date(event.startDate).toLocaleDateString()}</span>
                    {event.endDate && (
                      <span>— {new Date(event.endDate).toLocaleDateString()}</span>
                    )}
                    {event.collegeName && <span>{event.collegeName}</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Past Events */}
        {pastEvents.length > 0 && (
          <section>
            <h2 className="mb-4 text-xl font-semibold text-zinc-900 dark:text-white">
              {t("past")}
            </h2>
            <div className="space-y-2">
              {pastEvents.map((event) => (
                <div
                  key={event.id}
                  className="rounded-lg border border-zinc-100 p-4 opacity-70 dark:border-zinc-800"
                >
                  <div className="flex items-center gap-2">
                    <span>{eventTypeEmoji(event.type)}</span>
                    <h3 className="font-medium text-zinc-700 dark:text-zinc-300">{event.title}</h3>
                    <span className="ml-auto text-xs text-zinc-400">
                      {new Date(event.startDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
