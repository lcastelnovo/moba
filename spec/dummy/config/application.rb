# frozen_string_literal: true

require "rails/all"

Bundler.require(*Rails.groups)
require "moba"

module Dummy
  class Application < Rails::Application
    config.load_defaults Rails::VERSION::STRING.to_f
    config.eager_load = false

    # For testing
    config.secret_key_base = "test_secret_key_base"
    config.hosts.clear
  end
end
