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

### Features

#### Commands

- `super-commit` - Create commits in interactive or flag mode
- `super-commit init` - Initialize configuration with wizard
- `super-commit husky` - Setup Husky integration

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

#### Format

- Standard conventional commits format
- Optional emoji integration
- Configurable emoji position (before type, after type, after subject)
- Breaking change footer
- Issue reference footer

[1.0.0]: https://github.com/osmanekrem/super-commit/releases/tag/v1.0.0
