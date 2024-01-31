use diesel::prelude::*;

table! {
    likes (id) {
        id -> Uuid,
        user_id -> Integer,
        post_id -> Text,
        created -> Timestamptz,
    }
}

#[derive(Insertable)]
#[diesel(table_name = likes)]
pub struct NewLikes {
    pub user_id: i32,
    pub post_id: String,
}

#[derive(Debug, Queryable)]
pub struct Like {
    pub id: String,
    pub user_id: i32,
    pub post_id: String,
    pub created: chrono::NaiveDateTime,
}
