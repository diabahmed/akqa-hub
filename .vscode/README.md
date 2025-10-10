# VS Code Configuration

This folder contains VS Code workspace settings for the AKQA Hub project.

## Files

### `settings.json`

Workspace-specific settings that ensure consistent code formatting and linting across the team:

- **Auto-fix on save**: ESLint will automatically fix issues (including import order) when you save a file
- **Format on save**: Prettier will format your code on save
- **ESLint integration**: Validates JavaScript, TypeScript, and their React variants
- **Tailwind CSS IntelliSense**: Better autocomplete for Tailwind classes including custom variants (`cn`, `cx`, `cva`)

## Usage

When you open this project in VS Code:

1. You'll be prompted to install recommended extensions (click "Install All")
2. Code will automatically format and fix linting issues on save
3. Import order issues will be automatically corrected

## Manual Linting

If you need to manually fix linting issues across the entire project:

```bash
# Check for linting issues
pnpm lint

# Automatically fix linting issues
pnpm lint:fix
```

## Import Order

The ESLint configuration enforces a specific import order:

1. Built-in Node.js modules
2. External packages (from node_modules)
3. Internal modules (starting with `@/` or `@src/`)
4. Relative imports (parent/sibling)
5. Index imports

Imports are automatically sorted alphabetically within each group, with a blank line between groups.
