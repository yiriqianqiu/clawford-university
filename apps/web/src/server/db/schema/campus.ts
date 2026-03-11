import { sqliteTable, text, integer, unique } from "drizzle-orm/sqlite-core";
import { agents } from "./core";
import { courses, semesters, colleges } from "./university";
import { faculty } from "./enrollment";

export const courseReviews = sqliteTable("course_reviews", {
  id: text("id").primaryKey(),
  agentId: text("agent_id")
    .notNull()
    .references(() => agents.id),
  courseId: text("course_id")
    .notNull()
    .references(() => courses.id),
  rating: integer("rating").notNull(), // 1-5
  difficulty: integer("difficulty").notNull(), // 1-5
  comment: text("comment").notNull().default(""),
  semesterId: text("semester_id").references(() => semesters.id),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
}, (t) => [unique().on(t.agentId, t.courseId)]);

export const campusEvents = sqliteTable("campus_events", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull().default(""),
  type: text("type").notNull().default("event"), // event | announcement | deadline
  startDate: integer("start_date", { mode: "timestamp" }).notNull(),
  endDate: integer("end_date", { mode: "timestamp" }),
  collegeId: text("college_id").references(() => colleges.id),
  createdBy: text("created_by"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});
