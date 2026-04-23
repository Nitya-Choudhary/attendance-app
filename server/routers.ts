import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import { TRPCError } from "@trpc/server";
import { storagePut } from "./storage";

// Helper to ensure user is teacher/admin
const teacherProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== 'admin') {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'Only teachers can perform this action' });
  }
  return next({ ctx });
});

export const appRouter = router({
  system: systemRouter,
  
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Attendance endpoints
  attendance: router({
    markAttendance: teacherProcedure
      .input(z.object({
        studentId: z.number(),
        subject: z.string(),
        status: z.enum(['present', 'absent']),
        date: z.string(),
      }))
      .mutation(async ({ input, ctx }) => {
        const window = await db.getActiveAttendanceWindow(ctx.user.id);
        if (!window) {
          throw new TRPCError({ 
            code: 'FORBIDDEN', 
            message: 'Attendance marking window is not active. Please enable it first.' 
          });
        }
        
        const date = new Date(input.date);
        return await db.markAttendance(input.studentId, input.subject, input.status, date);
      }),

    getStudentAttendance: protectedProcedure
      .input(z.object({
        studentId: z.number(),
        subject: z.string().optional(),
      }))
      .query(async ({ input }) => {
        return await db.getStudentAttendance(input.studentId, input.subject);
      }),

    getAttendanceRecords: teacherProcedure
      .input(z.object({
        studentId: z.number().optional(),
        subject: z.string().optional(),
        dateFrom: z.string().optional(),
        dateTo: z.string().optional(),
      }))
      .query(async ({ input }) => {
        const filters: any = {};
        if (input.studentId) filters.studentId = input.studentId;
        if (input.subject) filters.subject = input.subject;
        if (input.dateFrom) filters.dateFrom = new Date(input.dateFrom);
        if (input.dateTo) filters.dateTo = new Date(input.dateTo);
        
        return await db.getAttendanceRecords(filters);
      }),

    calculatePercentage: protectedProcedure
      .input(z.object({
        studentId: z.number(),
        subject: z.string().optional(),
      }))
      .query(async ({ input }) => {
        return await db.calculateAttendancePercentage(input.studentId, input.subject);
      }),

    exportCSV: teacherProcedure
      .input(z.object({
        subject: z.string().optional(),
        dateFrom: z.string().optional(),
        dateTo: z.string().optional(),
      }))
      .query(async ({ input }) => {
        const filters: any = {};
        if (input.subject) filters.subject = input.subject;
        if (input.dateFrom) filters.dateFrom = new Date(input.dateFrom);
        if (input.dateTo) filters.dateTo = new Date(input.dateTo);
        
        const records = await db.getAttendanceRecords(filters);
        
        // Generate CSV content
        let csv = 'Student ID,Subject,Date,Status\n';
        records.forEach(record => {
          csv += `${record.studentId},${record.subject},${record.date},${record.status}\n`;
        });
        
        return csv;
      }),

    enableWindow: teacherProcedure
      .mutation(async ({ ctx }) => {
        await db.disableAttendanceWindow(ctx.user.id);
        return await db.enableAttendanceWindow(ctx.user.id);
      }),

    disableWindow: teacherProcedure
      .mutation(async ({ ctx }) => {
        return await db.disableAttendanceWindow(ctx.user.id);
      }),

    getWindowStatus: teacherProcedure
      .query(async ({ ctx }) => {
        const window = await db.getAttendanceWindowStatus(ctx.user.id);
        if (!window) return null;
        
        const now = new Date();
        const timeRemaining = Math.max(0, window.endTime.getTime() - now.getTime());
        
        return {
          isActive: window.isActive,
          startTime: window.startTime,
          endTime: window.endTime,
          timeRemaining,
          timeRemainingSeconds: Math.ceil(timeRemaining / 1000),
        };
      }),
  }),

  // Assignment endpoints
  assignments: router({
    create: teacherProcedure
      .input(z.object({
        title: z.string(),
        description: z.string(),
        subject: z.string(),
        deadline: z.string(),
      }))
      .mutation(async ({ input, ctx }) => {
        return await db.createAssignment(
          ctx.user.id,
          input.title,
          input.description,
          input.subject,
          new Date(input.deadline)
        );
      }),

    list: protectedProcedure
      .input(z.object({
        subject: z.string().optional(),
        search: z.string().optional(),
      }))
      .query(async ({ input, ctx }) => {
        if (ctx.user.role === 'admin') {
          // Teachers see their own assignments
          return await db.getAssignments({
            teacherId: ctx.user.id,
            subject: input.subject,
            search: input.search,
          });
        } else {
          // Students see all assignments
          return await db.getAssignments({
            subject: input.subject,
            search: input.search,
          });
        }
      }),

    getById: protectedProcedure
      .input(z.number())
      .query(async ({ input }) => {
        return await db.getAssignmentById(input);
      }),

    update: teacherProcedure
      .input(z.object({
        id: z.number(),
        title: z.string().optional(),
        description: z.string().optional(),
        subject: z.string().optional(),
        deadline: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const updates: any = {};
        if (input.title) updates.title = input.title;
        if (input.description) updates.description = input.description;
        if (input.subject) updates.subject = input.subject;
        if (input.deadline) updates.deadline = new Date(input.deadline);
        
        return await db.updateAssignment(input.id, updates);
      }),

    delete: teacherProcedure
      .input(z.number())
      .mutation(async ({ input }) => {
        return await db.deleteAssignment(input);
      }),
  }),

  // Submission endpoints
  submissions: router({
    submit: protectedProcedure
      .input(z.object({
        assignmentId: z.number(),
        submissionText: z.string().optional(),
        file: z.object({
          data: z.string(),
          name: z.string(),
          type: z.string(),
        }).optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        let fileUrl: string | undefined;
        let fileKey: string | undefined;
        let fileName: string | undefined;

        if (input.file) {
          const buffer = Buffer.from(input.file.data, 'base64');
          const fileKeyStr = `submissions/${ctx.user.id}/${Date.now()}-${input.file.name}`;
          
          const result = await storagePut(fileKeyStr, buffer, input.file.type);
          fileUrl = result.url;
          fileKey = result.key;
          fileName = input.file.name;
        }

        return await db.submitAssignment(
          input.assignmentId,
          ctx.user.id,
          input.submissionText,
          fileUrl,
          fileKey,
          fileName
        );
      }),

    list: protectedProcedure
      .input(z.object({
        assignmentId: z.number().optional(),
        studentId: z.number().optional(),
        status: z.string().optional(),
      }))
      .query(async ({ input, ctx }) => {
        const filters: any = {};
        if (input.assignmentId) filters.assignmentId = input.assignmentId;
        if (input.studentId) filters.studentId = input.studentId;
        if (input.status) filters.status = input.status;
        
        return await db.getSubmissions(filters);
      }),

    getById: protectedProcedure
      .input(z.number())
      .query(async ({ input }) => {
        return await db.getSubmissionById(input);
      }),

    updateGrade: teacherProcedure
      .input(z.object({
        id: z.number(),
        grade: z.string(),
        feedback: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        return await db.updateSubmission(input.id, {
          grade: input.grade,
          feedback: input.feedback,
          status: 'graded',
        });
      }),

    getStudentSubmission: protectedProcedure
      .input(z.object({
        assignmentId: z.number(),
      }))
      .query(async ({ input, ctx }) => {
        return await db.getStudentSubmission(input.assignmentId, ctx.user.id);
      }),
  }),

  // Feedback endpoints
  feedback: router({
    submit: protectedProcedure
      .input(z.object({
        subject: z.string(),
        message: z.string(),
      }))
      .mutation(async ({ input, ctx }) => {
        return await db.submitFeedback(ctx.user.id, input.subject, input.message);
      }),

    list: protectedProcedure
      .input(z.object({
        studentId: z.number().optional(),
        status: z.string().optional(),
        search: z.string().optional(),
      }))
      .query(async ({ input, ctx }) => {
        if (ctx.user.role === 'user') {
          // Students see only their own feedback
          return await db.getFeedback({
            studentId: ctx.user.id,
            status: input.status,
            search: input.search,
          });
        } else {
          // Teachers see all feedback
          return await db.getFeedback({
            studentId: input.studentId,
            status: input.status,
            search: input.search,
          });
        }
      }),

    getById: protectedProcedure
      .input(z.number())
      .query(async ({ input }) => {
        return await db.getFeedbackById(input);
      }),

    reply: teacherProcedure
      .input(z.object({
        id: z.number(),
        reply: z.string(),
      }))
      .mutation(async ({ input, ctx }) => {
        return await db.replyToFeedback(input.id, input.reply, ctx.user.id);
      }),
  }),

  // Dashboard endpoints
  dashboard: router({
    getTeacherSummary: teacherProcedure.query(async ({ ctx }) => {
      const assignments = await db.getAssignments({ teacherId: ctx.user.id });
      const pendingFeedback = await db.getFeedback({ status: 'pending' });
      
      return {
        totalAssignments: assignments.length,
        pendingFeedback: pendingFeedback.length,
        recentAssignments: assignments.slice(0, 5),
      };
    }),

    getStudentSummary: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== 'user') {
        throw new TRPCError({ code: 'FORBIDDEN' });
      }

      const assignments = await db.getAssignments();
      const submissions = await db.getSubmissions({ studentId: ctx.user.id });
      const feedback = await db.getFeedback({ studentId: ctx.user.id });
      
      const submittedAssignmentIds = new Set(submissions.map(s => s.assignmentId));
      const pendingAssignments = assignments.filter(a => !submittedAssignmentIds.has(a.id));
      
      return {
        pendingAssignments: pendingAssignments.length,
        submittedAssignments: submissions.length,
        feedbackCount: feedback.length,
        recentFeedback: feedback.slice(0, 5),
      };
    }),
  }),
});

export type AppRouter = typeof appRouter;
