# frozen_string_literal: true

class UserResource < Moba::Resource
  self.model_class = "User"

  field :first_name, type: :text, required: true
  field :last_name, type: :text, required: true
  field :email, type: :email, required: true
  field :role, type: :select, options: %w[user admin manager]
end

Moba.register_resource(UserResource)
