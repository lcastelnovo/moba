# frozen_string_literal: true

Rails.application.routes.draw do
  mount Moba::Engine => "/admin"
end
