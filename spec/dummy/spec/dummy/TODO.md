# Moba TODO List

## 🔥 Critical (Next Session)

### 1. Fix HTML Rendering
**Priority**: HIGHEST  
**Status**: Blocking browser testing

**Tasks**:
- [ ] Debug template path resolution in Rails Engine
- [ ] Verify `render_props` helper is available in view context
- [ ] Check layout inheritance (`superglue_template` configuration)
- [ ] Test with different template locations
- [ ] Add logging to understand rendering flow

**Success Criteria**:
```bash
curl -H "Accept: text/html" http://localhost:3002/admin
# Should return HTML with React bootstrap, not 500 error
```

### 2. Browser Testing
**Priority**: HIGH  
**Depends On**: HTML rendering fix

**Tasks**:
- [ ] Open browser to `http://localhost:3002/admin`
- [ ] Verify React app renders
- [ ] Check browser console for errors
- [ ] Test Redux DevTools integration
- [ ] Verify initial props are loaded
- [ ] Test clicking around (Superglue navigation)

**Success Criteria**:
- Dashboard renders "Welcome to Moba Admin Panel"
- No JavaScript errors in console
- Redux store shows correct state

## 📦 Phase 1: Core Functionality (Week 1)

### 3. Asset Pipeline Configuration
**Priority**: MEDIUM

**Tasks**:
- [ ] Configure proper asset precompilation
- [ ] Remove manual asset copying hack
- [ ] Setup asset serving from engine
- [ ] Configure for production environment
- [ ] Add asset fingerprinting

**Files to Update**:
- `lib/moba/engine.rb` - Asset configuration
- `moba.gemspec` - Include assets in gem files

### 4. Layout Component
**Priority**: MEDIUM

**Tasks**:
- [ ] Create `Layout.tsx` component
- [ ] Add Sidebar navigation
- [ ] Add Header with user menu
- [ ] Add main content area
- [ ] Style with basic CSS (or Tailwind)

**Files to Create**:
- `app/javascript/moba/components/Layout.tsx`
- `app/assets/stylesheets/moba/layout.css`

### 5. Improve Documentation
**Priority**: LOW

**Tasks**:
- [ ] Add API documentation
- [ ] Document controller conventions
- [ ] Add examples to README
- [ ] Create contribution guide
- [ ] Add troubleshooting section

## 🚀 Phase 2: Resource Generation (Week 2)

### 6. Resource Generator
**Priority**: HIGH

**Tasks**:
- [ ] Create `rails g moba:resource` generator
- [ ] Generate controller with CRUD actions
- [ ] Generate props templates (index, show, new, edit)
- [ ] Generate React components
- [ ] Auto-update `page_to_page_mapping.ts`
- [ ] Add TypeScript types generation

**Example Usage**:
```bash
rails generate moba:resource User name:string email:string role:enum
```

**Should Generate**:
- `app/controllers/moba/users_controller.rb`
- `app/views/moba/users/index.json.props`
- `app/views/moba/users/index.tsx`
- `app/views/moba/users/show.json.props`
- `app/views/moba/users/show.tsx`
- Update `app/javascript/moba/page_to_page_mapping.ts`

### 7. Index View Template
**Priority**: HIGH

**Tasks**:
- [ ] Create generic index component
- [ ] Add basic data table
- [ ] Add pagination controls
- [ ] Add search/filter UI
- [ ] Add "New" button

**Files to Create**:
- `app/javascript/moba/components/ResourceIndex.tsx`

### 8. Show View Template
**Priority**: MEDIUM

**Tasks**:
- [ ] Create generic show component
- [ ] Display field values
- [ ] Add "Edit" and "Delete" buttons
- [ ] Add back navigation

**Files to Create**:
- `app/javascript/moba/components/ResourceShow.tsx`

## 📊 Phase 3: UI Components (Week 3)

### 9. DataTable Component
**Priority**: HIGH

**Tasks**:
- [ ] Integrate TanStack Table
- [ ] Add column sorting
- [ ] Add row selection
- [ ] Add filtering
- [ ] Add pagination
- [ ] Add bulk actions
- [ ] Make it responsive

**Files to Create**:
- `app/javascript/moba/components/DataTable.tsx`
- `app/javascript/moba/components/DataTable/` (sub-components)

### 10. Form Components
**Priority**: HIGH

