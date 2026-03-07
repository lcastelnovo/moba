# frozen_string_literal: true

require_relative "moba/version"
require_relative "moba/resource"
require_relative "moba/engine"

module Moba
  class Error < StandardError; end

  # Configuration accessor
  mattr_accessor :configuration

  def self.configure
    self.configuration ||= Configuration.new
    yield(configuration) if block_given?
  end

  # Resource registry
  mattr_accessor :resources, default: {}

  def self.register_resource(resource_class)
    key = resource_class.plural_resource_name
    resources[key] = resource_class
  end

  def self.resource_for(key)
    resources[key.to_s]
  end

  def self.registered_resources
    resources.values
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