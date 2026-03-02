# frozen_string_literal: true

RSpec.describe Moba do
  it "has a version number" do
    expect(Moba::VERSION).not_to be nil
  end

  describe ".configure" do
    it "yields a configuration object" do
      expect { |b| Moba.configure(&b) }.to yield_with_args(Moba::Configuration)
    end

    it "sets default configuration values" do
      config = Moba::Configuration.new
      expect(config.namespace).to eq("admin")
      expect(config.mount_path).to eq("/admin")
      expect(config.current_user_method).to eq(:current_user)
    end
  end
end
