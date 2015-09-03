Rails.application.routes.draw do
  constraints subdomain: 'www' do
      get ':any', to: redirect(subdomain: nil, path: '/%{any}'), any: /.*/
  end
  root to: 'dashboard#index', constraints: LoggedInConstraint.new 
  root to: 'marketing#index', as: 'marketing_root'

  get '/site/terms' => 'site#terms'
  get '/site/privacy' => 'site#privacy'

  # errors
  match '/404', to: 'errors#not_found', constraints: { status: /\d{3}/ }, via: :all
  match '/422', to: 'errors#unprocessable_entity', constraints: { status: /\d{3}/ }, via: :all
  match '/500', to: 'errors#server_error', constraints: { status: /\d{3}/ }, via: :all
  match '/403', to: 'errors#server_error', constraints: { status: /\d{3}/ }, via: :all
  match 'unauthenticated', to: 'errors#unauthenticated', via: :all

  get 'integrations' => 'marketing#integrations'
  get 'pricing' => 'marketing#pricing'
  get 'login' => 'login#index'
  get 'logout' => 'login#logout'
  get 'login/public' => 'login#public'
  get 'login/private' => 'login#private'

  get '/repositories/private/:user' => 'dashboard#private', as: 'repositories_private'

  get '/repositories/public/:user' => 'dashboard#public', as: 'repositories_public'


  namespace :api do
    get 'uploads/asset' => 'uploads#asset_uploader'

    scope '/v2/:user/:repo' do
      constraints(:user => /[^\/]+/, :repo => /[^\/]+/) do
        get '/' => 'repos#show'
        get 'issues' => 'repos#issues' 
        get 'board' => 'repos#board', as: 'v2_board'
      end
    end

    scope '/:user/:repo' do
      constraints(:user => /[^\/]+/, :repo => /[^\/]+/) do
        get 'hooks' => 'webhooks#hooks'
        resources :integrations, only: [:index, :create, :destroy]
        resources :milestones, only: [:create, :update]
        resources :links, only: [:index, :create]
        delete 'links' => 'links#destroy'
        post 'links/validate' => 'links#validate'
        put 'columns' => 'columns#update'
        get 'settings' => 'settings#index'
        get 'board' => 'board#index', as: 'board'
        get 'commits' => 'board#commits', as: 'commits'
        get 'commit/:commit' => 'board#commit', as: 'commit'
        get 'link_labels' => 'board#link_labels', as: 'link_labels'
        constraints(:linked_user => /[^\/]+/, :linked_repo => /[^\/]+/) do
          get 'linked/:linked_user/:linked_repo' => 'board#linked', as: 'linked_board'
        end

        #Issues
        get 'issues/:number' => 'issues#issue'
        get 'issues/:number/details' => 'issues#details'
        post 'issues' => 'issues#create_issue'
        post 'issues/:number/comment' => 'issues#create_comment'
        put 'issues/comments/:id' => 'issues#update_comment'
        put 'issues/:number' => 'issues#update_issue'
        post 'close' => 'issues#close_issue'
        post 'open' => 'issues#reopen_issue'
        put 'issues/:number/blocked' => 'issues#block'
        delete 'issues/:number/blocked' => 'issues#unblock'
        put 'issues/:number/ready' => 'issues#ready'
        delete 'issues/:number/ready' => 'issues#unready'
        post 'dragcard' => 'issues#drag_card'
        post 'archiveissue' => 'issues#archive_issue'
        post 'assigncard' => 'issues#assign_card'
        post 'assignmilestone' => 'issues#assign_milestone'

        post 'milestones/reorder_milestone' => 'milestones#reorder_milestone'
      end
    end

    #Webhooks
    post '/site/webhook/issue' => 'webhooks#publish_issue_event'
    post '/site/webhook/comment' => 'webhooks#log_comment'
    post '/site/stripe/webhook' => 'webhooks#stripe'
      
  end


  constraints(:user => /[^\/]+/) do
    get '/:user'       => 'dashboard#user', as: 'user'
  end

  constraints(:user => /[^\/]+/, :repo => /[^\/]+/) do
    get '/:user/:repo/board/create' => 'board#create_board'
    post '/:user/:repo/board/create' => 'board#create'

    get '/:user/:repo/board/enable_issues' => 'board#enable_issues?'
    post '/:user/:repo/board/enable_issues' => 'board#enable_issues'

    get '/:user/:repo' => 'board#index', as: 'board'
  end


  # The priority is based upon order of creation: first created -> highest priority.
  # See how all your routes lay out with "rake routes".

  # You can have the root of your site routed with "root"
  # root 'welcome#index'

  # Example of regular route:
  #   get 'products/:id' => 'catalog#view'

  # Example of named route that can be invoked with purchase_url(id: product.id)
  #   get 'products/:id/purchase' => 'catalog#purchase', as: :purchase

  # Example resource route (maps HTTP verbs to controller actions automatically):
  #   resources :products

  # Example resource route with options:
  #   resources :products do
  #     member do
  #       get 'short'
  #       post 'toggle'
  #     end
  #
  #     collection do
  #       get 'sold'
  #     end
  #   end

  # Example resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :sales
  #     resource :seller
  #   end

  # Example resource route with more complex sub-resources:
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get 'recent', on: :collection
  #     end
  #   end

  # Example resource route with concerns:
  #   concern :toggleable do
  #     post 'toggle'
  #   end
  #   resources :posts, concerns: :toggleable
  #   resources :photos, concerns: :toggleable

  # Example resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end
end
