# frozen_string_literal: true

User.find_or_create_by!(email: "admin@example.com") do |u|
  u.first_name = "Admin"
  u.last_name = "User"
  u.role = "admin"
end

User.find_or_create_by!(email: "john@example.com") do |u|
  u.first_name = "John"
  u.last_name = "Doe"
  u.role = "user"
end

User.find_or_create_by!(email: "jane@example.com") do |u|
  u.first_name = "Jane"
  u.last_name = "Smith"
  u.role = "manager"
end

puts "Seeded #{User.count} users"
