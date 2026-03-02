# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Initial Rails Engine setup with isolated namespace
- React 19 + TypeScript integration
- Superglue integration (both Ruby gem and NPM package)
- Redux store with Superglue reducers
- Basic dashboard controller and view
- Props template system (`.json.props` files)
- React component structure
- esbuild JavaScript bundling
- RSpec testing framework
- Dummy Rails app for testing
- Configuration system (`Moba.configure`)
- Custom `useContent` hook for accessing page props
- Documentation (CLAUDE.md, DEVELOPMENT.md, README.md)

### Fixed
- Superglue imports using `rootReducer` instead of direct exports
- Engine configuration to avoid asset pipeline conflicts

### Known Issues
- HTML rendering returns 500 error (JSON API works correctly)
- Asset precompilation not configured for production
- Manual asset copying required for dummy app

## [0.1.0] - 2026-02-26

### Summary
Initial development session. Created gem structure, integrated React + Superglue, and got JSON API working.

**Status**: 80% functional - JSON API working, HTML rendering needs debugging

### Technical Details

#### Dependencies
- Ruby: 3.4.2
- Rails: 8.1.2
- React: 19.1.0
- Superglue (gem): 1.1.1
- Superglue (npm): 1.0.3
- TypeScript: 5.8.2
- esbuild: 0.24.0

#### Files Created
- 30+ files
- ~500 lines of code
- Complete gem structure

#### What Works
- ✅ Rails Engine loads
- ✅ JSON API endpoint (`GET /admin` returns correct JSON)
- ✅ Props templates render
- ✅ React components compile
- ✅ JavaScript bundle builds (1.1MB)
- ✅ RSpec tests pass

#### What Doesn't Work
- ❌ HTML rendering (500 error with `Accept: text/html`)
- ❌ Browser testing (not attempted yet)

### Credits
- Inspired by Avo gem
- Built with Superglue by thoughtbot
- Reference implementation: skill-matrix (Monade internal)

---

[Unreleased]: https://github.com/monade/moba/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/monade/moba/releases/tag/v0.1.0
