# frozen_string_literal: true

module Moba
  class DashboardController < ApplicationController
    def index
      @message = "Welcome to Moba Admin Panel"
    end
  end
end
