# Super Commit 🚀

A powerful, fully customizable conventional commit CLI tool that makes creating standardized commit messages effortless. Built with TypeScript and designed for modern development workflows.

## ✨ Features

- **🎯 Interactive Mode**: Guided prompts to create perfect conventional commits
- **⚡ CLI Flag Mode**: Quick commits using command-line flags
- **🎨 Fully Customizable**: Configure commit types, scopes, validation rules, and more
- **🌍 Multi-language Support**: English and Turkish (Türkçe) out of the box
- **😀 Emoji Support**: Optional emoji integration for commit types
- **🐶 Husky Integration**: Automatic setup for git hooks with optional validation
- **✅ Smart Validation**: Comprehensive validation with helpful error messages
- **🔒 Commit Message Validation**: Standalone validate command for CI/CD and git hooks
- **🎭 Beautiful CLI**: Colorful, user-friendly interface

## 📦 Installation

### Use with npx (Recommended)

No installation needed! Just use it directly:

```bash
npx super-commit
```

### Global Installation

```bash
npm install -g super-commit
```

### Local Installation

```bash
npm install --save-dev super-commit
```

## 🚀 Quick Start

### Interactive Mode (Recommended)

Simply run the command and answer the prompts:

```bash
npx super-commit
```

You'll be guided through:

1. **Type**: Select the type of change (feat, fix, docs, etc.)
2. **Scope**: Choose the scope of changes (optional)
3. **Subject**: Write a short description
4. **Body**: Add a detailed description (optional)
5. **Breaking Changes**: Mark and describe breaking changes
6. **Issues**: Reference related issues

### CLI Flag Mode

For quick commits without prompts:

```bash
# Basic commit
npx super-commit --type feat --message "add user authentication"

# With scope
npx super-commit -t fix -s api -m "fix login endpoint"

# With body and breaking change
npx super-commit -t feat -m "redesign API" -b "Complete API redesign" --breaking

# With issue references
npx super-commit -t fix -m "fix memory leak" -i "fix #123"
```

### Available Flags

- `-t, --type <type>` - Commit type (feat, fix, docs, etc.)
- `-s, --scope <scope>` - Commit scope
- `-m, --message <message>` - Short description
- `-b, --body <body>` - Detailed description
- `--breaking` - Mark as breaking change
- `-i, --issues <issues>` - Issue references

## ⚙️ Configuration

### Initialize Configuration

Create a customized configuration file:

```bash
npx super-commit init
```

This will guide you through creating a `.supercommitrc.json` file with your preferences:

- Language (English/Türkçe)
- Customization level (Basic/Standard/Advanced)
- Emoji support
- Validation rules
- And more!

### Configuration File

Create a `.supercommitrc.json` file in your project root:

```json
{
  "language": "en",
  "types": [
    {
      "value": "feat",
      "name": "feat: A new feature",
      "description": "Introduces a new feature to the codebase",
      "emoji": "✨"
    },
    {
      "value": "fix",
      "name": "fix: A bug fix",
      "description": "Patches a bug in your codebase",
      "emoji": "🐛"
    }
  ],
  "scopes": [
    { "value": "api", "name": "api: API related changes" },
    { "value": "ui", "name": "ui: User interface changes" }
  ],
  "validation": {
    "subjectMaxLength": 72,
    "subjectMinLength": 1,
    "scopeRequired": false,
    "allowCustomScopes": true
  },
  "format": {
    "useEmoji": false,
    "emojiPosition": "before-type"
  }
}
```

### Configuration Options

#### Types

Define custom commit types:

```json
{
  "types": [
    {
      "value": "feat",
      "name": "feat: A new feature",
      "description": "Optional description",
      "emoji": "✨"
    }
  ]
}
```

**Default types**: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`

#### Scopes

Define allowed scopes:

```json
{
  "scopes": [
    { "value": "api", "name": "api: API related changes" },
    { "value": "ui", "name": "ui: User interface" }
  ]
}
```

#### Validation Rules

```json
{
  "validation": {
    "subjectMaxLength": 72,
    "subjectMinLength": 1,
    "bodyMaxLineLength": 100,
    "typeRequired": true,
    "scopeRequired": false,
    "subjectRequired": true,
    "allowCustomScopes": true,
    "allowEmptyBody": true
  }
}
```

#### Format Options

```json
{
  "format": {
    "useEmoji": true,
    "emojiPosition": "before-type",
    "separator": ":",
    "lineBreaksBetweenSections": 1
  }
}
```

**Emoji Positions**: `before-type`, `after-type`, `after-subject`

#### Prompt Messages

Customize prompt messages (supports i18n):

```json
{
  "promptMessages": {
    "type": "Select the type of change:",
    "scope": "Denote the SCOPE of this change:",
    "subject": "Write a SHORT description:",
    "body": "Provide a LONGER description:",
    "breaking": "Are there any breaking changes?",
    "issues": "Add issue references:"
  }
}
```

## 🐶 Husky Integration

Automatically use Super Commit for all commits in your repository:

```bash
npx super-commit husky
```

This command will:

1. Check if Husky is installed (and install it if needed)
2. Initialize Husky in your project
3. Create a `prepare-commit-msg` hook (for interactive mode)
4. **Ask if you want to enforce conventional commits validation**
5. Optionally create a `commit-msg` hook (for validation)
6. Update your `package.json` scripts

### Two Integration Modes

**Interactive Mode Only** (No validation):

- Uses Super Commit's interactive prompts for creating commits
- Allows any commit message format with `git commit -m`

**Interactive + Validation Mode** (Recommended):

- Uses Super Commit's interactive prompts for creating commits
- **Rejects non-conventional commits** made with `git commit -m`
- Ensures all commits follow conventional format

After setup, Super Commit will be integrated with your git workflow!

### Manual Husky Setup

If you prefer manual setup:

1. Install Husky:

```bash
npm install --save-dev husky
npx husky init
```

2. Create `.husky/prepare-commit-msg`:

```bash
# Check if this is not an amend, merge, or squash commit
if [ -z "$2" ]; then
  # Run super-commit in interactive mode
  exec < /dev/tty && npx super-commit

  # If super-commit succeeds, prevent the default commit message editor
  if [ $? -eq 0 ]; then
    exit 0
  fi
