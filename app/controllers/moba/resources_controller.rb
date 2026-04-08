# frozen_string_literal: true

module Moba
  class ResourcesController < ApplicationController
    before_action :set_resource_class
    before_action :set_record, only: %i[show edit update destroy]

    def index
      @records = @resource_class.model_klass.all
      @fields = @resource_class.serialized_fields
      @filters = (params[:filters]&.permit!&.to_h || {}).select { |_, v| v.present? }

      # Eager loading for belongs_to associations
      bt_fields = @resource_class.belongs_to_fields
      if bt_fields.any?
        @records = @records.includes(*bt_fields.map { |f| f[:association] })
      end

      # Load belongs_to options
      load_belongs_to_options

      @filters.each do |field_name, value|
        field_config = @resource_class.fields_config.find { |f| f[:name].to_s == field_name }
        next unless field_config
        next unless field_config.fetch(:filterable, false)

        if field_config[:type] == :belongs_to
          @records = @records.where("#{field_name}_id" => value)
        elsif field_config[:options]
          @records = @records.where(field_name => value)
        else
          @records = @records.where("LOWER(#{@resource_class.model_klass.connection.quote_column_name(field_name)}) LIKE ?", "%#{value.downcase}%")
        end
      end

      # Global search
      @query = params[:q]
      if @query.present?
        q = "%#{@query.downcase}%"
        filterable = @resource_class.fields_config.select { |f| f.fetch(:filterable, false) }
        text_fields = filterable.reject { |f| f[:options] || f[:type] == :belongs_to || f[:type] == :boolean }
        if text_fields.any?
          conn = @resource_class.model_klass.connection
          conditions = text_fields.map { |f| "LOWER(#{conn.quote_column_name(f[:name])}) LIKE ?" }
          @records = @records.where(conditions.join(" OR "), *([q] * text_fields.size))
        end
      end

      # Sorting
      @sort = params[:sort].to_s
      @direction = params[:direction].to_s.downcase == "desc" ? "desc" : "asc"
      sort_field = @resource_class.fields_config.find { |f| f[:name].to_s == @sort }
      if sort_field
        quoted_column = @resource_class.model_klass.connection.quote_column_name(@sort)
        @records = @records.order(Arel.sql("#{quoted_column} #{@direction}"))
      else
        @sort = nil
        @direction = nil
      end

      # Pagination
      @per_page = @resource_class.per_page
      @total_count = @records.count
      @total_pages = [(@total_count.to_f / @per_page).ceil, 1].max
      @page = [[params[:page].to_i, 1].max, @total_pages].min
      @records = @records.offset((@page - 1) * @per_page).limit(@per_page)
    end

    def show
      @fields = @resource_class.serialized_fields
      load_belongs_to_options
    end

    def new
      @record = @resource_class.model_klass.new
      @fields = @resource_class.serialized_fields
      @errors = {}
      load_belongs_to_options
    end

    def create
      @record = @resource_class.model_klass.new(record_params)

      if @record.save
        flash[:success] = "#{@resource_class.human_name} created successfully."
        redirect_to moba.resources_path(resource_id: params[:resource_id])
      else
        @fields = @resource_class.serialized_fields
        @errors = @record.errors.messages.transform_keys { |k| k.to_s.camelize(:lower) }
        load_belongs_to_options
        render :new
      end
    end

    def edit
      @fields = @resource_class.serialized_fields
      @errors = {}
      load_belongs_to_options
    end

    def update
      if @record.update(record_params)
        flash[:success] = "#{@resource_class.human_name} updated successfully."
        redirect_to moba.resources_path(resource_id: params[:resource_id])
      else
        @fields = @resource_class.serialized_fields
        @errors = @record.errors.messages.transform_keys { |k| k.to_s.camelize(:lower) }
        load_belongs_to_options
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

    def load_belongs_to_options
      @belongs_to_options = {}
      @resource_class.belongs_to_fields.each do |f|
        assoc_class = @resource_class.model_klass.reflect_on_association(f[:association]).klass
        display = f[:display] || :name
        @belongs_to_options[f[:name].to_s.camelize(:lower)] = assoc_class.pluck(:id, display).map do |id, label|
          { id: id, label: label.to_s }
        end
      end
    end
  end
end
