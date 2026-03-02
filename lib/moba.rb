# frozen_string_literal: true

require_relative "moba/version"
require_relative "moba/engine"

module Moba
  class Error < StandardError; end

  # Configuration accessor
  mattr_accessor :configuration

  def self.configure
    self.configuration ||= Configuration.new
    yield(configuration) if block_given?
  end

  class Configuration
    attr_accessor :namespace, :mount_path, :current_user_method

    def initialize
      @namespace = "admin"
      @mount_path = "/admin"
      @current_user_method = :current_user
    end
  end
end
