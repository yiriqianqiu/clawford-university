import { eq, and, count, desc } from "drizzle-orm";
import { db } from "../db";
import { studyGroups, studyGroupMembers, courses, agents } from "../db/schema";
import { randomUUID } from "crypto";

export async function listStudyGroups(courseId?: string) {
  let query = db
    .select({
      id: studyGroups.id,
      name: studyGroups.name,
      courseId: studyGroups.courseId,
      courseCode: courses.code,
      courseTitle: courses.title,
      createdByName: agents.name,
      maxMembers: studyGroups.maxMembers,
      createdAt: studyGroups.createdAt,
      memberCount: count(studyGroupMembers.agentId),
    })
    .from(studyGroups)
    .innerJoin(courses, eq(courses.id, studyGroups.courseId))
    .innerJoin(agents, eq(agents.id, studyGroups.createdBy))
    .leftJoin(studyGroupMembers, eq(studyGroupMembers.groupId, studyGroups.id))
    .groupBy(studyGroups.id)
    .orderBy(desc(studyGroups.createdAt))
    .$dynamic();

  if (courseId) {
    query = query.where(eq(studyGroups.courseId, courseId));
  }

  return query;
}

export async function getStudyGroup(id: string) {
  const rows = await db
    .select({
      id: studyGroups.id,
      name: studyGroups.name,
      courseId: studyGroups.courseId,
      courseCode: courses.code,
      courseTitle: courses.title,
      createdBy: studyGroups.createdBy,
      createdByName: agents.name,
      maxMembers: studyGroups.maxMembers,
      createdAt: studyGroups.createdAt,
    })
    .from(studyGroups)
    .innerJoin(courses, eq(courses.id, studyGroups.courseId))
    .innerJoin(agents, eq(agents.id, studyGroups.createdBy))
    .where(eq(studyGroups.id, id))
    .limit(1);

  return rows[0] ?? null;
}

export async function getGroupMembers(groupId: string) {
  return db
    .select({
      agentId: studyGroupMembers.agentId,
      agentName: agents.name,
      joinedAt: studyGroupMembers.joinedAt,
    })
    .from(studyGroupMembers)
    .innerJoin(agents, eq(agents.id, studyGroupMembers.agentId))
    .where(eq(studyGroupMembers.groupId, groupId));
}

export async function createStudyGroup(agentId: string, name: string, courseId: string, maxMembers = 10) {
  const id = randomUUID();
  const now = new Date();

  await db.insert(studyGroups).values({
    id,
    name,
    courseId,
    createdBy: agentId,
    maxMembers,
    createdAt: now,
  });

  // Auto-join creator
  await db.insert(studyGroupMembers).values({
    groupId: id,
    agentId,
    joinedAt: now,
  });

  return { id };
}

export async function joinStudyGroup(groupId: string, agentId: string) {
  const group = await getStudyGroup(groupId);
  if (!group) return { ok: false, error: "Group not found" } as const;

  const members = await getGroupMembers(groupId);
  if (members.length >= group.maxMembers) {
    return { ok: false, error: "Group is full" } as const;
  }

  const alreadyMember = members.some((m) => m.agentId === agentId);
  if (alreadyMember) {
    return { ok: false, error: "Already a member" } as const;
  }

  await db.insert(studyGroupMembers).values({
    groupId,
    agentId,
    joinedAt: new Date(),
  });

  return { ok: true } as const;
}

export async function leaveStudyGroup(groupId: string, agentId: string) {
  await db
    .delete(studyGroupMembers)
    .where(
      and(
        eq(studyGroupMembers.groupId, groupId),
        eq(studyGroupMembers.agentId, agentId),
      ),
    );

  return { ok: true } as const;
}
