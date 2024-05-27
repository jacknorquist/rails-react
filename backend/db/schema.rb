# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.1].define(version: 2024_05_27_174514) do
  create_table "group_post_comments", force: :cascade do |t|
    t.integer "post_id", null: false
    t.integer "user_id", null: false
    t.text "content", limit: 200, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["post_id"], name: "index_group_post_comments_on_post_id"
    t.index ["user_id"], name: "index_group_post_comments_on_user_id"
  end

  create_table "group_posts", force: :cascade do |t|
    t.integer "group_id", null: false
    t.integer "user_id", null: false
    t.text "content", limit: 500, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["group_id"], name: "index_group_posts_on_group_id"
    t.index ["user_id"], name: "index_group_posts_on_user_id"
  end

  create_table "groups", force: :cascade do |t|
    t.integer "admin_id", null: false
    t.string "name", limit: 35, null: false
    t.string "fish_species", limit: 50
    t.string "area", limit: 50
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["admin_id"], name: "index_groups_on_admin_id"
  end

  create_table "memberships", force: :cascade do |t|
    t.integer "user_id", null: false
    t.integer "group_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["group_id"], name: "index_memberships_on_group_id"
    t.index ["user_id", "group_id"], name: "index_memberships_on_user_id_and_group_id", unique: true
    t.index ["user_id"], name: "index_memberships_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "username", limit: 25, null: false
    t.string "first_name", limit: 25, null: false
    t.string "last_name", limit: 25, null: false
    t.text "bio", limit: 250
    t.string "email", limit: 255, null: false
    t.string "password_digest", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["email"], name: "index_users_on_email", unique: true
  end

  add_foreign_key "group_post_comments", "posts"
  add_foreign_key "group_post_comments", "users"
  add_foreign_key "group_posts", "groups"
  add_foreign_key "group_posts", "users"
  add_foreign_key "groups", "users", column: "admin_id"
  add_foreign_key "memberships", "groups"
  add_foreign_key "memberships", "users"
end
