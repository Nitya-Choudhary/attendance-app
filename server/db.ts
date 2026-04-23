import { eq, and, gte, lte, like, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, attendance, assignments, submissions, feedback } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getUserById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// Attendance queries
export async function markAttendance(studentId: number, subject: string, status: "present" | "absent", date: Date) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const dateStr = date.toISOString().split('T')[0];
  
  // Check if attendance record exists
  const existing = await db.select().from(attendance)
    .where(and(
      eq(attendance.studentId, studentId),
      eq(attendance.subject, subject),
      eq(attendance.date, dateStr as any)
    )).limit(1);
  
  if (existing.length > 0) {
    // Update existing
    return await db.update(attendance)
      .set({ status, updatedAt: new Date() })
      .where(eq(attendance.id, existing[0].id));
  } else {
    // Insert new
    return await db.insert(attendance).values({
      studentId,
      subject,
      status,
      date: dateStr as any,
    });
  }
}

export async function getStudentAttendance(studentId: number, subject?: string) {
  const db = await getDb();
  if (!db) return [];
  
  const conditions = [eq(attendance.studentId, studentId)];
  if (subject) {
    conditions.push(eq(attendance.subject, subject));
  }
  
  return await db.select().from(attendance)
    .where(and(...conditions))
    .orderBy(desc(attendance.date));
}

export async function getAttendanceRecords(filters?: { studentId?: number; subject?: string; dateFrom?: Date; dateTo?: Date }) {
  const db = await getDb();
  if (!db) return [];
  
  const conditions = [];
  if (filters?.studentId) conditions.push(eq(attendance.studentId, filters.studentId));
  if (filters?.subject) conditions.push(eq(attendance.subject, filters.subject));
  if (filters?.dateFrom) {
    const dateStr = filters.dateFrom.toISOString().split('T')[0];
    conditions.push(gte(attendance.date, dateStr as any));
  }
  if (filters?.dateTo) {
    const dateStr = filters.dateTo.toISOString().split('T')[0];
    conditions.push(lte(attendance.date, dateStr as any));
  }
  
  return await db.select().from(attendance)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(desc(attendance.date));
}

export async function calculateAttendancePercentage(studentId: number, subject?: string) {
  const db = await getDb();
  if (!db) return 0;
  
  const records = await getStudentAttendance(studentId, subject);
  if (records.length === 0) return 0;
  
  const presentCount = records.filter(r => r.status === 'present').length;
  return Math.round((presentCount / records.length) * 100);
}

// Assignment queries
export async function createAssignment(teacherId: number, title: string, description: string, subject: string, deadline: Date) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.insert(assignments).values({
    teacherId,
    title,
    description,
    subject,
    deadline,
  });
}

export async function getAssignments(filters?: { teacherId?: number; subject?: string; search?: string }) {
  const db = await getDb();
  if (!db) return [];
  
  const conditions = [];
  if (filters?.teacherId) conditions.push(eq(assignments.teacherId, filters.teacherId));
  if (filters?.subject) conditions.push(eq(assignments.subject, filters.subject));
  if (filters?.search) conditions.push(like(assignments.title, `%${filters.search}%`));
  
  return await db.select().from(assignments)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(desc(assignments.deadline));
}

export async function getAssignmentById(id: number) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db.select().from(assignments).where(eq(assignments.id, id)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function updateAssignment(id: number, updates: Partial<typeof assignments.$inferInsert>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.update(assignments)
    .set({ ...updates, updatedAt: new Date() })
    .where(eq(assignments.id, id));
}

export async function deleteAssignment(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.delete(assignments).where(eq(assignments.id, id));
}

// Submission queries
export async function submitAssignment(assignmentId: number, studentId: number, submissionText?: string, fileUrl?: string, fileKey?: string, fileName?: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.insert(submissions).values({
    assignmentId,
    studentId,
    submissionText,
    fileUrl,
    fileKey,
    fileName,
  });
}

export async function getSubmissions(filters?: { assignmentId?: number; studentId?: number; status?: string }) {
  const db = await getDb();
  if (!db) return [];
  
  const conditions = [];
  if (filters?.assignmentId) conditions.push(eq(submissions.assignmentId, filters.assignmentId));
  if (filters?.studentId) conditions.push(eq(submissions.studentId, filters.studentId));
  if (filters?.status) conditions.push(eq(submissions.status, filters.status as any));
  
  return await db.select().from(submissions)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(desc(submissions.submittedAt));
}

export async function getSubmissionById(id: number) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db.select().from(submissions).where(eq(submissions.id, id)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function updateSubmission(id: number, updates: Partial<typeof submissions.$inferInsert>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.update(submissions)
    .set({ ...updates, updatedAt: new Date() })
    .where(eq(submissions.id, id));
}

export async function getStudentSubmission(assignmentId: number, studentId: number) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db.select().from(submissions)
    .where(and(
      eq(submissions.assignmentId, assignmentId),
      eq(submissions.studentId, studentId)
    ))
    .limit(1);
  
  return result.length > 0 ? result[0] : null;
}

// Feedback queries
export async function submitFeedback(studentId: number, subject: string, message: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.insert(feedback).values({
    studentId,
    subject,
    message,
  });
}

export async function getFeedback(filters?: { studentId?: number; status?: string; search?: string }) {
  const db = await getDb();
  if (!db) return [];
  
  const conditions = [];
  if (filters?.studentId) conditions.push(eq(feedback.studentId, filters.studentId));
  if (filters?.status) conditions.push(eq(feedback.status, filters.status as any));
  if (filters?.search) conditions.push(like(feedback.message, `%${filters.search}%`));
  
  return await db.select().from(feedback)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(desc(feedback.createdAt));
}

export async function getFeedbackById(id: number) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db.select().from(feedback).where(eq(feedback.id, id)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function replyToFeedback(id: number, reply: string, repliedBy: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.update(feedback)
    .set({ 
      reply, 
      repliedBy, 
      status: 'replied',
      updatedAt: new Date() 
    })
    .where(eq(feedback.id, id));
}