**Tasks**:
- [ ] Integrate react-hook-form
- [ ] Add Zod validation
- [ ] Create field components:
  - [ ] TextInput
  - [ ] EmailInput
  - [ ] SelectInput
  - [ ] TextareaInput
  - [ ] CheckboxInput
  - [ ] DateInput
  - [ ] FileInput
- [ ] Add form error handling
- [ ] Add form submission states

**Files to Create**:
- `app/javascript/moba/components/Form.tsx`
- `app/javascript/moba/components/Form/` (field components)

### 11. UI Component Library
**Priority**: MEDIUM

**Tasks**:
- [ ] Decide on UI library (shadcn/ui, Radix, MUI, etc.)
- [ ] Install and configure
- [ ] Create theme system
- [ ] Document component usage

**Options to Consider**:
- shadcn/ui (Radix + Tailwind) - Used in skill-matrix ✅
- Radix UI (headless)
- MUI (Material Design)
- Chakra UI

## 🎯 Phase 4: Configuration & DSL (Week 4)

### 12. Resource Configuration DSL
**Priority**: HIGH

**Tasks**:
- [ ] Create `Moba::Resource` base class
- [ ] Add field DSL
- [ ] Add action DSL
- [ ] Add filter DSL
- [ ] Add scope DSL

**Example API**:
```ruby
class UserResource < Moba::Resource
  field :id, as: :id
  field :name, as: :text
  field :email, as: :email
  field :role, as: :select, options: User.roles.keys
  
  filter :role, as: :select
  filter :created_at, as: :date_range
  
  action :export_csv
  action :send_welcome_email
end
```

### 13. Authorization Integration
**Priority**: MEDIUM

**Tasks**:
- [ ] Add CanCanCan integration
- [ ] Add Pundit integration
- [ ] Add authorization checks to controllers
- [ ] Show/hide UI elements based on permissions

### 14. Field Types
**Priority**: MEDIUM

**Tasks**:
- [ ] Text field
- [ ] Email field
- [ ] Select field
- [ ] Textarea field
- [ ] Boolean field
- [ ] Date field
- [ ] DateTime field
- [ ] File upload field
- [ ] HasMany association field
- [ ] BelongsTo association field

## 🧪 Testing (Ongoing)

### 15. Controller Tests
**Priority**: MEDIUM

**Tasks**:
- [ ] Add request specs for dashboard
- [ ] Add controller specs for CRUD actions
- [ ] Test JSON responses
- [ ] Test HTML responses
- [ ] Test authorization

### 16. JavaScript Tests
**Priority**: LOW

**Tasks**:
- [ ] Setup Jest or Vitest
- [ ] Add component tests
- [ ] Add Redux tests
- [ ] Add integration tests

### 17. System Tests
**Priority**: LOW

**Tasks**:
- [ ] Setup Capybara
- [ ] Add browser tests
- [ ] Test full user flows

## 📚 Documentation (Ongoing)

### 18. API Documentation
**Priority**: LOW

**Tasks**:
- [ ] Document controller API
- [ ] Document React components
- [ ] Document configuration options
- [ ] Add YARD docs
- [ ] Generate docs site

### 19. Guides
**Priority**: LOW

**Tasks**:
- [ ] Getting started guide
- [ ] Resource generation guide
- [ ] Customization guide
- [ ] Deployment guide
- [ ] Migration from Avo guide

## 🚢 Production Ready (Future)

### 20. Production Checklist
**Priority**: LOW

**Tasks**:
- [ ] Asset precompilation
- [ ] Production error handling
- [ ] Logging
- [ ] Monitoring
- [ ] Performance optimization
- [ ] Security audit
- [ ] Accessibility audit

### 21. Release Preparation
**Priority**: LOW

**Tasks**:
- [ ] Finalize API
- [ ] Write comprehensive tests
- [ ] Create example app
- [ ] Write documentation
- [ ] Prepare gem for RubyGems
- [ ] Create GitHub release

---

## Priority Legend

- 🔥 **HIGHEST**: Blocking all other work
- **HIGH**: Critical for MVP
- **MEDIUM**: Important but not blocking
- **LOW**: Nice to have

## Status Legend

- [ ] Not started
- [x] Completed
- 🚧 In progress
- ⏸️ Blocked
- ❌ Cancelled

---

**Last Updated**: 2026-02-26  
**Next Review**: After fixing HTML rendering
