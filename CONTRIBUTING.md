# Contributing to React Drawflow

Thank you for your interest in contributing to React Drawflow! This document provides guidelines and instructions for contributing.

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for all contributors.

## How to Contribute

### Reporting Bugs

If you find a bug, please open an issue with:

- A clear, descriptive title
- Steps to reproduce the issue
- Expected behavior
- Actual behavior
- Screenshots (if applicable)
- Environment information (OS, browser, Node version, etc.)

### Suggesting Features

Feature suggestions are welcome! Please open an issue with:

- A clear description of the feature
- Use cases and examples
- Potential implementation approach (if you have ideas)

### Pull Requests

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Make your changes**
4. **Follow the coding standards** (see below)
5. **Add tests** if applicable
6. **Update documentation** if needed
7. **Run linting and tests** (`pnpm lint && pnpm test`)
8. **Commit your changes** with clear commit messages
9. **Push to your branch** (`git push origin feature/amazing-feature`)
10. **Open a Pull Request**

## Development Setup

```bash
# Clone your fork
git clone https://github.com/your-username/react-drawflow.git
cd react-drawflow

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

## Coding Standards

### TypeScript

- Use TypeScript for all new code
- Avoid `any` types - use proper types or `unknown`
- Export types from `@react-drawflow/types` when possible

### Code Style

- Follow the existing code style
- Use Prettier for formatting (`pnpm format`)
- Use ESLint for linting (`pnpm lint`)
- Use meaningful variable and function names
- Add comments for complex logic

### React Best Practices

- Use functional components and hooks
- Keep components small and focused
- Use `React.memo` for expensive components
- Avoid unnecessary re-renders
- Follow React hooks rules

### Git Commit Messages

Use clear, descriptive commit messages:

```
feat: Add mini-map component
fix: Fix port positioning in vertical mode
docs: Update README with new features
refactor: Simplify connection rendering logic
test: Add tests for node cloning
```

## Project Structure

- `packages/core/` - Main library code
- `packages/types/` - TypeScript type definitions
- `packages/themes/` - Theme presets
- `apps/playground/` - Demo application

## Testing

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage
```

## Documentation

- Update README.md for user-facing changes
- Add JSDoc comments for new functions/components
- Update API documentation if adding new hooks/components

## Questions?

If you have questions, feel free to:
- Open a discussion on GitHub
- Ask in an issue
- Contact the maintainers

Thank you for contributing to React Drawflow! 🎉

