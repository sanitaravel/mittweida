# Mittweida Classic Explorer - Branching Strategy

## Overview

This document outlines the Git branching strategy and naming conventions for the Mittweida Classic Explorer project.

## Branch Structure

### Main Branches

- **`main`** - Production-ready, stable code
- **`develop`** - Integration branch for all features

### Branch Naming Convention

#### Format: `category/description-with-hyphens`

#### Categories

##### 🎨 UI/Frontend (`feature/ui-*`)

- `feature/ui-welcome-page` - Welcome screen implementation
- `feature/ui-route-selection` - Route selection interface
- `feature/ui-guided-tour` - Main tour interface
- `feature/ui-story-view` - Story carousel view
- `feature/ui-settings` - Settings screen
- `feature/ui-completion` - Tour completion page
- `feature/ui-create-tour` - Custom tour builder
- `feature/ui-responsive` - Mobile responsiveness
- `feature/ui-accessibility` - Accessibility improvements
- `feature/ui-animations` - UI animations and transitions

##### 🔌 API Integration (`feature/api-*`)

- `feature/api-routes` - Routes data service
- `feature/api-attractions` - Attractions data management
- `feature/api-audio` - Audio content service
- `feature/api-user-prefs` - User preferences storage
- `feature/api-progress` - Tour progress tracking
- `feature/api-offline` - Offline data caching
- `feature/api-auth` - User authentication (if needed)

##### 🗺️ Maps Integration (`feature/maps-*`)

- `feature/maps-integration` - Initial maps setup
- `feature/maps-routing` - Route display and navigation
- `feature/maps-location` - User location tracking
- `feature/maps-pins` - Attraction markers and pins
- `feature/maps-offline` - Offline maps support
- `feature/maps-customization` - Map styling and themes

##### ⚙️ Core Features (`feature/core-*`)

- `feature/core-navigation` - App navigation system
- `feature/core-audio` - Audio playback system
- `feature/core-progress` - Progress tracking
- `feature/core-tour-builder` - Custom tour creation
- `feature/core-accessibility` - Accessibility features
- `feature/core-i18n` - Internationalization
- `feature/core-notifications` - Push notifications

##### 🐛 Bug Fixes (`bugfix/*`)

- `bugfix/audio-playback-ios`
- `bugfix/map-loading-timeout`
- `bugfix/route-selection-crash`
- `bugfix/story-view-navigation`

##### 📈 Improvements (`improve/*`)

- `improve/performance-maps`
- `improve/bundle-size`
- `improve/loading-times`
- `improve/memory-usage`

##### 🔄 Refactoring (`refactor/*`)

- `refactor/component-structure`
- `refactor/state-management`
- `refactor/api-services`
- `refactor/routing-logic`

##### 📚 Documentation (`docs/*`)

- `docs/api-documentation`
- `docs/user-guide`
- `docs/deployment-guide`
- `docs/accessibility-audit`

##### 🧪 Testing (`test/*`)

- `test/unit-tests`
- `test/integration-tests`
- `test/e2e-tests`
- `test/accessibility-tests`
- `test/performance-tests`

## Commit Message Convention

Follow [Conventional Commits](https://www.conventionalcommits.org/) format:

### Format: `type(scope): description`

#### Types

- **`feat`** - New feature
- **`fix`** - Bug fix
- **`docs`** - Documentation changes
- **`style`** - Code formatting (no logic changes)
- **`refactor`** - Code refactoring
- **`test`** - Adding or updating tests
- **`chore`** - Maintenance tasks

#### Scopes

- **`ui`** - User interface components
- **`api`** - API integration
- **`maps`** - Maps functionality
- **`core`** - Core application logic
- **`config`** - Configuration changes
- **`deps`** - Dependency updates

#### Examples

```text
feat(ui): implement welcome page with route selection
feat(maps): add user location tracking
fix(api): handle network timeout errors
docs(api): add endpoint documentation
test(ui): add unit tests for story view component
refactor(core): migrate to Redux Toolkit
chore(deps): update React to v19.1.0
```

## Workflow Process

### 1. Starting a New Feature

```powershell
# Update develop branch
git checkout develop
git pull origin develop

# Create feature branch
git checkout -b feature/ui-welcome-page

# Or use the branch manager script
.\branch-manager.ps1 create feature/ui-welcome-page
```

### 2. Development Process

```powershell
# Make changes and commit frequently
git add .
git commit -m "feat(ui): add welcome page header component"

# Push to remote regularly
git push origin feature/ui-welcome-page
```

### 3. Finishing a Feature

```powershell
# Use the branch manager script
.\branch-manager.ps1 finish feature/ui-welcome-page

# Or manually:
git checkout develop
git pull origin develop
git merge feature/ui-welcome-page
git push origin develop
git branch -d feature/ui-welcome-page
git push origin --delete feature/ui-welcome-page
```

### 4. Release Process

```powershell
# Create release branch from develop
git checkout develop
git pull origin develop
git checkout -b release/v1.0.0

# Final testing and bug fixes
# Then merge to main
git checkout main
git merge release/v1.0.0
git tag v1.0.0
git push origin main --tags

# Merge back to develop
git checkout develop
git merge release/v1.0.0
git push origin develop

# Clean up
git branch -d release/v1.0.0
```

## Future Development Roadmap Branches

### Phase 1: Core UI (Current)

- `feature/ui-welcome-page`
- `feature/ui-route-selection`
- `feature/ui-guided-tour`

### Phase 2: Maps Integration

- `feature/maps-integration`
- `feature/maps-routing`
- `feature/maps-location`

### Phase 3: API Integration

- `feature/api-routes`
- `feature/api-attractions`
- `feature/api-audio`

### Phase 4: Advanced Features

- `feature/core-offline-mode`
- `feature/core-accessibility`
- `feature/core-i18n`

### Phase 5: Testing & Polish

- `test/comprehensive-testing`
- `improve/performance-optimization`
- `docs/user-documentation`

## Branch Protection Rules (Recommended)

### For `main` branch

- Require pull request reviews
- Require status checks to pass
- Require branches to be up to date
- Restrict pushes that create files larger than 100MB

### For `develop` branch

- Require pull request reviews
- Require status checks to pass
- Allow force pushes by administrators

## Tools and Scripts

- **`branch-manager.ps1`** - PowerShell script for branch management
- **`.gitignore`** - Configured for Node.js/React projects
- **GitHub Actions** - CI/CD workflows (to be implemented)

## Best Practices

1. **Keep branches focused** - One feature per branch
2. **Regular commits** - Small, atomic commits with clear messages
3. **Sync frequently** - Pull from develop regularly to avoid conflicts
4. **Clean up** - Delete feature branches after merging
5. **Use descriptive names** - Branch names should clearly indicate the work being done
6. **Test before merging** - Ensure features work before merging to develop
7. **Document changes** - Update relevant documentation with feature changes
