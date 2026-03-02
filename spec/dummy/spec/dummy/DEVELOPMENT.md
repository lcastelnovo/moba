# Moba - Development Log

## Session 1: Initial Setup (2026-02-26)

### Goals
- Initialize gem structure
- Setup Rails Engine with React + Superglue
- Create basic dashboard example
- Test integration

### Work Done

#### 1. Gem Initialization
```bash
bundle gem moba --test=rspec --mit --no-coc
```

**Created**:
- Basic gem structure
- RSpec test framework
- MIT license
- `.ruby-version` (3.4.2) and `.tool-versions`

#### 2. Rails Engine Configuration

**File**: `lib/moba/engine.rb`

Key decisions:
- Isolated namespace (`Moba::`)
- No asset generation (handled by esbuild)
- No helper generation
- RSpec as test framework

```ruby
module Moba
  class Engine < ::Rails::Engine
    isolate_namespace Moba
    
    config.generators do |g|
      g.test_framework :rspec
      g.assets false
      g.helper false
    end
  end
end
```

#### 3. Configuration System

**File**: `lib/moba.rb`

Implemented configuration DSL:
```ruby
Moba.configure do |config|
  config.namespace = "admin"
  config.mount_path = "/admin"
  config.current_user_method = :current_user
end
```

#### 4. React + TypeScript Setup

**Dependencies Installed**:
```json
{
  "@thoughtbot/superglue": "^1.0.3",
  "react": "^19.1.0",
  "react-dom": "^19.1.0",
  "@reduxjs/toolkit": "^2.8.2",
  "@tanstack/react-table": "^8.21.3"
}
```

**Build Configuration** (`package.json`):
```json
{
  "scripts": {
    "build": "esbuild app/javascript/moba/application.tsx --bundle --outfile=app/assets/builds/moba.js --format=esm --target=es2020 --sourcemap",
    "watch": "esbuild ... --watch"
  }
}
```

#### 5. Superglue Integration

**Critical Discovery**: Superglue requires TWO packages:
1. **Ruby gem** (`superglue`) - Rails integration
2. **NPM package** (`@thoughtbot/superglue`) - React integration

Initially tried with only `props_template` gem ❌  
Fixed by adding `superglue` gem ✅

**What the `superglue` gem provides**:
- `use_jsx_rendering_defaults` - Auto-sets JSON format
- `render_props` - Serializes props for initial page state
- `superglue_template "path/to/template"` - Custom HTML template
- `.json.props` template support

#### 6. Controller Setup

**File**: `app/controllers/moba/application_controller.rb`

```ruby
module Moba
  class ApplicationController < ActionController::Base
    protect_from_forgery with: :exception
    before_action :use_jsx_rendering_defaults
    
    superglue_template "moba/application/superglue"
    
    def current_user
      send(Moba.configuration.current_user_method) if Moba.configuration
    rescue NoMethodError
      nil
    end
    helper_method :current_user
  end
end
```

**File**: `app/controllers/moba/dashboard_controller.rb`

Simple index action - Superglue handles format negotiation automatically:
```ruby
def index
  @message = "Welcome to Moba Admin Panel"
end
```

#### 7. Views Structure

**HTML Bootstrap Template**: `app/views/moba/application/superglue.html.erb`
```erb
<script type="text/javascript">
  window.SUPERGLUE_INITIAL_PAGE_STATE = <%= render_props.html_safe %>;
</script>

<div id="app"></div>
```

**Props Template**: `app/views/moba/dashboard/index.json.props`
```ruby
json.message @message
```

**React Component**: `app/views/moba/dashboard/index.tsx`
```typescript
import React from "react";
import { useContent } from "@moba/hooks/useContent";

type DashboardProps = {
  message: string;
};

export default function DashboardIndex() {
  const { message } = useContent<DashboardProps>();
  
  return (
    <div style={{ padding: "2rem" }}>
      <h1>Moba Admin Dashboard</h1>
      <p>{message}</p>
    </div>
  );
}
```

#### 8. Redux Store Configuration

**File**: `app/javascript/moba/store.ts`

