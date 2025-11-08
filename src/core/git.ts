import simpleGit, { SimpleGit, StatusResult } from "simple-git";
import chalk from "chalk";

export class GitOperations {
  private git: SimpleGit;

  constructor() {
    this.git = simpleGit();
  }

  /**
   * Check if current directory is a git repository
   */
  async isGitRepository(): Promise<boolean> {
    try {
      await this.git.status();
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get current git status
   */
  async getStatus(): Promise<StatusResult> {
    return await this.git.status();
  }

  /**
   * Check if there are staged changes
   */
  async hasStagedChanges(): Promise<boolean> {
    const status = await this.getStatus();
    return status.staged.length > 0;
  }

  /**
   * Get list of staged files
   */
  async getStagedFiles(): Promise<string[]> {
    const status = await this.getStatus();
    return status.staged;
  }

  /**
   * Create a commit with the given message
   */
  async commit(message: string): Promise<void> {
    try {
      await this.git.commit(message);
    } catch (error) {
      throw new Error(
        `Failed to create commit: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * Stage all changes
   */
  async stageAll(): Promise<void> {
    await this.git.add(".");
  }

  /**
   * Stage specific files
   */
  async stageFiles(files: string[]): Promise<void> {
    await this.git.add(files);
  }

  /**
   * Get current branch name
   */
  async getCurrentBranch(): Promise<string> {
    const status = await this.getStatus();
    return status.current || "unknown";
  }

  /**
   * Display staged changes summary
   */
  async displayStagedChanges(): Promise<void> {
    const status = await this.getStatus();

    if (status.staged.length === 0) {
      console.log(chalk.yellow("\n⚠️  No staged changes found."));
      console.log(
        chalk.gray('Tip: Use "git add" to stage your changes first.\n')
      );
      return;
    }

    console.log(chalk.cyan.bold("\n📝 Staged Changes:\n"));

    status.staged.forEach((file) => {
      console.log(chalk.green(`  ✓ ${file}`));
    });

    console.log("");
  }

  /**
   * Validate git environment before commit
   */
  async validateEnvironment(): Promise<{ valid: boolean; message?: string }> {
    // Check if it's a git repository
    const isRepo = await this.isGitRepository();
    if (!isRepo) {
      return {
        valid: false,
        message: 'Not a git repository. Please run "git init" first.',
      };
    }

    // Check if there are staged changes
    const hasChanges = await this.hasStagedChanges();
    if (!hasChanges) {
      return {
        valid: false,
        message:
          'No staged changes to commit. Please stage your changes with "git add" first.',
      };
    }

    return { valid: true };
  }

  /**
   * Get the last commit message
   */
  async getLastCommitMessage(): Promise<string> {
    try {
      const log = await this.git.log({ maxCount: 1 });
      return log.latest?.message || "";
    } catch {
      return "";
    }
  }

  /**
   * Amend the last commit with a new message
   */
  async amendCommit(message: string): Promise<void> {
    try {
      await this.git.commit(message, undefined, { "--amend": null });
    } catch (error) {
      throw new Error(
        `Failed to amend commit: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }
}

// Singleton instance
export const gitOperations = new GitOperations();
