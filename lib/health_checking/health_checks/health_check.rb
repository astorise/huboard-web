module HealthChecking
  module HealthChecks
   module HealthCheck

      def self.included(base)
        base.extend ClassMethods
        base.class_attribute :_weight
        base.class_attribute :_authorization
        base.class_attribute :_name
        base.class_attribute :_message
        base.class_attribute :_pass
        base.class_attribute :_fail
      end

      module ClassMethods
        extend self

        def weight(weight)
          self._weight = weight
        end

        def authorization(authorization)
          self._authorization = authorization
        end

        def name(name)
          self._name = name
        end

        def message(message)
          self._message = message
        end

        def passed(message)
          self._pass = message
        end

        def failed(message)
          self._fail = message
        end

      end
    end
  end
end
