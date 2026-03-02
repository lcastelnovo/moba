# Moba

> Modern admin panel for Rails using React, TypeScript, and Superglue

Moba is a Rails engine that provides a beautiful, customizable admin interface powered by React 19 and TypeScript. It's designed as a modern alternative to Avo, offering full React flexibility while maintaining seamless Rails integration through Superglue.

⚠️ **Status**: Early Development (v0.1.0)  
✅ **JSON API**: Working  
🚧 **HTML Rendering**: In Progress  
📦 **Not Yet Published**: Internal project for Monade

## Features (Planned)

- 🎨 **Modern UI**: React 19 + TypeScript with full type safety
- 🔄 **Superglue Integration**: Server-driven React with props-based data flow
- 📊 **Data Tables**: TanStack Table with sorting, filtering, pagination
- 📝 **Forms**: react-hook-form + Zod validation
- 🎯 **Type-Safe**: Full TypeScript support
- 🚀 **Fast**: Redux-powered state management
- 🔧 **Customizable**: Full React component flexibility
- 📦 **Rails Engine**: Easy integration with existing Rails apps

## Current Status

### What's Working ✅

- Rails Engine setup with isolated namespace
- React 19 + TypeScript + Superglue integration
- Redux store with Superglue reducers
- JSON API endpoints
- Props templates (`.json.props`)
- JavaScript bundling with esbuild
- Basic dashboard example

### Known Issues ❌

- HTML rendering needs debugging (500 error)
- Asset pipeline needs production configuration
- No generators yet
- No UI components library yet

## Quick Start (for Development)

### Prerequisites

- Ruby 3.4.2
- Node.js 22.13.1
- Rails 8.0+

### Installation

```bash
# Clone the repository
git clone https://github.com/monade/moba.git
cd moba

# Install dependencies
bundle install
npm install

# Build JavaScript assets
npm run build

# Run tests
bundle exec rspec

# Start test server
cd spec/dummy
bundle exec rackup -p 3002
```

### Test the API

```bash
# Test JSON endpoint (works)
curl http://localhost:3002/admin

# Returns:
# {"message":"Welcome to Moba Admin Panel"}
```

## Architecture

### Stack

- **Backend**: Rails 8.0 Engine
- **Frontend**: React 19 + TypeScript
- **State**: Redux Toolkit + Superglue reducers
- **Bundler**: esbuild
- **Data Flow**: Superglue (server-driven React)
- **Templates**: Jbuilder (`.json.props`)
- **Testing**: RSpec

### Key Concept: Superglue

Superglue enables server-driven React applications:

1. **Controller** sets instance variables
2. **Props template** (`.json.props`) serializes data to JSON
3. **Superglue** dispatches Redux action with props
4. **React component** reads props from Redux store via `useContent()`

**No separate API needed** - Controllers serve both HTML and JSON automatically.

## Project Structure

```
moba/
├── lib/moba/           # Gem logic
├── app/
│   ├── controllers/    # Rails controllers
│   ├── views/          # Props templates + React components
│   ├── javascript/     # React app
│   └── assets/         # Compiled assets
├── spec/dummy/         # Test Rails app
└── config/routes.rb    # Engine routes
```

## Usage (Planned)

```ruby
# Gemfile
gem 'moba', path: '/path/to/moba'  # or from GitHub when published

# config/routes.rb
mount Moba::Engine => "/admin"

# Generate a resource
rails generate moba:resource User

# Configure
Moba.configure do |config|
  config.namespace = "admin"
  config.mount_path = "/admin"
  config.current_user_method = :current_user
end
```

## Development

### Build Assets

```bash
npm run build       # Build JavaScript
npm run build:css   # Build CSS
npm run watch       # Watch mode for development
```

### Run Tests

```bash
bundle exec rspec
```

### Documentation

- **[CLAUDE.md](CLAUDE.md)** - Full context and architecture
- **[DEVELOPMENT.md](DEVELOPMENT.md)** - Development log and technical details

## Comparison with Avo

| Feature | Avo | Moba |
|---------|-----|------|
| Frontend | Rails Views + Hotwire | React + TypeScript |
| Customization | Limited DSL | Full React flexibility |
| Type Safety | No | Yes (TypeScript) |
| State | Rails session | Redux |
| Learning Curve | Avo DSL | React (widely known) |
| Bundle Size | Heavy | Lean (tree-shakeable) |

## Roadmap

### Phase 1: Core Functionality (Current)
- [x] Rails Engine setup
- [x] React + TypeScript integration
- [x] Superglue configuration
- [x] Basic dashboard
- [ ] Fix HTML rendering
- [ ] Browser testing

### Phase 2: Resource Generation (Next)
- [ ] Resource generator (`rails g moba:resource`)
- [ ] CRUD scaffolding
- [ ] Auto-update route mapping

### Phase 3: UI Components
- [ ] Layout (Sidebar, Header)
- [ ] DataTable component
- [ ] Form components
- [ ] Pagination, Search, Filters

### Phase 4: Configuration DSL
- [ ] Resource configuration (à la Avo)
- [ ] Field types
- [ ] Custom actions
- [ ] Authorization hooks

## Contributing

This is currently an internal project for Monade. We may open-source it in the future.

## License

MIT License - see [LICENSE.txt](LICENSE.txt)

## Credits

- **Inspiration**: [Avo](https://avohq.io/)
- **Technology**: [Superglue](https://thoughtbot.github.io/superglue/) by thoughtbot
- **Reference**: skill-matrix (Monade internal project)

---

**Made with ❤️ by [Monade](https://monade.io)**
