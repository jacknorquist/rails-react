Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Defines the root path route ("/")
  # root "posts#index"
end

Rails.application.routes.draw do
  resources :users, only: [:create]
end

Rails.application.routes.draw do
  post '/login', to: 'authentication#login'
end

Rails.application.routes.draw do
  resources :groups, only: [:index, :show, :create, :update, :destroy] do
    post 'join', on: :member
    delete 'leave', on: :member
  end
end






