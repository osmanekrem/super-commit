import fs from "fs-extra";
import chalk from "chalk";
import { configManager } from "../core/config";
import { CommitValidator } from "../core/validator";

export interface ValidateOptions {
  message?: string;
  file?: string;
  silent?: boolean;
}

/**
 * Validate a commit message against conventional commits format
 */
export async function validateCommand(
  options: ValidateOptions
): Promise<boolean> {
  try {
    let commitMessage: string;

    // Get commit message from file or argument
    if (options.file) {
      if (!(await fs.pathExists(options.file))) {
        if (!options.silent) {
          console.error(chalk.red(`\n❌ File not found: ${options.file}\n`));
        }
        return false;
      }
      commitMessage = await fs.readFile(options.file, "utf-8");
    } else if (options.message) {
      commitMessage = options.message;
    } else {
      if (!options.silent) {
        console.error(
          chalk.red("\n❌ Please provide a message or file to validate\n")
        );
        console.error(
          chalk.gray("Usage: super-commit validate --message \"your message\"")
        );
        console.error(
          chalk.gray("   or: super-commit validate --file .git/COMMIT_EDITMSG\n")
        );
      }
      return false;
    }

    // Parse commit message
    const parsed = parseCommitMessage(commitMessage.trim());

    if (!parsed) {
      if (!options.silent) {
        displayValidationError(commitMessage);
      }
      return false;
    }

    // Load config and validate
    const config = await configManager.loadConfig();
    const validator = new CommitValidator(config);

    const errors = validator.validate(parsed);

    if (errors.length > 0) {
      if (!options.silent) {
        validator.displayErrors(errors);
      }
      return false;
    }

    // Success
    if (!options.silent) {
      console.log(chalk.green("\n✅ Commit message is valid!\n"));
    }
    return true;
  } catch (error) {
    if (!options.silent) {
      console.error(chalk.red("\n❌ Validation error:\n"));
      console.error(error instanceof Error ? error.message : "Unknown error");
    }
    return false;
  }
}

/**
 * Parse conventional commit message
 */
function parseCommitMessage(message: string) {
  // Split into header, body, footer
  const lines = message.split("\n");
  const header = lines[0];

  // Parse header: type(scope): subject
  const headerRegex = /^(\w+)(?:\(([^)]+)\))?: (.+)$/;
  const match = header.match(headerRegex);

  if (!match) {
    return null;
  }

  const [, type, scope, subject] = match;

  // Extract body (everything between header and footer)
  let body: string | undefined;
  let breaking = false;
  let breakingBody: string | undefined;
  let issues: string | undefined;

  if (lines.length > 1) {
    const restLines = lines.slice(1).join("\n").trim();

    // Check for BREAKING CHANGE
    const breakingMatch = restLines.match(
      /BREAKING CHANGE:\s*(.+?)(?=\n\n|$)/s
    );
    if (breakingMatch) {
      breaking = true;
      breakingBody = breakingMatch[1].trim();
    }

    // Check for issue references
    const issueMatch = restLines.match(
      /(close|closes|closed|fix|fixes|fixed|resolve|resolves|resolved|re|ref|refs)\s+#\d+/gi
    );
    if (issueMatch) {
      issues = issueMatch[0];
    }

    // Extract body (before BREAKING CHANGE or issues)
    const bodyText = restLines
      .replace(/BREAKING CHANGE:.+/s, "")
      .replace(
        /(close|closes|closed|fix|fixes|fixed|resolve|resolves|resolved|re|ref|refs)\s+#\d+/gi,
        ""
      )
      .trim();

    if (bodyText) {
      body = bodyText;
    }
  }

  return {
    type,
    scope,
    subject,
    body,
    breaking,
    breakingBody,
    issues,
  };
}

/**
 * Display validation error with helpful message
 */
function displayValidationError(message: string): void {
  console.error(chalk.red("\n❌ Invalid commit message format!\n"));
  console.error(chalk.gray("Your message:"));
  console.error(chalk.yellow(`  ${message.split("\n")[0]}\n`));
  console.error(
    chalk.white("Commit message must follow Conventional Commits format:")
  );
  console.error(chalk.cyan("  <type>(<scope>): <subject>\n"));
  console.error(chalk.white("Valid types:"));
  console.error(
    chalk.gray(
      "  feat, fix, docs, style, refactor, perf, test, build, ci, chore, revert\n"
    )
  );
  console.error(chalk.white("Examples:"));
  console.error(chalk.green('  feat: add user authentication'));
  console.error(chalk.green('  fix(api): resolve login endpoint error'));
  console.error(chalk.green('  docs: update README\n'));
  console.error(chalk.cyan("💡 Tip: Use 'super-commit' for interactive mode:"));
  console.error(chalk.gray("  npx super-commit\n"));
}

