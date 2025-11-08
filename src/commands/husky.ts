import fs from "fs-extra";
import path from "path";
import { execSync } from "child_process";
import chalk from "chalk";
import inquirer from "inquirer";

export async function huskyCommand(): Promise<void> {
  console.log(chalk.blue.bold("\n🐶 Husky Integration Setup\n"));

  try {
    const cwd = process.cwd();
    const huskyDir = path.join(cwd, ".husky");
    const packageJsonPath = path.join(cwd, "package.json");

    // Check if package.json exists
    if (!(await fs.pathExists(packageJsonPath))) {
      console.error(
        chalk.red(
          "❌ package.json not found. Please run this command in a Node.js project."
        )
      );
      process.exit(1);
    }

    // Read package.json
    const packageJson = await fs.readJson(packageJsonPath);

    // Check if husky is already installed
    const huskyInstalled =
      packageJson.devDependencies?.husky ||
      packageJson.dependencies?.husky ||
      (await fs.pathExists(huskyDir));

    let shouldInstallHusky = !huskyInstalled;

    if (huskyInstalled) {
      console.log(chalk.green("✓ Husky is already installed"));

      const hookPath = path.join(huskyDir, "prepare-commit-msg");
      if (await fs.pathExists(hookPath)) {
        const { overwrite } = await inquirer.prompt([
          {
            type: "confirm",
            name: "overwrite",
            message:
              "prepare-commit-msg hook already exists. Do you want to overwrite it?",
            default: false,
          },
        ]);

        if (!overwrite) {
          console.log(chalk.yellow("Setup cancelled."));
          return;
        }
      }
    } else {
      const { install } = await inquirer.prompt([
        {
          type: "confirm",
          name: "install",
          message: "Husky is not installed. Do you want to install it?",
          default: true,
        },
      ]);

      if (!install) {
        console.log(
          chalk.yellow(
            "Setup cancelled. Please install Husky manually and run this command again."
          )
        );
        return;
      }

      shouldInstallHusky = true;
    }

    // Install husky if needed
    if (shouldInstallHusky) {
      console.log(chalk.cyan("\n📦 Installing Husky..."));

      try {
        // Detect package manager
        const packageManager = detectPackageManager(cwd);

        if (packageManager === "npm") {
          execSync("npm install --save-dev husky", { cwd, stdio: "inherit" });
        } else if (packageManager === "yarn") {
          execSync("yarn add --dev husky", { cwd, stdio: "inherit" });
        } else if (packageManager === "pnpm") {
          execSync("pnpm add --save-dev husky", { cwd, stdio: "inherit" });
        }

        console.log(chalk.green("✓ Husky installed successfully"));

        // Initialize husky
        console.log(chalk.cyan("\n🔧 Initializing Husky..."));
        execSync("npx husky init", { cwd, stdio: "inherit" });
        console.log(chalk.green("✓ Husky initialized"));
      } catch (error) {
        console.error(chalk.red("Failed to install Husky:"));
        console.error(error);
        process.exit(1);
      }
    }

    // Create or update prepare-commit-msg hook
    await createPrepareCommitMsgHook(cwd);

    // Ask if user wants commit message validation
    const { enableValidation } = await inquirer.prompt([
      {
        type: "confirm",
        name: "enableValidation",
        message:
          "Do you want to enforce conventional commits validation? (rejects non-conventional commits)",
        default: true,
      },
    ]);

    if (enableValidation) {
      await createCommitMsgHook(cwd);
    }

    // Update package.json scripts if needed
    await updatePackageJsonScripts(packageJsonPath, packageJson);

    console.log(chalk.green.bold("\n✅ Husky integration setup completed!\n"));
    console.log(
      chalk.gray(
        "Super Commit will now be used for all commits in this repository."
      )
    );
    console.log(chalk.gray('You can still use "git commit" as usual.\n'));
  } catch (error) {
    console.error(chalk.red("\n❌ Error setting up Husky integration:\n"));
    console.error(error instanceof Error ? error.message : "Unknown error");
    process.exit(1);
  }
}

/**
 * Detect which package manager is being used
 */
function detectPackageManager(cwd: string): "npm" | "yarn" | "pnpm" {
  if (fs.existsSync(path.join(cwd, "pnpm-lock.yaml"))) {
    return "pnpm";
  }
  if (fs.existsSync(path.join(cwd, "yarn.lock"))) {
    return "yarn";
  }
  return "npm";
}

/**
 * Create prepare-commit-msg hook
 */
async function createPrepareCommitMsgHook(cwd: string): Promise<void> {
  const huskyDir = path.join(cwd, ".husky");
  const hookPath = path.join(huskyDir, "prepare-commit-msg");

  // Ensure .husky directory exists
  await fs.ensureDir(huskyDir);

  // Create the hook script (Husky v9+ format)
  const hookContent = `# Check if this is not an amend, merge, or squash commit
if [ -z "$2" ]; then
  # Run super-commit in interactive mode
  exec < /dev/tty && npx super-commit
  
  # If super-commit succeeds, prevent the default commit message editor
  if [ $? -eq 0 ]; then
    exit 0
  fi
fi
`;

  await fs.writeFile(hookPath, hookContent, { mode: 0o755 });
  console.log(chalk.green("✓ prepare-commit-msg hook created"));
}

/**
 * Create commit-msg hook for validation
 */
async function createCommitMsgHook(cwd: string): Promise<void> {
  const huskyDir = path.join(cwd, ".husky");
  const hookPath = path.join(huskyDir, "commit-msg");

  // Ensure .husky directory exists
  await fs.ensureDir(huskyDir);

  // Create the validation hook script (Husky v9+ format)
  const hookContent = `# Validate commit message using super-commit
# Try to use the local installation if available, otherwise use npx
if [ -f "$(dirname "$0")/../dist/cli.js" ]; then
  node "$(dirname "$0")/../dist/cli.js" validate --file "$1"
else
  npx super-commit validate --file "$1"
fi

if [ $? -ne 0 ]; then
  echo ""
  echo "════════════════════════════════════════════════════════════"
  echo "❌ COMMIT REJECTED"
  echo "════════════════════════════════════════════════════════════"
  echo ""
  echo "Your commit message does not follow conventional commits format."
  echo ""
  echo "💡 Quick Fix Options:"
  echo "  1. Use: npx super-commit (interactive mode)"
  echo "  2. Or format: <type>(<scope>): <subject>"
  echo ""
  echo "📖 More info: https://www.conventionalcommits.org"
  echo ""
  exit 1
fi
`;

  await fs.writeFile(hookPath, hookContent, { mode: 0o755 });
  console.log(chalk.green("✓ commit-msg validation hook created"));
}

/**
 * Update package.json scripts
 */
async function updatePackageJsonScripts(
  packageJsonPath: string,
  packageJson: any
): Promise<void> {
  let updated = false;

  // Ensure scripts object exists
  if (!packageJson.scripts) {
    packageJson.scripts = {};
  }

  // Add prepare script if not exists
  if (!packageJson.scripts.prepare) {
    packageJson.scripts.prepare = "husky";
    updated = true;
  } else if (!packageJson.scripts.prepare.includes("husky")) {
    console.log(
      chalk.yellow(
        '\n⚠️  Warning: "prepare" script already exists in package.json'
      )
    );
    console.log(chalk.gray("Please make sure it includes: husky"));
  }

  // Add commit script for convenience
  if (!packageJson.scripts.commit) {
    packageJson.scripts.commit = "super-commit";
    updated = true;
  }

  if (updated) {
    await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });
    console.log(chalk.green("✓ package.json scripts updated"));
  }
}
