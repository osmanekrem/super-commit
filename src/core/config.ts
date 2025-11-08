import { cosmiconfig } from "cosmiconfig";
import { SuperCommitConfig, SuperCommitConfigSchema } from "../types/config";
import {
  DEFAULT_CONFIG,
  DEFAULT_CONFIG_TR,
  CONFIG_MODULE_NAME,
} from "../utils/constants";

export class ConfigManager {
  private explorer = cosmiconfig(CONFIG_MODULE_NAME);
  private cachedConfig: SuperCommitConfig | null = null;

  /**
   * Load configuration from file or use defaults
   */
  async loadConfig(): Promise<SuperCommitConfig> {
    if (this.cachedConfig) {
      return this.cachedConfig;
    }

    try {
      const result = await this.explorer.search();

      if (result && result.config) {
        // Validate and parse the config
        const parsedConfig = SuperCommitConfigSchema.parse(result.config);
        this.cachedConfig = parsedConfig;
        return parsedConfig;
      }
    } catch (error) {
      console.warn("Warning: Invalid config file detected, using defaults.");
      console.warn(error instanceof Error ? error.message : "Unknown error");
    }

    // Return default config
    this.cachedConfig = DEFAULT_CONFIG;
    return DEFAULT_CONFIG;
  }

  /**
   * Get default config based on language
   */
  getDefaultConfig(language: "en" | "tr" = "en"): SuperCommitConfig {
    return language === "tr" ? DEFAULT_CONFIG_TR : DEFAULT_CONFIG;
  }

  /**
   * Clear cached config
   */
  clearCache(): void {
    this.cachedConfig = null;
  }

  /**
   * Validate a config object
   */
  validateConfig(config: unknown): SuperCommitConfig {
    return SuperCommitConfigSchema.parse(config);
  }
}

// Singleton instance
export const configManager = new ConfigManager();
