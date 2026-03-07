# frozen_string_literal: true

require_relative "lib/moba/version"

Gem::Specification.new do |spec|
  spec.name = "moba"
  spec.version = Moba::VERSION
  spec.authors = ["lu.cas"]
  spec.email = ["luca@monade.io"]

  spec.summary = "Modern admin panel for Rails using React and Superglue"
  spec.description = "Moba is a Rails engine that generates beautiful, customizable admin panels using React, TypeScript, and Superglue for seamless server-client data flow."
  spec.homepage = "https://github.com/lcastelnovo/moba"
  spec.license = "MIT"
  spec.required_ruby_version = ">= 3.1.0"

  spec.metadata["homepage_uri"] = spec.homepage
  spec.metadata["source_code_uri"] = "https://github.com/lcastelnovo/moba"
  spec.metadata["changelog_uri"] = "https://github.com/lcastelnovo/moba/blob/main/CHANGELOG.md"

  # Specify which files should be added to the gem when it is released.
  # The `git ls-files -z` loads the files in the RubyGem that have been added into git.
  gemspec = File.basename(__FILE__)
  spec.files = IO.popen(%w[git ls-files -z], chdir: __dir__, err: IO::NULL) do |ls|
    ls.readlines("\x0", chomp: true).reject do |f|
      (f == gemspec) ||
        f.start_with?(*%w[bin/ test/ spec/ features/ .git appveyor Gemfile])
    end
  end
  spec.bindir = "exe"
  spec.executables = spec.files.grep(%r{\Aexe/}) { |f| File.basename(f) }
  spec.require_paths = ["lib"]

  # Runtime dependencies
  spec.add_dependency "rails", ">= 7.0"
  spec.add_dependency "superglue"
  spec.add_dependency "propshaft"

  # Development dependencies
  spec.add_development_dependency "rspec-rails", "~> 7.1"
  spec.add_development_dependency "sqlite3", "~> 2.0"
  spec.add_development_dependency "puma", "~> 6.0"
end