```typescript
import { configureStore } from "@reduxjs/toolkit";
import {
  beforeVisit,
  beforeFetch,
  beforeRemote,
  rootReducer,
} from "@thoughtbot/superglue";

const { pages, superglue } = rootReducer;

export const store = configureStore({
  reducer: {
    superglue,  // Superglue navigation state
    pages,      // Page props cache
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [beforeFetch.type, beforeVisit.type, beforeRemote.type],
      },
    }),
});
```

#### 9. React Application Entry

**File**: `app/javascript/moba/application.tsx`

```typescript
import React from "react";
import { createRoot } from "react-dom/client";
import { Application, VisitResponse } from "@thoughtbot/superglue";
import { store } from "./store";
import { pageToPageMapping } from "./page_to_page_mapping";
import { buildVisitAndRemote } from "./application_visit";

if (typeof window !== "undefined") {
  document.addEventListener("DOMContentLoaded", function () {
    const appEl = document.getElementById("app");
    const location = window.location;

    if (!appEl) {
      throw new Error("Root element #app not found");
    }

    const root = createRoot(appEl);

    root.render(
      <Application
        baseUrl={location.origin}
        initialPage={window.SUPERGLUE_INITIAL_PAGE_STATE}
        path={location.pathname + location.search + location.hash}
        buildVisitAndRemote={buildVisitAndRemote}
        store={store}
        mapping={pageToPageMapping}
      />
    );
  });
}
```

#### 10. Testing Infrastructure

**Dummy Rails App**: `spec/dummy/`

Created minimal Rails app for testing:
- SQLite database configured
- Development environment setup
- Routes mounting Moba engine at `/admin`

**Commands**:
```bash
cd spec/dummy
bundle exec rake db:create db:migrate
bundle exec rackup -p 3002
```

### Problems Encountered & Solutions

#### Problem 1: `render_props` undefined
**Error**: `NameError: undefined method 'render_props'`

**Root Cause**: Only had `props_template` gem, not `superglue` gem

**Solution**: 
```ruby
# moba.gemspec
spec.add_dependency "superglue"  # Not props_template!
```

#### Problem 2: `use_jsx_rendering_defaults` undefined
**Error**: `NoMethodError: undefined method 'use_jsx_rendering_defaults'`

**Root Cause**: Same as above - missing `superglue` gem

**Solution**: Same gem dependency fix

#### Problem 3: Asset Pipeline Configuration
**Error**: `undefined method 'assets' for Rails::Application::Configuration`

**Root Cause**: Tried to configure `config.assets` in engine initializer when asset pipeline wasn't loaded

**Solution**: Removed asset pipeline config from engine, using manual asset copying for now

#### Problem 4: Superglue Import Errors
**Error**: `No matching export in superglue.mjs for import "superglue"`

**Root Cause**: Trying to import reducers directly instead of using `rootReducer`

**Solution**:
```typescript
// ❌ Wrong
import { superglue, pages } from "@thoughtbot/superglue";

// ✅ Correct
import { rootReducer } from "@thoughtbot/superglue";
const { pages, superglue } = rootReducer;
```

#### Problem 5: HTML Rendering Error
**Status**: UNRESOLVED ⚠️

**Error**: 500 error when requesting HTML format

**What Works**: JSON endpoint returns correct data

**Symptoms**:
```bash
# ✅ Works
curl http://localhost:3002/admin
# Returns: {"message":"Welcome to Moba Admin Panel"}

# ❌ Fails
curl -H "Accept: text/html" http://localhost:3002/admin
# Returns: 500 error
```

**Next Steps**:
- Debug template path resolution
- Check layout inheritance in engine context
- Verify `render_props` helper availability

### Testing Results

**What Works** ✅:
- [x] Gem structure
- [x] Rails engine loading
- [x] RSpec configuration
- [x] JavaScript bundle builds (1.1MB)
- [x] JSON API endpoint responds correctly
- [x] Props templates render
- [x] React components compile

