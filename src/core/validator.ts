import { CommitData, SuperCommitConfig } from "../types/config";
import chalk from "chalk";

export interface ValidationError {
  field: string;
  message: string;
}

export class CommitValidator {
  private config: SuperCommitConfig;

  constructor(config: SuperCommitConfig) {
    this.config = config;
  }

  /**
   * Validate commit data against configuration rules
   */
  validate(data: CommitData): ValidationError[] {
    const errors: ValidationError[] = [];

    // Validate type
    if (this.config.validation.typeRequired && !data.type) {
      errors.push({
        field: "type",
        message: "Commit type is required",
      });
    }

    if (data.type) {
      const validTypes = this.config.types.map((t) => t.value);
      if (!validTypes.includes(data.type)) {
        errors.push({
          field: "type",
          message: `Invalid type "${
            data.type
          }". Valid types are: ${validTypes.join(", ")}`,
        });
      }
    }

    // Validate scope
    if (this.config.validation.scopeRequired && !data.scope) {
      errors.push({
        field: "scope",
        message: "Scope is required",
      });
    }

    if (
      data.scope &&
      this.config.scopes &&
      !this.config.validation.allowCustomScopes
    ) {
      const validScopes = this.config.scopes.map((s) => s.value);
      if (!validScopes.includes(data.scope)) {
        errors.push({
          field: "scope",
          message: `Invalid scope "${
            data.scope
          }". Valid scopes are: ${validScopes.join(", ")}`,
        });
      }
    }

    // Validate subject
    if (this.config.validation.subjectRequired && !data.subject) {
      errors.push({
        field: "subject",
        message: "Subject is required",
      });
    }

    if (data.subject) {
      const subjectLength = data.subject.length;

      if (subjectLength < this.config.validation.subjectMinLength) {
        errors.push({
          field: "subject",
          message: `Subject is too short. Minimum length is ${this.config.validation.subjectMinLength} characters`,
        });
      }

      if (subjectLength > this.config.validation.subjectMaxLength) {
        errors.push({
          field: "subject",
          message: `Subject is too long. Maximum length is ${this.config.validation.subjectMaxLength} characters (current: ${subjectLength})`,
        });
      }

      // Check if subject starts with uppercase (best practice)
      if (!/^[a-z]/.test(data.subject)) {
        errors.push({
          field: "subject",
          message: "Subject should start with a lowercase letter",
        });
      }

      // Check if subject ends with period (should not)
      if (data.subject.endsWith(".")) {
        errors.push({
          field: "subject",
          message: "Subject should not end with a period",
        });
      }
    }

    // Validate body
    if (
      !this.config.validation.allowEmptyBody &&
      !data.body &&
      !data.breaking
    ) {
      errors.push({
        field: "body",
        message: "Body is required",
      });
    }

    if (data.body) {
      const lines = data.body.split("\n");
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].length > this.config.validation.bodyMaxLineLength) {
          errors.push({
            field: "body",
            message: `Body line ${i + 1} is too long. Maximum length is ${
              this.config.validation.bodyMaxLineLength
            } characters`,
          });
        }
      }
    }

    // Validate breaking changes
    if (data.breaking && !data.breakingBody) {
      errors.push({
        field: "breakingBody",
        message: "Breaking changes must have a description",
      });
    }

    return errors;
  }

  /**
   * Display validation errors
   */
  displayErrors(errors: ValidationError[]): void {
    console.error(chalk.red.bold("\n❌ Validation Errors:\n"));
    errors.forEach((error) => {
      console.error(chalk.red(`  • ${error.field}: ${error.message}`));
    });
    console.error("");
  }

  /**
   * Check if commit data is valid
   */
  isValid(data: CommitData): boolean {
    return this.validate(data).length === 0;
  }
}
