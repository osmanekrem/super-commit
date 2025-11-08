# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-11-08

### Added

- 🎯 Interactive mode with guided prompts for creating commits
- ⚡ CLI flag mode for quick commits without prompts
- 🎨 Fully customizable configuration system
- 🌍 Multi-language support (English and Turkish)
- 😀 Optional emoji support for commit types
- 🐶 Husky integration command for automatic setup
- 🔒 **NEW: Standalone validate command for commit message validation**
- 🛡️ **NEW: Optional commit-msg hook for enforcing conventional commits**
- ✅ Comprehensive validation with helpful error messages
- 📝 Support for all conventional commit types (feat, fix, docs, style, refactor, perf, test, build, ci, chore, revert)
- 🎭 Beautiful CLI interface with colors and formatting
- 📦 Custom scopes support with predefined and custom options
- 🔧 Breaking change support with detailed descriptions
- 🐛 Issue reference support
- 📚 Comprehensive documentation and examples
- 🚀 Zero-config usage with sensible defaults
- ⚙️ Configuration file support (.supercommitrc.json)
- 🎓 Interactive configuration wizard (`init` command)
- 📋 Commit message preview before confirmation
- ✨ Git environment validation
- 🌳 Automatic branch detection
- 📖 TypeScript type definitions included
- 🎨 Optimized bundle size (68KB, 68.5% reduction)

### Features

#### Commands

- `super-commit` - Create commits in interactive or flag mode
- `super-commit init` - Initialize configuration with wizard
- `super-commit husky` - Setup Husky integration with optional validation enforcement
- `super-commit validate` - **NEW: Validate commit messages (standalone command)**
  - Validate message from string (`--message`)
  - Validate message from file (`--file`)
  - Silent mode for scripting (`--silent`)
  - Exit code: 0 = valid, 1 = invalid

#### Configuration Options

- Custom commit types with emojis
- Custom scopes
- Validation rules (subject length, required fields, etc.)
- Custom prompt messages
- Format options (emoji position, separator, line breaks)
- Language selection

#### Validation

- Subject length validation (min/max)
- Type validation against configured types
- Scope validation with custom scope support
- Body line length validation
- Breaking change description requirement
- Subject format validation (lowercase start, no period at end)
- **NEW: Commit message parser for conventional commits format**
- **NEW: Enhanced error messages with visual separators**
- **NEW: Helpful tips and reference links on validation failure**

#### Format

- Standard conventional commits format
- Optional emoji integration
- Configurable emoji position (before type, after type, after subject)
- Breaking change footer
- Issue reference footer

#### Husky Integration

- **NEW: Two-mode integration (Interactive only / Interactive + Validation)**
- **NEW: Optional commit-msg hook for validation enforcement**
- Automatic Husky installation and initialization
- prepare-commit-msg hook for interactive mode
- commit-msg hook for validation (optional)
- Smart fallback between local and npx execution

#### Use Cases

- CI/CD pipelines (GitHub Actions, GitLab CI, etc.)
- Pre-commit and commit-msg git hooks
- Pre-receive hooks for server-side validation
- Team enforcement of commit standards
- Integration with other git tools

### Performance

- Optimized bundle size: 68KB (68.5% reduction from 216KB)
- Fast validation with exit codes
- No external dependencies for core validation

[1.0.0]: https://github.com/osmanekrem/super-commit/releases/tag/v1.0.0
