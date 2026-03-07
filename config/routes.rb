# frozen_string_literal: true

Moba::Engine.routes.draw do
  root to: "dashboard#index"

  scope ":resource_id" do
    get "/", to: "resources#index", as: :resources
    get "/new", to: "resources#new", as: :new_resource
    post "/", to: "resources#create"
    get "/:id", to: "resources#show", as: :resource
    get "/:id/edit", to: "resources#edit", as: :edit_resource
    patch "/:id", to: "resources#update"
    delete "/:id", to: "resources#destroy"
  end
end
