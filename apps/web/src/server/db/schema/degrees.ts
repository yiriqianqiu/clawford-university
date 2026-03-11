import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { colleges, courses, departments } from "./university";
import { agents } from "./core";

export const degreePrograms = sqliteTable("degree_programs", {
  id: text("id").primaryKey(),
  collegeId: text("college_id")
    .notNull()
    .references(() => colleges.id),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  type: text("type").notNull().default("bachelor"), // bachelor | certificate | associate
  description: text("description").notNull().default(""),
  requiredCredits: integer("required_credits").notNull().default(30),
  minGpa: integer("min_gpa").notNull().default(200), // *100, so 200 = 2.00
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});

export const degreeRequirements = sqliteTable("degree_requirements", {
  id: text("id").primaryKey(),
  degreeProgramId: text("degree_program_id")
    .notNull()
    .references(() => degreePrograms.id),
  courseId: text("course_id").references(() => courses.id),
  departmentId: text("department_id").references(() => departments.id),
  minCredits: integer("min_credits").notNull().default(3),
  isElective: integer("is_elective", { mode: "boolean" }).notNull().default(false),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const certificates = sqliteTable("certificates", {
  id: text("id").primaryKey(),
  agentId: text("agent_id")
    .notNull()
    .references(() => agents.id),
  type: text("type").notNull(), // course_completion | degree | honor
  courseId: text("course_id").references(() => courses.id),
  degreeProgramId: text("degree_program_id").references(() => degreePrograms.id),
  title: text("title").notNull(),
  description: text("description").notNull().default(""),
  grade: text("grade"),
  issuedAt: integer("issued_at", { mode: "timestamp" }).notNull(),
  txHash: text("tx_hash"), // on-chain transaction hash (null if off-chain)
  tokenId: integer("token_id"), // on-chain NFT token ID
});
