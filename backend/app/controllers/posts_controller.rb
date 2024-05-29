class PostsController < ApplicationController
    before_action :set_group
    before_action :set_post, only: [:show, :update, :destroy]

    def index
      render json: { posts: @group.posts}, status: :ok
    end

    def show
      render json: { post: @post, comments: @post.post_comments}, status: :ok
    end

    def create
      @post = @group.posts.new(post_params)
      @post.user_id = @current_user.id
      puts params[:images], 'pppppppppppp'


      if @post.save
        @post.image.attach(params[:images])
        render json: { post: @post }, status: :created
      else
        render json: @post.errors, status: :unprocessable_entity
      end
    end

    def update
      if @post.user_id == @current_user.id
        if @post.update(post_update_params)
          render json: { post: @post, comments: @post.post_comments }, status: :ok
        else
          render json: @post.errors, status: :unprocessable_entity
        end
      else
        render json: { errors: "Not Authorized" }, status: :unauthorized
      end
    end

    def destroy
      if @post.user_id == @current_user.id
        if  @post.destroy
          render json: { message: "Post Deleted" }, status: :ok
        else
          render json: @post.errors, status: :unprocessable_entity
        end
      else
        render json: { errors: "Not Authorized" }, status: :unauthorized
      end
    end

    private

    def set_group
      @group = Group.find(params[:group_id])
    end

    def set_post
      puts @group.posts
      @post = @group.posts.find(params[:id])
    end

    def post_update_params
      params.permit(:title, :content)
    end

    def post_params
     JSON.parse(params[:post]).merge(user_id: @current_user.id, group_id: params[:group_id])
      # params.require(:post).permit(:title, :content).merge(user_id: @current_user.id, group_id: params[:group_id])
    end
  end