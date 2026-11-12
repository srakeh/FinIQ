import { z } from "zod";

/**
 * Startup Submission Validation Schema
 */
export const StartupInputSchema = z.object({
  companyName: z
    .string()
    .trim()
    .min(2, "Company name must be at least 2 characters")
    .max(100, "Company name cannot exceed 100 characters"),
  industry: z
    .string()
    .trim()
    .min(2, "Industry must be at least 2 characters")
    .max(50, "Industry cannot exceed 50 characters"),
  stage: z
    .string()
    .trim()
    .min(2, "Stage must be at least 2 characters")
    .max(50, "Stage cannot exceed 50 characters"),
  description: z
    .string()
    .trim()
    .min(5, "Description must be at least 5 characters")
    .max(1500, "Description cannot exceed 1,500 characters"),
});

export type StartupInput = z.infer<typeof StartupInputSchema>;

/**
 * Chat Message Input Schema
 */
export const ChatMessageItemSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().max(10000, "Message history item exceeds maximum size"),
});

export const SendChatMessageSchema = z.object({
  message: z
    .string()
    .trim()
    .min(1, "Message cannot be empty")
    .max(2500, "Message cannot exceed 2,500 characters"),
  conversationHistory: z.array(ChatMessageItemSchema).max(50, "Conversation history limit exceeded"),
});

export type SendChatMessageInput = z.infer<typeof SendChatMessageSchema>;

/**
 * Investor Profile Schema
 */
export const InvestorProfileSchema = z.object({
  riskTolerance: z
    .string()
    .trim()
    .min(1, "Risk tolerance is required")
    .max(50, "Risk tolerance too long"),
  preferredStage: z
    .string()
    .trim()
    .min(1, "Preferred stage is required")
    .max(50, "Preferred stage too long"),
  checkSize: z
    .string()
    .trim()
    .min(1, "Typical check size is required")
    .max(50, "Check size too long"),
  targetMarket: z
    .string()
    .trim()
    .min(1, "Target market is required")
    .max(100, "Target market too long"),
  interests: z
    .array(z.string().trim().max(50))
    .max(20, "Maximum of 20 interest tags allowed"),
  bio: z
    .string()
    .max(1000, "Bio cannot exceed 1,000 characters")
    .optional()
    .default(""),
});

export type InvestorProfileInput = z.infer<typeof InvestorProfileSchema>;

/**
 * Quiz Submission Schema
 */
export const QuizSubmitSchema = z.object({
  topic: z
    .string()
    .trim()
    .min(1, "Quiz topic is required")
    .max(100, "Topic name too long"),
  score: z
    .number()
    .int("Score must be an integer")
    .min(0, "Score cannot be negative"),
  totalScore: z
    .number()
    .int("Total score must be an integer")
    .min(1, "Total score must be at least 1"),
}).refine((data) => data.score <= data.totalScore, {
  message: "Score cannot exceed total score",
  path: ["score"],
});

export type QuizSubmitInput = z.infer<typeof QuizSubmitSchema>;

/**
 * Document Record Persistence Schema
 */
export const DocumentRecordSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Document title is required")
    .max(255, "Document title cannot exceed 255 characters"),
  fileUrl: z
    .string()
    .trim()
    .min(1, "File URL or path is required")
    .max(1000, "File URL cannot exceed 1,000 characters"),
  documentType: z.string().trim().max(100).optional().nullable(),
  accountHolder: z.string().trim().max(150).optional().nullable(),
  netIncome: z.string().trim().max(100).optional().nullable(),
  taxDeductions: z.string().trim().max(100).optional().nullable(),
  portfolioValue: z.string().trim().max(100).optional().nullable(),
});

export type DocumentRecordInput = z.infer<typeof DocumentRecordSchema>;
