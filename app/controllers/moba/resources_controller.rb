# frozen_string_literal: true

module Moba
  class ResourcesController < ApplicationController
    before_action :set_resource_class
    before_action :set_record, only: %i[show edit update destroy]

    def index
      @records = @resource_class.model_klass.all
      @fields = @resource_class.serialized_fields
      @filters = (params[:filters]&.permit!&.to_h || {}).select { |_, v| v.present? }

      @filters.each do |field_name, value|
        field_config = @resource_class.fields_config.find { |f| f[:name].to_s == field_name }
        next unless field_config
        next unless field_config.fetch(:filterable, false)

        if field_config[:options]
          @records = @records.where(field_name => value)
        else
          @records = @records.where("LOWER(#{@resource_class.model_klass.connection.quote_column_name(field_name)}) LIKE ?", "%#{value.downcase}%")
        end
      end
    end

    def show
      @fields = @resource_class.serialized_fields
    end

    def new
      @record = @resource_class.model_klass.new
      @fields = @resource_class.serialized_fields
      @errors = {}
    end

    def create
      @record = @resource_class.model_klass.new(record_params)

      if @record.save
        flash[:success] = "#{@resource_class.human_name} created successfully."
        redirect_to moba.resources_path(resource_id: params[:resource_id])
      else
        @fields = @resource_class.serialized_fields
        @errors = @record.errors.messages.transform_keys { |k| k.to_s.camelize(:lower) }
        render :new
      end
    end

    def edit
      @fields = @resource_class.serialized_fields
      @errors = {}
    end

    def update
      if @record.update(record_params)
        flash[:success] = "#{@resource_class.human_name} updated successfully."
        redirect_to moba.resources_path(resource_id: params[:resource_id])
      else
        @fields = @resource_class.serialized_fields
        @errors = @record.errors.messages.transform_keys { |k| k.to_s.camelize(:lower) }
        render :edit
      end
    end

    def destroy
      @record.destroy
      flash[:success] = "#{@resource_class.human_name} deleted successfully."
      redirect_to moba.resources_path(resource_id: params[:resource_id])
    end

    private

    def set_resource_class
      @resource_class = Moba.resource_for(params[:resource_id])
      raise ActionController::RoutingError, "Resource not found: #{params[:resource_id]}" unless @resource_class
    end

    def set_record
      @record = @resource_class.model_klass.find(params[:id])
    end

    def record_params
      params.require(:record).permit(*@resource_class.permitted_fields)
    end
  end
end
