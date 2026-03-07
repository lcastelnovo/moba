# frozen_string_literal: true

require "rails"
require "superglue"

module Moba
  class Engine < ::Rails::Engine
    isolate_namespace Moba

    config.generators do |g|
      g.test_framework :rspec
      g.assets false
      g.helper false
    end

    initializer "moba.assets" do |app|
      if app.config.respond_to?(:assets)
        app.config.assets.paths << root.join("app", "assets", "builds")
        app.config.assets.precompile += %w[moba.js moba.css]
      end
    end

    initializer "moba.superglue_resolver" do
      engine_views_path = root.join("app", "views")

      config.to_prepare do
        Moba::ApplicationController.prepend_view_path(
          Superglue::Resolver.new(engine_views_path)
        )
      end
    end

    config.to_prepare do
      # Load resource definitions from host app
      resource_paths = Rails.root.join("app", "moba", "resources")
      if resource_paths.exist?
        Dir[resource_paths.join("**", "*.rb")].sort.each do |file|
          require_dependency file
        end
      end
    end
  end
end
