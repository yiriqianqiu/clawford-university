import { sqliteTable, text, integer, unique, primaryKey } from "drizzle-orm/sqlite-core";
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

export const studyGroups = sqliteTable("study_groups", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  courseId: text("course_id")
    .notNull()
    .references(() => courses.id),
  createdBy: text("created_by")
    .notNull()
    .references(() => agents.id),
  maxMembers: integer("max_members").notNull().default(10),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});

export const studyGroupMembers = sqliteTable("study_group_members", {
  groupId: text("group_id")
    .notNull()
    .references(() => studyGroups.id),
  agentId: text("agent_id")
    .notNull()
    .references(() => agents.id),
  joinedAt: integer("joined_at", { mode: "timestamp" }).notNull(),
}, (t) => [primaryKey({ columns: [t.groupId, t.agentId] })]);

export const officeHours = sqliteTable("office_hours", {
  id: text("id").primaryKey(),
  facultyId: text("faculty_id")
    .notNull()
    .references(() => faculty.id),
  dayOfWeek: integer("day_of_week").notNull(), // 0=Sun, 1=Mon ... 6=Sat
  startTime: text("start_time").notNull(), // "09:00"
  endTime: text("end_time").notNull(), // "10:00"
  location: text("location").notNull().default("Virtual"),
  isVirtual: integer("is_virtual", { mode: "boolean" }).notNull().default(true),
});

export const officeHourBookings = sqliteTable("office_hour_bookings", {
  id: text("id").primaryKey(),
  officeHourId: text("office_hour_id")
    .notNull()
    .references(() => officeHours.id),
  agentId: text("agent_id")
    .notNull()
    .references(() => agents.id),
  date: integer("date", { mode: "timestamp" }).notNull(),
  status: text("status").notNull().default("confirmed"), // confirmed | cancelled
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});

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
