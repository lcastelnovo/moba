# Moba - Modern Admin Panel for Rails

## Overview

Moba is a Ruby gem that provides a modern admin panel for Rails applications using React, TypeScript, and Superglue. It's designed as an alternative to Avo, offering full React flexibility while maintaining seamless Rails integration.

## Project Context

### Origin
- **Creator**: Luca Castelnovo (luca@monade.io)
- **Organization**: Monade
- **Purpose**: Internal tool for Monade's Rails projects
- **Inspiration**: Avo gem, but with React/Superglue instead of Rails views + Hotwire

### Reference Project
The implementation is heavily inspired by **skill-matrix** (`/Users/luca/monade/skill-matrix`), which is a production Rails 8.0 app using the exact same stack (Superglue + React 19 + TypeScript). Key patterns and architecture decisions are based on this working implementation.

## Architecture

### Core Stack
- **Backend**: Rails 8.0+ Engine with isolated namespace
- **Frontend**: React 19 + TypeScript (strict mode)
- **Data Flow**: Superglue (server-driven React with props-based JSON)
- **State Management**: Redux Toolkit + Superglue reducers
- **Templates**: Jbuilder for `.json.props` files
- **Bundler**: esbuild for JavaScript, standard Rails asset pipeline
- **Styling**: Plain CSS for now (can add Tailwind later)
- **Testing**: RSpec

### Key Dependencies

**IMPORTANT**: Superglue requires BOTH a Ruby gem AND an NPM package!

```ruby
# moba.gemspec
spec.add_dependency "rails", ">= 7.0"
spec.add_dependency "superglue"  # ⚠️ CRITICAL: Ruby gem for Rails-side integration
```

```json
// package.json
"@thoughtbot/superglue": "^1.0.3"  // NPM package for React-side
"react": "^19.1.0"
"@reduxjs/toolkit": "^2.8.2"
"@tanstack/react-table": "^8.21.3"
```

The `superglue` Ruby gem provides:
- `use_jsx_rendering_defaults` - Automatically sets response format to JSON
- `render_props` - Helper method to serialize props for initial page state
- `superglue_template` - DSL to specify custom HTML template
- `.json.props` template support (via props_template internally)

## How Superglue Works

### Data Flow Pattern
```
1. User navigates → Rails Controller Action
2. Controller sets @instance_variables
3. Rails renders .json.props template (Jbuilder)
4. JSON response → Superglue action creator
5. Redux store updated with new page props
6. React component re-renders with useContent() hook
```

### Example Flow
```ruby
# app/controllers/moba/dashboard_controller.rb
def index
  @message = "Welcome to Moba"
end
```

```ruby
# app/views/moba/dashboard/index.json.props
json.message @message
```

```typescript
// app/views/moba/dashboard/index.tsx
export default function DashboardIndex() {
  const { message } = useContent<DashboardProps>();
  return <h1>{message}</h1>;
}
```

### Key Superglue Concepts
- **No separate API**: Controllers return both HTML (for initial load) and JSON (for SPA navigation)
- **Server-driven**: Rails controls what data to send
- **Type-safe**: TypeScript interfaces for props
- **Page mapping**: Maps controller/action to React components via `page_to_page_mapping.ts`

## Directory Structure

```
moba/
├── lib/
│   ├── moba.rb                          # Main module with configuration
│   ├── moba/
│   │   ├── version.rb                   # Gem version
│   │   └── engine.rb                    # Rails Engine configuration
│
├── app/
│   ├── controllers/moba/
│   │   ├── application_controller.rb    # Base controller with use_jsx_rendering_defaults
│   │   └── dashboard_controller.rb      # Example controller
│   │
│   ├── views/moba/
│   │   ├── application/
│   │   │   └── superglue.html.erb       # HTML bootstrap template
│   │   └── dashboard/
│   │       ├── index.json.props         # Jbuilder props template
│   │       └── index.tsx                # React page component
│   │
│   ├── javascript/moba/
│   │   ├── application.tsx              # React app entry point
│   │   ├── application_visit.ts         # Superglue visit/remote handlers
│   │   ├── store.ts                     # Redux store with Superglue reducers
│   │   ├── page_to_page_mapping.ts      # Maps routes to components
│   │   └── hooks/
│   │       └── useContent.ts            # Re-export of Superglue's useContent
│   │
│   └── assets/
│       ├── stylesheets/moba/
│       │   └── application.css
│       └── builds/                       # Compiled JS/CSS (gitignored)
│
├── config/
│   └── routes.rb                         # Engine routes
│
├── spec/
│   ├── dummy/                            # Dummy Rails app for testing
│   │   └── config/
│   ├── moba_spec.rb
│   ├── spec_helper.rb
│   └── rails_helper.rb
│
├── moba.gemspec
├── package.json
├── tsconfig.json
├── Gemfile
└── README.md
```

## Configuration

### Default Configuration
```ruby
# lib/moba.rb
Moba.configure do |config|
  config.namespace = "admin"              # URL namespace
  config.mount_path = "/admin"            # Mount point
  config.current_user_method = :current_user
end
```

### Mounting in Host App
```ruby
# config/routes.rb (in host app)
mount Moba::Engine => "/admin"
```

## Key Files Explained

### 1. `lib/moba/engine.rb`
Rails Engine configuration with:
- Isolated namespace (`Moba::`)
- Asset paths configuration
- Generator configuration (RSpec, no assets, no helpers)
- Props template initialization