**What Doesn't Work** ❌:
- [ ] HTML rendering (500 error)
- [ ] Browser testing (not attempted yet)
- [ ] Superglue navigation (can't test without HTML working)

### File Tree

```
moba/
├── lib/
│   ├── moba.rb                          # Main module + configuration
│   └── moba/
│       ├── version.rb                   # 0.1.0
│       └── engine.rb                    # Rails Engine
│
├── app/
│   ├── controllers/moba/
│   │   ├── application_controller.rb    # Base controller
│   │   └── dashboard_controller.rb      # Dashboard
│   │
│   ├── views/
│   │   ├── layouts/moba/
│   │   │   └── application.html.erb     # Main layout (unused?)
│   │   └── moba/
│   │       ├── application/
│   │       │   └── superglue.html.erb   # React bootstrap
│   │       └── dashboard/
│   │           ├── index.json.props     # Props template
│   │           └── index.tsx            # React component
│   │
│   ├── javascript/moba/
│   │   ├── application.tsx              # React entry
│   │   ├── application_visit.ts         # Visit handlers
│   │   ├── store.ts                     # Redux store
│   │   ├── page_to_page_mapping.ts      # Route mapping
│   │   └── hooks/
│   │       └── useContent.ts            # Custom hook
│   │
│   └── assets/
│       ├── stylesheets/moba/
│       │   └── application.css          # Basic styles
│       └── builds/
│           ├── moba.js                  # 1.1MB bundle
│           ├── moba.js.map              # Source map
│           └── moba.css                 # Compiled CSS
│
├── config/
│   └── routes.rb                        # Engine routes
│
├── spec/
│   ├── dummy/                           # Test Rails app
│   │   ├── config/
│   │   │   ├── application.rb
│   │   │   ├── boot.rb
│   │   │   ├── database.yml
│   │   │   ├── environment.rb
│   │   │   ├── routes.rb
│   │   │   └── environments/
│   │   │       └── development.rb
│   │   ├── db/
│   │   │   └── development.sqlite3
│   │   ├── public/
│   │   │   ├── moba.js                  # Copied from builds
│   │   │   └── moba.css                 # Copied from builds
│   │   ├── Rakefile
│   │   └── config.ru
│   │
│   ├── moba_spec.rb                     # Gem tests
│   ├── spec_helper.rb                   # RSpec config
│   └── rails_helper.rb                  # Rails test config
│
├── moba.gemspec                         # Gem specification
├── package.json                         # NPM dependencies
├── package-lock.json                    # NPM lockfile
├── tsconfig.json                        # TypeScript config
├── Gemfile                              # Ruby dependencies
├── Gemfile.lock                         # Ruby lockfile
├── .gitignore                           # Git ignore rules
├── .rspec                               # RSpec options
├── .tool-versions                       # asdf versions
├── LICENSE.txt                          # MIT license
├── README.md                            # Project readme
├── CLAUDE.md                            # Context for Claude
└── DEVELOPMENT.md                       # This file
```

### Dependencies Installed

**Ruby Gems**:
```
rails (8.1.2)
superglue (1.1.1)
props_template (via superglue)
form_props (0.2.2, via superglue)
puma (6.6.1)
rspec-rails (7.1.1)
sqlite3 (2.9.0)
```

**NPM Packages**:
```
@thoughtbot/superglue (1.0.3)
react (19.1.0)
react-dom (19.1.0)
@reduxjs/toolkit (2.8.2)
@tanstack/react-table (8.21.3)
typescript (5.8.2)
esbuild (0.24.0)
```

### Next Session TODO

1. **Fix HTML Rendering** (CRITICAL)
   - [ ] Debug template path resolution
   - [ ] Check layout configuration
   - [ ] Verify `render_props` in engine context
   - [ ] Test in browser

2. **Asset Pipeline**
   - [ ] Proper asset precompilation
   - [ ] Remove manual copying workaround
   - [ ] Configure for production

3. **Browser Testing**
   - [ ] Load app in browser
   - [ ] Verify React renders
   - [ ] Test Superglue navigation
   - [ ] Check Redux DevTools

4. **First Generator**
   - [ ] Create `rails g moba:resource` generator
   - [ ] Generate controller, views, component
   - [ ] Update page mapping automatically

### Resources Used

- **skill-matrix**: `/Users/luca/monade/skill-matrix` - Reference implementation
- **Superglue Docs**: https://thoughtbot.github.io/superglue/
- **Avo Gem**: https://avohq.io/ - Inspiration for DSL
- **TanStack Table**: https://tanstack.com/table - For data tables

---

**Session Duration**: ~2 hours  
**Lines of Code**: ~500  
**Files Created**: ~30  
**Problems Solved**: 4/5 (1 remaining)  
**Status**: 80% functional, needs HTML rendering fix
