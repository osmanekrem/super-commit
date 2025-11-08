import { CommitData, SuperCommitConfig } from "../types/config";

export class CommitFormatter {
  private config: SuperCommitConfig;

  constructor(config: SuperCommitConfig) {
    this.config = config;
  }

  /**
   * Format commit data into a conventional commit message
   */
  format(data: CommitData): string {
    const parts: string[] = [];

    // Build the header (type, scope, subject)
    const header = this.formatHeader(data);
    parts.push(header);

    // Add line breaks based on config
    const lineBreaks = "\n".repeat(
      this.config.format.lineBreaksBetweenSections
    );

    // Add body if present
    if (data.body) {
      parts.push(lineBreaks + data.body);
    }

    // Add breaking change section
    if (data.breaking && data.breakingBody) {
      parts.push(lineBreaks + this.formatBreakingChange(data.breakingBody));
    }

    // Add issue references
    if (data.issues) {
      parts.push(lineBreaks + this.formatIssues(data.issues));
    }

    return parts.join("");
  }

  /**
   * Format the commit header (first line)
   */
  private formatHeader(data: CommitData): string {
    const { type, scope, subject } = data;
    const typeConfig = this.config.types.find((t) => t.value === type);
    const emoji = typeConfig?.emoji || "";

    let header = "";

    // Add emoji if enabled
    if (this.config.format.useEmoji && emoji) {
      if (this.config.format.emojiPosition === "before-type") {
        header = `${emoji} `;
      }
    }

    // Add type
    header += type;

    // Add emoji after type if configured
    if (
      this.config.format.useEmoji &&
      emoji &&
      this.config.format.emojiPosition === "after-type"
    ) {
      header += ` ${emoji}`;
    }

    // Add scope if present
    if (scope) {
      header += `(${scope})`;
    }

    // Add separator
    header += this.config.format.separator;

    // Add space before subject
    header += " ";

    // Add subject
    header += subject;

    // Add emoji after subject if configured
    if (
      this.config.format.useEmoji &&
      emoji &&
      this.config.format.emojiPosition === "after-subject"
    ) {
      header += ` ${emoji}`;
    }

    return header;
  }

  /**
   * Format breaking change section
   */
  private formatBreakingChange(breakingBody: string): string {
    return `BREAKING CHANGE: ${breakingBody}`;
  }

  /**
   * Format issue references
   */
  private formatIssues(issues: string): string {
    // Clean up and format issue references
    const cleanedIssues = issues.trim();

    // If already properly formatted, return as is
    if (
      cleanedIssues.match(
        /^(close|closes|closed|fix|fixes|fixed|resolve|resolves|resolved|re|ref|refs)\s+#\d+/i
      )
    ) {
      return cleanedIssues;
    }

    // Otherwise, just return as provided
    return cleanedIssues;
  }

  /**
   * Preview formatted commit message with colors
   */
  previewFormat(data: CommitData): string {
    return this.format(data);
  }
}
