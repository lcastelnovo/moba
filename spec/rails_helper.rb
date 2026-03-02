# frozen_string_literal: true

ENV["RAILS_ENV"] = "test"

require "spec_helper"

# Load the dummy Rails app
require File.expand_path("dummy/config/environment", __dir__)

require "rspec/rails"

# Load support files
Dir[File.join(__dir__, "support/**/*.rb")].each { |f| require f }

RSpec.configure do |config|
  config.use_transactional_fixtures = true
  config.infer_spec_type_from_file_location!
  config.filter_rails_from_backtrace!
end
