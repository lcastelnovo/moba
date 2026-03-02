
---

## Current Project Status (2026-02-26)

### ✅ What's Working

1. **Rails Engine Setup**
   - ✅ Isolated namespace (`Moba::`)
   - ✅ Routes configured (`/admin` → `dashboard#index`)
   - ✅ Superglue gem integrated
   - ✅ RSpec test framework configured
   - ✅ Dummy Rails app for testing

2. **React + TypeScript Frontend**
   - ✅ React 19 + TypeScript with strict mode
   - ✅ Redux store with Superglue reducers
   - ✅ esbuild bundling working
   - ✅ JavaScript assets compile successfully (1.1MB bundle)
   - ✅ Page-to-component mapping system

3. **Superglue Integration**
   - ✅ `use_jsx_rendering_defaults` in ApplicationController
   - ✅ `superglue_template` configured
   - ✅ `.json.props` templates working
   - ✅ **JSON API responses working** (`curl http://localhost:3002/admin` returns `{"message":"Welcome to Moba Admin Panel"}`)

4. **Controller & Views**
   - ✅ `DashboardController#index` action
   - ✅ `app/views/moba/dashboard/index.json.props` template
   - ✅ `app/views/moba/dashboard/index.tsx` React component
   - ✅ `app/views/moba/application/superglue.html.erb` bootstrap template

### ❌ Known Issues

1. **HTML Rendering Error**
   - **Problem**: When requesting HTML (`Accept: text/html`), server returns 500 error
   - **Root Cause**: Template rendering issue with `render_props` or layout resolution
   - **JSON works**: API endpoint returns correct JSON when format is JSON
   - **Next Steps**: Debug template path resolution in Rails Engine context

2. **Asset Loading**
   - Assets are manually copied to `spec/dummy/public/`
   - Need proper asset pipeline integration for production

### 🔧 What's Missing

1. **HTML Rendering Fix**
   - Resolve template/layout path issues
   - Ensure `render_props` helper works correctly in engine context

2. **Browser Testing**
   - Verify React app loads in browser
   - Test Superglue navigation between pages
   - Verify Redux store updates

3. **Production Asset Pipeline**
   - Configure asset precompilation
   - Setup proper asset serving from engine

4. **CRUD Functionality**
   - No resource scaffolding yet
   - No form components
   - No data tables
   - No generators

### 📝 Key Learnings

#### Critical Discovery: Superglue Dual Dependency

**IMPORTANT**: Discovered that Superglue requires BOTH:
- `superglue` Ruby gem (for Rails integration)
- `@thoughtbot/superglue` NPM package (for React)

Initially used only `props_template` gem, which was incorrect. The `superglue` gem provides:
- `use_jsx_rendering_defaults` before_action
- `render_props` helper method
- `superglue_template` DSL
- Automatic format handling (HTML vs JSON)

#### From skill-matrix Analysis

Studied `/Users/luca/monade/skill-matrix` to understand:
1. **No `props_template` in Gemfile** - Uses `superglue` gem instead
2. **Controllers use `use_jsx_rendering_defaults`** - Not custom implementation
3. **Template structure**: `app/views/application/superglue.html.erb` (not in `application/` subfolder)
4. **No explicit respond_to blocks** - Superglue handles format automatically

### 🚀 Next Development Steps

#### Phase 1: Fix HTML Rendering (IMMEDIATE)
1. Debug template path resolution
2. Verify layout inheritance in engine
3. Test browser loading of React app
4. Confirm Superglue navigation works

#### Phase 2: Resource Generator (Week 1-2)
1. Create `rails g moba:resource User` generator
2. Generate controller, props template, React component
3. Auto-update `page_to_page_mapping.ts`
4. Basic index/show actions

#### Phase 3: UI Components (Week 2-3)
1. Layout component (Sidebar, Header)
2. DataTable with TanStack Table
3. Form components (react-hook-form + Zod)
4. Pagination, Search, Filters

#### Phase 4: DSL & Configuration (Week 3-4)
1. Resource configuration DSL (à la Avo)
2. Field types (text, email, select, etc.)
3. Custom actions
4. Authorization hooks (CanCanCan/Pundit)

### 🧪 Testing Strategy

**Current Test Coverage**:
- ✅ Basic gem configuration tests
- ❌ No controller tests yet
- ❌ No integration tests
- ❌ No JavaScript tests

**Needed Tests**:
1. Controller specs for dashboard
2. Request specs for JSON responses
3. System specs for browser interactions
4. JavaScript unit tests for React components

### 📦 File Structure Summary

```
moba/
├── lib/
│   ├── moba.rb                          # ✅ Configuration system
│   ├── moba/
│   │   ├── version.rb                   # ✅ Version 0.1.0
│   │   └── engine.rb                    # ✅ Rails Engine + superglue require
│
├── app/
│   ├── controllers/moba/
│   │   ├── application_controller.rb    # ✅ use_jsx_rendering_defaults
│   │   └── dashboard_controller.rb      # ✅ Basic index action
│   │
│   ├── views/moba/
│   │   ├── application/
│   │   │   └── superglue.html.erb       # ✅ Bootstrap template
│   │   └── dashboard/
│   │       ├── index.json.props         # ✅ Props template
│   │       └── index.tsx                # ✅ React component
│   │
│   ├── javascript/moba/
│   │   ├── application.tsx              # ✅ React entry point
│   │   ├── application_visit.ts         # ✅ Visit/remote handlers
│   │   ├── store.ts                     # ✅ Redux store
│   │   ├── page_to_page_mapping.ts      # ✅ Route→component mapping
│   │   └── hooks/
│   │       └── useContent.ts            # ✅ Wrapper for superglue hook
│   │
│   └── assets/
│       ├── stylesheets/moba/application.css  # ✅ Basic CSS
│       └── builds/                           # ✅ Compiled assets
│           ├── moba.js                       # ✅ 1.1MB bundle
│           └── moba.css                      # ✅ Styles
│
├── config/routes.rb                     # ✅ Engine routes
├── spec/                                # ✅ RSpec setup
│   ├── dummy/                           # ✅ Test Rails app
│   │   ├── config/                      # ✅ Database, environments
│   │   └── public/                      # ✅ Static assets (manual copy)
│   ├── moba_spec.rb                     # ✅ Basic tests
│   └── rails_helper.rb                  # ✅ Rails test setup
│
├── moba.gemspec                         # ✅ Gem specification
├── package.json                         # ✅ NPM dependencies
├── tsconfig.json                        # ✅ TypeScript config
├── CLAUDE.md                            # ✅ This file
└── README.md                            # ⚠️ Needs update
```

### 💡 Commands Reference

```bash
# Install dependencies
bundle install
npm install

# Build assets
npm run build              # JavaScript
npm run build:css          # CSS (currently just copies)

# Run tests
bundle exec rspec

# Start test server
cd spec/dummy
bundle exec rackup -p 3002

# Test endpoints
curl http://localhost:3002/admin                    # Returns JSON
curl -H "Accept: text/html" http://localhost:3002/admin  # Returns error (needs fix)
```

### 🐛 Debugging Notes

**Server Logs Location**: `spec/dummy/log/development.log` (currently not created)

**Common Issues**:
1. `render_props` undefined → Missing `superglue` gem
2. `use_jsx_rendering_defaults` undefined → Missing `superglue` gem
3. Template not found → Check namespace paths (`moba/` prefix)

---

**Last Updated**: 2026-02-26 22:15
**Status**: JSON API working, HTML rendering needs fix
**Next Session**: Debug HTML template rendering, test in browser
