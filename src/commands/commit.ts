import chalk from 'chalk';
import { CommitOptions, CommitData } from '../types/config';
import { configManager } from '../core/config';
import { gitOperations } from '../core/git';
import { CommitFormatter } from '../core/formatter';
import { CommitValidator } from '../core/validator';
import { InteractivePrompts } from '../prompts/interactive';

export async function commitCommand(options: CommitOptions): Promise<void> {
  try {
    // Validate git environment
    const validation = await gitOperations.validateEnvironment();
    if (!validation.valid) {
      console.error(chalk.red(`\n❌ ${validation.message}\n`));
      process.exit(1);
    }

    // Display staged changes
    await gitOperations.displayStagedChanges();

    // Load configuration
    const config = await configManager.loadConfig();

    // Determine if we're in interactive mode or flag mode
    const isInteractiveMode = !options.type && !options.message;

    let commitData: CommitData;

    if (isInteractiveMode) {
      // Interactive mode
      const prompts = new InteractivePrompts(config);
      commitData = await prompts.prompt();
    } else {
      // Flag mode
      commitData = buildCommitDataFromFlags(options);
    }

    // Validate commit data
    const validator = new CommitValidator(config);
    const errors = validator.validate(commitData);

    if (errors.length > 0) {
      validator.displayErrors(errors);
      process.exit(1);
    }

    // Format commit message
    const formatter = new CommitFormatter(config);
    const commitMessage = formatter.format(commitData);

    // Show preview and ask for confirmation in interactive mode
    if (isInteractiveMode) {
      const prompts = new InteractivePrompts(config);
      const confirmed = await prompts.confirmCommit(commitMessage);

      if (!confirmed) {
        console.log(chalk.yellow('\n❌ Commit cancelled.\n'));
        process.exit(0);
      }
    } else {
      // Show preview in flag mode
      console.log(chalk.cyan.bold('\n📋 Commit Message:\n'));
      console.log(chalk.gray('─'.repeat(60)));
      console.log(commitMessage);
      console.log(chalk.gray('─'.repeat(60)));
    }

    // Create the commit
    await gitOperations.commit(commitMessage);

    console.log(chalk.green.bold('\n✅ Commit created successfully!\n'));

    // Show some helpful next steps
    const branch = await gitOperations.getCurrentBranch();
    console.log(chalk.gray(`Branch: ${branch}`));
    console.log(chalk.gray(`To push: git push origin ${branch}\n`));

  } catch (error) {
    console.error(chalk.red('\n❌ Error creating commit:\n'));
    console.error(error instanceof Error ? error.message : 'Unknown error');
    process.exit(1);
  }
}

/**
 * Build commit data from CLI flags
 */
function buildCommitDataFromFlags(options: CommitOptions): CommitData {
  if (!options.type || !options.message) {
    console.error(chalk.red('\n❌ When using flags, both --type and --message are required.\n'));
    console.error(chalk.gray('Example: super-commit --type feat --message "add new feature"\n'));
    process.exit(1);
  }

  return {
    type: options.type,
    scope: options.scope,
    subject: options.message,
    body: options.body,
    breaking: options.breaking || false,
    breakingBody: options.breaking ? options.body : undefined,
    issues: options.issues,
  };
}

