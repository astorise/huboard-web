class Huboard
  module Hooks
    def hook_exists?
      return true if gh.hooks.raw.status == 404
      gh.hooks.any? { |x| x['name'] == 'huboard' }
    end

    def hook
      gh.hooks.select{|h| h['name'] == 'huboard' }.first
    end

    def delete_hook(id)
      gh.hooks(id).destroy
    end

    def create_hook
      return :message => "hook already exists", :success => false if hook_exists?

      gh.hooks.create(
        {
          name: 'huboard',
          config: {},
          events: [
            "issue_comment",
            "issues",
          ],
          active: true,
        }
      )
    end
  end
end