fi
```

3. Make it executable:

```bash
chmod +x .husky/prepare-commit-msg
```

4. (Optional) Create `.husky/commit-msg` for validation:

```bash
# Validate commit message using super-commit
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
```

5. Make it executable:

```bash
chmod +x .husky/commit-msg
```

## ✅ Validate Command

Standalone command to validate commit messages. Perfect for CI/CD pipelines and custom git hooks:

```bash
# Validate a message string
npx super-commit validate --message "feat: add new feature"

# Validate from a file (useful in git hooks)
npx super-commit validate --file .git/COMMIT_EDITMSG

# Silent mode (only exit code, no output)
npx super-commit validate --message "feat: test" --silent
echo $?  # 0 = valid, 1 = invalid
```

### Use Cases

**CI/CD Pipeline:**

```yaml
# GitHub Actions example
- name: Validate Commit Message
  run: |
    npx super-commit validate --message "${{ github.event.head_commit.message }}"
```

**Custom Git Hook:**

```bash
#!/bin/bash
# .git/hooks/commit-msg
npx super-commit validate --file "$1"
```

**Pre-receive Hook (Server-side):**

```bash
#!/bin/bash
while read oldrev newrev refname; do
  git log $oldrev..$newrev --format=%s | while read msg; do
    echo "$msg" | npx super-commit validate --message "$msg" --silent || exit 1
  done
done
```

## 📝 Conventional Commits Format

Super Commit follows the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Example Commits

**Simple feature:**

```
feat: add user authentication
```

**With scope:**

```
fix(api): resolve login endpoint error
```

**With body:**

```
feat(ui): redesign dashboard layout

Completely redesigned the dashboard with a new card-based layout.
Improved mobile responsiveness and added dark mode support.
```

**Breaking change:**

```
feat(api): redesign authentication API

BREAKING CHANGE: Authentication endpoints have been redesigned.
All clients need to update their integration.
```

**With issue reference:**

```
fix(parser): handle edge case in date parsing

fix #123
```

## 🎯 Use Cases

### For Individual Developers

- Maintain consistent commit history
- Learn conventional commits easily
- Speed up commit message writing

### For Teams

- Enforce commit conventions across the team
- Generate better changelogs automatically
- Improve code review process
- Integrate with CI/CD pipelines

### For Open Source Projects

- Make it easy for contributors to follow conventions
- Maintain professional commit history
- Automate semantic versioning

## 🌍 Language Support

Super Commit supports multiple languages. Currently available:

- **English** (`en`)
- **Türkçe** (`tr`)

To use Turkish:

```json
{
  "language": "tr"
}
```

Want to add more languages? Contributions are welcome!

## 🔧 Advanced Usage

### Package.json Scripts

Add convenient scripts to your `package.json`:

```json
{
  "scripts": {
    "commit": "super-commit",
    "commit:init": "super-commit init",
    "commit:husky": "super-commit husky"
  }
}
```

Then use:

```bash
npm run commit
```

### CI/CD Integration

Super Commit can be used in CI/CD pipelines to validate commit messages:

```yaml
# GitHub Actions example
- name: Validate Commit Message
  run: |
    npx super-commit --type feat --message "automated build"
```

### Programmatic Usage

Super Commit can be imported and used programmatically:

```typescript
import { commitCommand } from "super-commit";

await commitCommand({
  type: "feat",
  message: "add new feature",
  scope: "api",
});
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Development Setup

```bash
# Clone the repository
git clone https://github.com/osmanekrem/super-commit.git
cd super-commit

# Install dependencies
npm install

# Build the project
npm run build

# Link for local testing
npm link

# Test it
super-commit
```

## 📄 License

MIT

## 🙏 Credits

Inspired by [Commitizen](https://github.com/commitizen/cz-cli) and [Conventional Commits](https://www.conventionalcommits.org/).

Built with:

- [Commander.js](https://github.com/tj/commander.js) - CLI framework
- [Inquirer.js](https://github.com/SBoudrias/Inquirer.js) - Interactive prompts
- [Chalk](https://github.com/chalk/chalk) - Terminal styling
- [Simple Git](https://github.com/steveukx/git-js) - Git operations
- [Zod](https://github.com/colinhacks/zod) - Schema validation

## 💬 Support

If you have any questions or need help, please open an issue on GitHub.

---

Made with ❤️ by osmanekrem, for developers.
