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
  end
end
