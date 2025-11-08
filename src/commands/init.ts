import fs from "fs-extra";
import path from "path";
import inquirer from "inquirer";
import chalk from "chalk";
import { configManager } from "../core/config";
import { CONFIG_FILE_NAME } from "../utils/constants";

export async function initCommand(): Promise<void> {
  console.log(chalk.blue.bold("\n🚀 Super Commit Configuration Setup\n"));

  // Check if config file already exists
  const configPath = path.join(process.cwd(), CONFIG_FILE_NAME);
  const configExists = await fs.pathExists(configPath);

  if (configExists) {
    const { overwrite } = await inquirer.prompt([
      {
        type: "confirm",
        name: "overwrite",
        message:
          "Configuration file already exists. Do you want to overwrite it?",
        default: false,
      },
    ]);

    if (!overwrite) {
      console.log(chalk.yellow("Configuration setup cancelled."));
      return;
    }
  }

  // Ask for language preference
  const { language } = await inquirer.prompt([
    {
      type: "list",
      name: "language",
      message: "Select your preferred language:",
      choices: [
        { name: "English", value: "en" },
        { name: "Türkçe", value: "tr" },
      ],
      default: "en",
    },
  ]);

  // Ask for customization level
  const { customization } = await inquirer.prompt([
    {
      type: "list",
      name: "customization",
      message: "Select configuration type:",
      choices: [
        {
          name: "Basic - Use recommended defaults",
          value: "basic",
        },
        {
          name: "Standard - Customize commit types and scopes",
          value: "standard",
        },
        {
          name: "Advanced - Full customization",
          value: "advanced",
        },
      ],
      default: "basic",
    },
  ]);

  // Get default config based on language
  let config = configManager.getDefaultConfig(language as "en" | "tr");

  // Apply customizations based on selected level
  if (customization === "standard" || customization === "advanced") {
    const { useEmoji } = await inquirer.prompt([
      {
        type: "confirm",
        name: "useEmoji",
        message: "Do you want to use emojis in commit messages?",
        default: false,
      },
    ]);

    config = {
      ...config,
      format: {
        ...config.format,
        useEmoji,
      },
    };
  }

  if (customization === "advanced") {
    const { subjectMaxLength, scopeRequired } = await inquirer.prompt([
      {
        type: "number",
        name: "subjectMaxLength",
        message: "Maximum length for commit subject:",
        default: 72,
        validate: (value: number) => {
          if (value < 10 || value > 200) {
            return "Please enter a value between 10 and 200";
          }
          return true;
        },
      },
      {
        type: "confirm",
        name: "scopeRequired",
        message: "Should scope be required?",
        default: false,
      },
    ]);

    config = {
      ...config,
      validation: {
        ...config.validation,
        subjectMaxLength,
        scopeRequired,
      },
    };
  }

  // Write config file
  try {
    await fs.writeJson(configPath, config, { spaces: 2 });
    console.log(
      chalk.green(
        `\n✅ Configuration file created successfully at ${CONFIG_FILE_NAME}`
      )
    );
    console.log(
      chalk.gray(
        "\nYou can manually edit this file to further customize your settings."
      )
    );
    console.log(
      chalk.gray(
        `\nTo start committing, run: ${chalk.cyan("npx super-commit")}`
      )
    );
  } catch (error) {
    console.error(chalk.red("Failed to create configuration file:"));
    console.error(error);
    process.exit(1);
  }
}