### 2. `app/controllers/moba/application_controller.rb`
Base controller that:
- Uses `use_jsx_rendering_defaults` to set JSON format
- Provides `current_user` helper method
- Will include authorization/authentication concerns

### 3. `app/views/moba/application/superglue.html.erb`
HTML template that:
- Bootstraps React app
- Includes compiled JS/CSS
- Sets `window.SUPERGLUE_INITIAL_PAGE_STATE` for initial props

### 4. `app/javascript/moba/application.tsx`
React entry point that:
- Creates Redux store
- Initializes Superglue Application component
- Handles DOMContentLoaded event
- Passes `buildVisitAndRemote`, `store`, and `mapping` to Application

### 5. `app/javascript/moba/store.ts`
Redux store with:
- `superglue` reducer (Superglue's state)
- `pages` reducer (all page props)
- Middleware configured to ignore Superglue action serialization checks

### 6. `app/javascript/moba/page_to_page_mapping.ts`
Maps controller/action strings to React components:
```typescript
{
  "moba/dashboard/index": DashboardIndex,
  "moba/users/index": UsersIndex,
  // ...
}
```

## Development Workflow

### Building Assets
```bash
npm run build       # Build JS with esbuild
npm run build:css   # Copy CSS (Tailwind not set up yet)
npm run watch       # Watch mode for JS
```

### Running Tests
```bash
bundle exec rspec
```

### Installing Locally in Another Project
```ruby
# In host app's Gemfile
gem 'moba', path: '/Users/luca/personale/moba'
```

## Patterns & Conventions

### 1. Resource Pattern (from skill-matrix)
Every resource follows this structure:
```
Controller → Props Template → React Component

app/controllers/moba/users_controller.rb
app/views/moba/users/index.json.props
app/views/moba/users/index.tsx
```

### 2. Props Template Convention
Use Jbuilder to serialize data:
```ruby
json.users do
  json.array! @users do |user|
    json.id user.id
    json.email user.email
  end
end

json.pagination do
  json.currentPage @users.current_page
  json.totalPages @users.total_pages
end
```

### 3. React Component Convention
Type-safe props with TypeScript:
```typescript
type UsersIndexProps = {
  users: User[];
  pagination: Pagination;
};

export default function UsersIndex() {
  const { users, pagination } = useContent<UsersIndexProps>();
  // ...
}
```

### 4. Navigation
Use Superglue's visit:
```typescript
import { useContext } from "react";
import { NavigationContext } from "@thoughtbot/superglue";

const { visit } = useContext(NavigationContext);
visit("/admin/users");
```

## Next Steps / Roadmap

### Phase 1: Core CRUD (Current Focus)
- [ ] Create resource generator (`rails g moba:resource User`)
- [ ] Generate controller, props template, React component
- [ ] Auto-update page_to_page_mapping.ts
- [ ] Basic CRUD actions (index, show, new, edit)

### Phase 2: UI Components
- [ ] Layout component (Sidebar, Header)
- [ ] DataTable component (using TanStack Table)
- [ ] Form components (using react-hook-form + Zod)
- [ ] Pagination, Search, Filters

### Phase 3: Configuration DSL
- [ ] Resource configuration (à la Avo)
- [ ] Field types (text, email, select, etc.)
- [ ] Custom actions
- [ ] Authorization hooks

### Phase 4: Testing in skill-matrix
- [ ] Replace Avo in skill-matrix with Moba
- [ ] Test with real models and data
- [ ] Gather feedback and iterate

## Comparison with Avo

| Feature | Avo | Moba |
|---------|-----|------|
| Frontend | Rails Views + Hotwire | React + TypeScript |
| Customization | Limited to DSL | Full React flexibility |
| Data Flow | Rails helpers | Superglue props |
| Type Safety | No | Yes (TypeScript) |
| Component Library | ViewComponent | React ecosystem |
| Learning Curve | Avo DSL | React (widely known) |

## Useful Commands

```bash
# Install dependencies
bundle install
npm install

# Run tests
bundle exec rspec

# Build assets
npm run build

# Console
bin/console

# Setup
bin/setup
```

## Important Notes

1. **Asset Precompilation**: In production, run `npm run build` before deploying
2. **Superglue Version**: Using v1.0.3 (same as skill-matrix)
3. **Rails Version**: Requires Rails 7.0+, tested with Rails 8.0
4. **Ruby Version**: 3.4.2 (as per .tool-versions)
5. **Node Version**: 22.13.1 (as per .tool-versions)

## Reference Materials

- **skill-matrix**: `/Users/luca/monade/skill-matrix` - Production app using same stack
- **Superglue Docs**: https://thoughtbot.github.io/superglue/
- **Avo**: https://avohq.io/ - Inspiration for DSL and features
- **TanStack Table**: https://tanstack.com/table - For data tables
- **react-hook-form**: https://react-hook-form.com/ - For forms

## Troubleshooting

### Superglue Import Errors
Use `rootReducer` export, not direct `superglue`/`pages`:
```typescript
import { rootReducer } from "@thoughtbot/superglue";
const { pages, superglue } = rootReducer;
```

### Page Not Found
Check `page_to_page_mapping.ts` has the correct controller/action key:
```typescript
"moba/controller_name/action_name": ComponentName
```

### Props Not Showing
Ensure `.json.props` template exists and controller sets instance variables.

---

**Last Updated**: 2026-02-26
**Version**: 0.1.0
