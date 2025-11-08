import { z } from "zod";

// Commit type configuration
export const CommitTypeSchema = z.object({
  value: z.string(),
  name: z.string(),
  description: z.string().optional(),
  emoji: z.string().optional(),
});

export type CommitType = z.infer<typeof CommitTypeSchema>;

// Scope configuration
export const ScopeSchema = z.object({
  value: z.string(),
  name: z.string(),
  description: z.string().optional(),
});

export type Scope = z.infer<typeof ScopeSchema>;

// Validation rules
export const ValidationRulesSchema = z.object({
  subjectMaxLength: z.number().default(72),
  subjectMinLength: z.number().default(1),
  bodyMaxLineLength: z.number().default(100),
  typeRequired: z.boolean().default(true),
  scopeRequired: z.boolean().default(false),
  subjectRequired: z.boolean().default(true),
  allowCustomScopes: z.boolean().default(true),
  allowEmptyBody: z.boolean().default(true),
});

export type ValidationRules = z.infer<typeof ValidationRulesSchema>;

// Prompt messages configuration
export const PromptMessagesSchema = z.object({
  type: z.string().default("Select the type of change that you're committing:"),
  scope: z.string().default("Denote the SCOPE of this change (optional):"),
  customScope: z.string().default("Enter a custom scope:"),
  subject: z
    .string()
    .default("Write a SHORT, IMPERATIVE tense description of the change:"),
  body: z
    .string()
    .default("Provide a LONGER description of the change (optional):"),
  breaking: z.string().default("Are there any breaking changes?"),
  breakingBody: z.string().default("Describe the breaking changes:"),
  issues: z
    .string()
    .default('Add issue references (e.g. "fix #123", "re #456"):'),
});

export type PromptMessages = z.infer<typeof PromptMessagesSchema>;

// Format template configuration
export const FormatTemplateSchema = z.object({
  useEmoji: z.boolean().default(false),
  emojiPosition: z
    .enum(["before-type", "after-type", "after-subject"])
    .default("before-type"),
  separator: z.string().default(":"),
  lineBreaksBetweenSections: z.number().default(1),
});

export type FormatTemplate = z.infer<typeof FormatTemplateSchema>;

// Language support
export const LanguageSchema = z.enum(["en", "tr"]).default("en");

export type Language = z.infer<typeof LanguageSchema>;

// Main configuration
export const SuperCommitConfigSchema = z.object({
  types: z.array(CommitTypeSchema),
  scopes: z.array(ScopeSchema).optional(),
  validation: ValidationRulesSchema.default({}),
  promptMessages: PromptMessagesSchema.default({}),
  format: FormatTemplateSchema.default({}),
  language: LanguageSchema,
});

export type SuperCommitConfig = z.infer<typeof SuperCommitConfigSchema>;

// CLI options for commit command
export interface CommitOptions {
  type?: string;
  scope?: string;
  message?: string;
  body?: string;
  breaking?: boolean;
  issues?: string;
}

// Commit data structure
export interface CommitData {
  type: string;
  scope?: string;
  subject: string;
  body?: string;
  breaking?: boolean;
  breakingBody?: string;
  issues?: string;
}
