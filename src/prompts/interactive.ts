import inquirer from "inquirer";
import chalk from "chalk";
import { CommitData, SuperCommitConfig } from "../types/config";

export class InteractivePrompts {
  private config: SuperCommitConfig;

  constructor(config: SuperCommitConfig) {
    this.config = config;
  }

  /**
   * Run interactive prompts to gather commit information
   */
  async prompt(): Promise<CommitData> {
    console.log(chalk.blue.bold("\n📝 Super Commit - Interactive Mode\n"));

    // Prompt for commit type
    const typeAnswer = await this.promptType();

    // Prompt for scope
    const scopeAnswer = await this.promptScope();

    // Prompt for subject
    const subjectAnswer = await this.promptSubject();

    // Prompt for body
    const bodyAnswer = await this.promptBody();

    // Prompt for breaking changes
    const breakingAnswer = await this.promptBreaking();

    // Prompt for issue references
    const issuesAnswer = await this.promptIssues();

    return {
      type: typeAnswer.type,
      scope: scopeAnswer.scope,
      subject: subjectAnswer.subject,
      body: bodyAnswer.body || undefined,
      breaking: breakingAnswer.breaking,
      breakingBody: breakingAnswer.breakingBody,
      issues: issuesAnswer.issues || undefined,
    };
  }

  /**
   * Prompt for commit type
   */
  private async promptType(): Promise<{ type: string }> {
    const choices = this.config.types.map((type) => {
      const emoji =
        this.config.format.useEmoji && type.emoji ? `${type.emoji} ` : "";
      return {
        name: `${emoji}${type.name}`,
        value: type.value,
        short: type.value,
      };
    });

    return inquirer.prompt([
      {
        type: "list",
        name: "type",
        message: this.config.promptMessages.type,
        choices,
        pageSize: 15,
      },
    ]);
  }

  /**
   * Prompt for scope
   */
  private async promptScope(): Promise<{ scope?: string }> {
    const choices: Array<{ name: string; value: string | null }> = [];

    // Add none option
    choices.push({
      name:
        this.config.language === "tr" ? "Yok (scope yok)" : "None (no scope)",
      value: null,
    });

    // Add predefined scopes
    if (this.config.scopes && this.config.scopes.length > 0) {
      this.config.scopes.forEach((scope) => {
        choices.push({
          name: scope.name,
          value: scope.value,
        });
      });
    }

    // Add custom scope option if allowed
    if (this.config.validation.allowCustomScopes) {
      choices.push({
        name:
          this.config.language === "tr"
            ? "[ Özel scope gir ]"
            : "[ Enter custom scope ]",
        value: "custom",
      });
    }

    const answer = await inquirer.prompt([
      {
        type: "list",
        name: "scope",
        message: this.config.promptMessages.scope,
        choices,
        when: !this.config.validation.scopeRequired || choices.length > 1,
      },
    ]);

    // If custom scope was selected, prompt for it
    if (answer.scope === "custom") {
      const customAnswer = await inquirer.prompt([
        {
          type: "input",
          name: "customScope",
          message: this.config.promptMessages.customScope,
          validate: (input: string) => {
            if (!input.trim()) {
              return this.config.language === "tr"
                ? "Scope boş olamaz"
                : "Scope cannot be empty";
            }
            if (!/^[a-z0-9-]+$/.test(input)) {
              return this.config.language === "tr"
                ? "Scope sadece küçük harf, rakam ve tire içerebilir"
                : "Scope can only contain lowercase letters, numbers, and hyphens";
            }
            return true;
          },
        },
      ]);
      return { scope: customAnswer.customScope };
    }

    return { scope: answer.scope || undefined };
  }

  /**
   * Prompt for subject
   */
  private async promptSubject(): Promise<{ subject: string }> {
    return inquirer.prompt([
      {
        type: "input",
        name: "subject",
        message: this.config.promptMessages.subject,
        validate: (input: string) => {
          const trimmed = input.trim();

          if (!trimmed) {
            return this.config.language === "tr"
              ? "Açıklama zorunludur"
              : "Subject is required";
          }

          if (trimmed.length < this.config.validation.subjectMinLength) {
            return this.config.language === "tr"
              ? `Açıklama en az ${this.config.validation.subjectMinLength} karakter olmalıdır`
              : `Subject must be at least ${this.config.validation.subjectMinLength} characters`;
          }

          if (trimmed.length > this.config.validation.subjectMaxLength) {
            return this.config.language === "tr"
              ? `Açıklama en fazla ${this.config.validation.subjectMaxLength} karakter olabilir (şu an: ${trimmed.length})`
              : `Subject must be at most ${this.config.validation.subjectMaxLength} characters (current: ${trimmed.length})`;
          }

          if (trimmed.endsWith(".")) {
            return this.config.language === "tr"
              ? "Açıklama nokta ile bitmemelidir"
              : "Subject should not end with a period";
          }

          return true;
        },
      },
    ]);
  }

  /**
   * Prompt for body
   */
  private async promptBody(): Promise<{ body?: string }> {
    // First ask if user wants to add a body
    const { wantBody } = await inquirer.prompt([
      {
        type: "confirm",
        name: "wantBody",
        message:
          this.config.language === "tr"
            ? "Detaylı bir açıklama eklemek ister misiniz?"
            : "Do you want to add a longer description?",
        default: false,
        when: this.config.validation.allowEmptyBody,
      },
    ]);

    // If body is required or user wants to add it, open editor
    if (!this.config.validation.allowEmptyBody || wantBody) {
      const answer = await inquirer.prompt([
        {
          type: "editor",
          name: "body",
          message: this.config.promptMessages.body,
        },
      ]);

      return { body: answer.body?.trim() };
    }

    return { body: undefined };
  }

  /**
   * Prompt for breaking changes
   */
  private async promptBreaking(): Promise<{
    breaking: boolean;
    breakingBody?: string;
  }> {
    const { breaking } = await inquirer.prompt([
      {
        type: "confirm",
        name: "breaking",
        message: this.config.promptMessages.breaking,
        default: false,
      },
    ]);

    if (!breaking) {
      return { breaking: false };
    }

    const { breakingBody } = await inquirer.prompt([
      {
        type: "input",
        name: "breakingBody",
        message: this.config.promptMessages.breakingBody,
        validate: (input: string) => {
          if (!input.trim()) {
            return this.config.language === "tr"
              ? "Breaking change açıklaması zorunludur"
              : "Breaking change description is required";
          }
          return true;
        },
      },
    ]);

    return { breaking: true, breakingBody };
  }

  /**
   * Prompt for issue references
   */
  private async promptIssues(): Promise<{ issues?: string }> {
    return inquirer.prompt([
      {
        type: "input",
        name: "issues",
        message: this.config.promptMessages.issues,
      },
    ]);
  }

  /**
   * Show preview and ask for confirmation
   */
  async confirmCommit(formattedMessage: string): Promise<boolean> {
    console.log(chalk.cyan.bold("\n📋 Commit Message Preview:\n"));
    console.log(chalk.gray("─".repeat(60)));
    console.log(formattedMessage);
    console.log(chalk.gray("─".repeat(60)));

    const { confirm } = await inquirer.prompt([
      {
        type: "confirm",
        name: "confirm",
        message:
          this.config.language === "tr"
            ? "Bu commit mesajı ile devam edilsin mi?"
            : "Proceed with this commit message?",
        default: true,
      },
    ]);

    return confirm;
  }
}
