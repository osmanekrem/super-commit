#!/usr/bin/env node

import { Command } from "commander";
import chalk from "chalk";
import { commitCommand } from "./commands/commit";
import { initCommand } from "./commands/init";
import { huskyCommand } from "./commands/husky";
import { validateCommand } from "./commands/validate";
import { CommitOptions } from "./types/config";

const program = new Command();

// Package info
const packageJson = require("../package.json");

program
  .name("super-commit")
  .description(
    "A powerful conventional commit CLI tool with full customization"
  )
  .version(packageJson.version);

// Commit command (default)
program
  .command("commit", { isDefault: true })
  .description("Create a conventional commit")
  .argument(
    "[message]",
    "Commit message (optional, triggers interactive mode if not provided)"
  )
  .option("-t, --type <type>", "Commit type (feat, fix, docs, etc.)")
  .option("-s, --scope <scope>", "Commit scope")
  .option("-m, --message <message>", "Commit message (short description)")
  .option("-b, --body <body>", "Commit body (longer description)")
  .option("--breaking", "Mark as breaking change")
  .option("-i, --issues <issues>", 'Issue references (e.g., "fix #123")')
  .action(async (messageArg, options) => {
    // If a message argument is provided without --message flag, use it as the message
    const commitOptions: CommitOptions = {
      type: options.type,
      scope: options.scope,
      message: options.message || messageArg,
      body: options.body,
      breaking: options.breaking,
      issues: options.issues,
    };

    await commitCommand(commitOptions);
  });

// Init command
program
  .command("init")
  .description("Initialize Super Commit configuration")
  .action(async () => {
    await initCommand();
  });

// Husky command
program
  .command("husky")
  .description("Setup Husky integration for automatic conventional commits")
  .action(async () => {
    await huskyCommand();
  });

// Validate command
program
  .command("validate")
  .description("Validate a commit message against conventional commits format")
  .option("-m, --message <message>", "Commit message to validate")
  .option("-f, --file <file>", "File containing commit message")
  .option("-s, --silent", "Silent mode (no output, only exit code)")
  .action(async function (this: any) {
    const opts = this.opts();
    const isValid = await validateCommand({
      message: opts.message,
      file: opts.file,
      silent: opts.silent,
    });
    process.exit(isValid ? 0 : 1);
  });

// Help customization
program.on("--help", () => {
  console.log("");
  console.log(chalk.cyan.bold("Examples:"));
  console.log("");
  console.log("  # Interactive mode (recommended)");
  console.log(chalk.gray("  $ npx super-commit"));
  console.log("");
  console.log("  # Using CLI flags");
  console.log(
    chalk.gray(
      '  $ npx super-commit --type feat --message "add user authentication"'
    )
  );
  console.log(
    chalk.gray(
      '  $ npx super-commit -t fix -s api -m "fix login endpoint" -b "Updated validation logic"'
    )
  );
  console.log("");
  console.log("  # Initialize configuration");
  console.log(chalk.gray("  $ npx super-commit init"));
  console.log("");
  console.log("  # Setup Husky integration");
  console.log(chalk.gray("  $ npx super-commit husky"));
  console.log("");
  console.log("  # Validate commit message");
  console.log(
    chalk.gray('  $ npx super-commit validate --message "feat: add feature"')
  );
  console.log(
    chalk.gray("  $ npx super-commit validate --file .git/COMMIT_EDITMSG")
  );
  console.log("");
  console.log(chalk.cyan.bold("Configuration:"));
  console.log("");
  console.log(
    "  Create a .supercommitrc.json file in your project root to customize"
  );
  console.log("  commit types, scopes, validation rules, and more.");
  console.log("");
  console.log('  Run "npx super-commit init" for an interactive setup.');
  console.log("");
});

// Parse arguments
program.parse(process.argv);
