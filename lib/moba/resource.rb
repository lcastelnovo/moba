# frozen_string_literal: true

module Moba
  class Resource
    class_attribute :model_class_name
    class_attribute :fields_config, default: []

    class << self
      def model_class=(name)
        self.model_class_name = name.to_s
      end

      def field(name, type: :text, **options)
        self.fields_config = fields_config + [{ name: name.to_sym, type: type, **options }]
      end

      def model_klass
        model_class_name.constantize
      end

      def resource_key
        model_class_name.underscore.gsub("/", "_")
      end

      def resource_name
        model_class_name.demodulize.underscore
      end

      def plural_resource_name
        resource_name.pluralize
      end

      def human_name
        model_class_name.demodulize.titleize
      end

      def plural_human_name
        human_name.pluralize
      end

      def permitted_fields
        fields_config.select { |f| f.fetch(:readonly, false) == false }.map { |f| f[:name] }
      end

      def serialized_fields
        fields_config.map do |f|
          {
            name: f[:name].to_s.camelize(:lower),
            attribute: f[:name].to_s,
            type: f[:type].to_s,
            label: f.fetch(:label, f[:name].to_s.titleize),
            required: f.fetch(:required, false),
            readonly: f.fetch(:readonly, false),
            options: f.fetch(:options, nil)
          }.compact
        end
      end
    end
  end
end