# frozen_string_literal: true

module Moba
  class ApplicationController < ActionController::Base
    protect_from_forgery with: :exception
    before_action :use_jsx_rendering_defaults

    superglue_template "moba/application/superglue"

    # Override this in your application
    def current_user
      send(Moba.configuration.current_user_method) if Moba.configuration
    rescue NoMethodError
      nil
    end
    helper_method :current_user
  end
end
