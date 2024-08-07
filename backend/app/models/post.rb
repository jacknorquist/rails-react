class Post < ApplicationRecord
    belongs_to :group
    belongs_to :user
    has_many :comments, dependent: :destroy

    validates :content, presence: true, length: {maximum:500}

    IMAGES_COUNT = 5
    IMAGES_COUNT.times do |i|
      include ImageUploader["post_image_#{i+1}"]
    end

    scope :by_groups, ->(group_ids) { where(group_id: group_ids).order(created_at: :desc) }
  end