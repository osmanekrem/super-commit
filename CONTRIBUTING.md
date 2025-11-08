# Contributing to Super Commit

First off, thank you for considering contributing to Super Commit! It's people like you that make Super Commit such a great tool.

## Code of Conduct

By participating in this project, you are expected to uphold our Code of Conduct of being respectful and inclusive.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the issue list as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps which reproduce the problem**
- **Provide specific examples to demonstrate the steps**
- **Describe the behavior you observed after following the steps**
- **Explain which behavior you expected to see instead and why**
- **Include screenshots if relevant**
- **Include your environment details** (OS, Node.js version, npm version)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

- **Use a clear and descriptive title**
- **Provide a step-by-step description of the suggested enhancement**
- **Provide specific examples to demonstrate the steps**
- **Describe the current behavior and explain which behavior you expected to see instead**
- **Explain why this enhancement would be useful**

### Pull Requests

- Fill in the required template
- Do not include issue numbers in the PR title
- Follow the TypeScript styleguide
- Include thoughtfully-worded, well-structured tests
- Document new code
- End all files with a newline

## Development Setup

1. Fork and clone the repo

```bash
git clone https://github.com/osmanekrem/super-commit.git
cd super-commit
```

2. Install dependencies

```bash
npm install
```

3. Create a branch for your changes

```bash
git checkout -b feature/my-feature
```

4. Make your changes and build

```bash
npm run build
```

5. Test your changes locally

```bash
npm link
super-commit --help
```

6. Commit your changes using Super Commit!

```bash
super-commit
```

7. Push to your fork and submit a pull request

## Project Structure

```
super-commit/
├── src/
│   ├── cli.ts                 # Main CLI entry point
│   ├── commands/              # Command implementations
│   │   ├── commit.ts          # Commit command
│   │   ├── init.ts            # Init command
│   │   └── husky.ts           # Husky integration
│   ├── core/                  # Core functionality
│   │   ├── config.ts          # Configuration management
│   │   ├── formatter.ts       # Commit message formatting
│   │   ├── validator.ts       # Validation logic
│   │   └── git.ts             # Git operations
│   ├── prompts/               # Interactive prompts
│   │   └── interactive.ts
│   ├── types/                 # TypeScript type definitions
│   │   └── config.ts
│   └── utils/                 # Utilities and constants
│       └── constants.ts
├── dist/                      # Compiled JavaScript (generated)
├── package.json
├── tsconfig.json
└── README.md
```

## Coding Guidelines

### TypeScript Style

- Use TypeScript for all new code
- Use meaningful variable and function names
- Add JSDoc comments for public APIs
- Use `async/await` instead of promises chains
- Use `const` by default, `let` when reassignment is needed
- Prefer interfaces over type aliases for object shapes

### Commit Messages

We use Super Commit for all commits! Just run:

```bash
super-commit
```

This ensures all commits follow the conventional commits specification.

### Testing

Before submitting a PR, please test your changes:

1. Build the project: `npm run build`
2. Link locally: `npm link`
3. Test in a sample git repository
4. Test both interactive and flag modes
5. Test all three commands (commit, init, husky)

## Adding New Features

### Adding a New Commit Type

1. Update `src/utils/constants.ts` to add the new type to `DEFAULT_CONFIG` and `DEFAULT_CONFIG_TR`
2. Add emoji if desired
3. Update README.md with the new type
4. Update tests if applicable

### Adding a New Language

1. Create a new config object in `src/utils/constants.ts` (e.g., `DEFAULT_CONFIG_ES` for Spanish)
2. Add the language to the `LanguageSchema` in `src/types/config.ts`
3. Update the init command in `src/commands/init.ts` to include the new language
4. Update README.md with the new language support

### Adding a New Command

1. Create a new file in `src/commands/`
2. Export a command function
3. Wire it up in `src/cli.ts`
4. Add documentation to README.md
5. Add examples

## Release Process

Releases are handled by maintainers:

1. Update version in `package.json`
2. Update CHANGELOG.md
3. Commit changes: `super-commit` (type: chore)
4. Create git tag: `git tag -a v1.x.x -m "Release v1.x.x"`
5. Push: `git push origin main --tags`
6. Publish: `npm publish`

## Questions?

Feel free to open an issue with your question or reach out to the maintainers.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
