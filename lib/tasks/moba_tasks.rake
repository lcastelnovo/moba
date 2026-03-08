# frozen_string_literal: true

# Auto-build Moba assets when running assets:precompile
if Rake::Task.task_defined?("assets:precompile")
  Rake::Task["assets:precompile"].enhance(["moba:assets:build"])
end

namespace :moba do
  namespace :assets do
    desc "Build Moba admin panel assets (JS + CSS)"
    task :build do
      gem_path = Bundler.definition.specs.find { |s| s.name == "moba" }&.full_gem_path
      abort("Could not find moba gem path") unless gem_path

      puts "Building Moba assets in #{gem_path}..."

      Dir.chdir(gem_path) do
        system("npm install --prefer-offline --no-audit") || abort("npm install failed")
        system("npm run build") || abort("JS build failed")
        system("npm run build:css") || abort("CSS build failed")
      end

      puts "Moba assets built successfully!"
    end

    desc "Watch Moba assets for changes (development)"
    task :watch do
      gem_path = Bundler.definition.specs.find { |s| s.name == "moba" }&.full_gem_path
      abort("Could not find moba gem path") unless gem_path

      puts "Watching Moba assets in #{gem_path}..."

      Dir.chdir(gem_path) do
        system("npm install --prefer-offline --no-audit") || abort("npm install failed")

        pids = []
        pids << spawn("npm run watch")
        pids << spawn("npx @tailwindcss/cli -i app/assets/stylesheets/moba/application.css -o app/assets/builds/moba.css --watch")

        trap("INT") do
          pids.each { |pid| Process.kill("INT", pid) rescue nil }
          exit
        end

        pids.each { |pid| Process.wait(pid) }
      end
    end
  end
end
