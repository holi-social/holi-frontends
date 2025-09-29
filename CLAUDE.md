# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Development Commands

### Build, Lint, and Test Commands

- `yarn check-types` - Run TypeScript type checking across all workspaces
- `yarn lint` - Run ESLint on all changed files since main branch
- `yarn lint_all` - Run ESLint on all files in all workspaces
- `yarn format` - Format code with Biome
- `yarn format:check` - Check code formatting with Biome
- `yarn test` - Run Jest unit tests
- `yarn test:coverage` - Run tests with coverage report
- `yarn test:watch` - Run tests in watch mode for uncommitted files
- `yarn test:watchAll` - Run tests in watch mode for all files

### Development Servers

- `yarn web:dev` - Start web development server (Next.js)
- `yarn mobile:dev` - Start mobile development server (Expo)
- `yarn storybook:dev` - Start Storybook development server

### Build Commands

- `yarn web:build` - Build web application for production
- `yarn mobile:build_all` - Build mobile app for all platforms
- `yarn mobile:build_android` - Build Android app
- `yarn mobile:build_ios` - Build iOS app

### GraphQL Code Generation

- `yarn schema:generate` - Generate GraphQL types and hooks from schema
- `yarn schema:watch` - Generate GraphQL code in watch mode

### E2E Testing

- `yarn e2e:android` - Run Android e2e tests
- `yarn e2e:ios` - Run iOS e2e tests

## High-Level Architecture

This is a **React Native monorepo** using **Yarn Workspaces** that supports both web (Next.js + React Native Web) and mobile (Expo/React Native) platforms with extensive code sharing.

### Project Structure

```
holi-frontends/
├── apps/                    # Platform-specific apps
│   ├── mobile/             # React Native mobile app (iOS/Android)
│   ├── web/                # Next.js web app with React Native Web
│   └── storybook/          # Component documentation
├── core/                   # Shared business logic and screens
│   ├── screens/            # All app screens (shared between platforms)
│   ├── components/         # Shared UI components
│   ├── auth/               # Authentication logic
│   ├── i18n/               # Internationalization
│   └── hooks/              # Custom React hooks
├── packages/               # Reusable library packages
│   ├── ui/                 # Component library (Holi UI)
│   ├── api/                # GraphQL API client
│   ├── icons/              # Icon library
│   └── chat/               # Matrix chat implementation
├── holi-apps/              # Modular app features
└── holi-bricks/            # Design system components
```

### Key Architecture Patterns

#### Monorepo Dependencies Hierarchy

1. **Platform packages** (apps/mobile, apps/web, apps/storybook) - can depend on everything below
2. **Application logic** (core, holi-apps) - can depend on shared packages only
3. **Shared packages** (packages/*) - should be independent and reusable

#### Code Sharing Strategy

- **Screens**: Shared in `core/screens/`, used by both web pages and mobile screens
- **Navigation**: Unified routing system with platform-specific implementations
- **Components**: Shared components in `core/components/` and `packages/ui/`
- **Platform variants**: Use `.web.tsx` suffix for web-specific implementations

#### File Naming Conventions

- **Components/Screens**: PascalCase (e.g., `UserProfile.tsx`)
- **Other files**: camelCase (e.g., `userHelpers.ts`)
- **Tests**: In `__tests__/` folders with `.test.tsx` suffix
- **Platform variants**: `.web.tsx` for web-specific code

### Technology Stack

- **Frontend**: React Native, React Native Web, Next.js, Expo
- **State Management**: Apollo Client (GraphQL), React Context
- **Styling**: Unistyles, holi-bricks design system
- **Testing**: Jest, React Native Testing Library, Playwright (e2e)
- **Build Tools**: Turborepo, Yarn Workspaces, EAS Build
- **Code Quality**: ESLint, Biome (formatting), TypeScript

### Development Workflow

#### Dependency Management Rules

- **Root**: Only monorepo-aware dev dependencies (eslint, etc.)
- **Core**: No dependencies (uses peer dependencies)
- **Mobile**: All React Native and universal dependencies
- **Web**: Web-only dependencies

#### Navigation Implementation

To add a new route:

1. Create screen in `core/screens/[feature]/`
2. Add route to `apps/mobile/navigation/`  
3. Create page in `apps/web/pages/`
4. Add route mapping in `core/navigation/`

#### Testing Strategy

- **Unit tests**: Jest + React Native Testing Library
- **Component tests**: Snapshot tests for UI components
- **E2E tests**: Playwright (web), Appium + BrowserStack (mobile)

### Important Notes

- **No relative imports** across workspace boundaries - use `@holi/` prefixes
- **Use holi-bricks components** instead of base React Native components
- **Follow ESLint rules** - enforces architectural boundaries
- **Always run type checking** before commits
- **Use GraphQL Code Generation** for type-safe API calls
