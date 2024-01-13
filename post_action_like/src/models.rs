use diesel::prelude::*;


#[derive(Insertable)]
#[table_name = "likes"]
pub struct NewLikes<'a> {
    pub user_id: i32,
    pub post_id: &'a str,
}

#[derive(Debug, Queryable, AsChangeset)]
pub struct Likes {
    pub id: String,
    pub user_id: i32,
    pub post_id: String,
    pub created: chrono::NaiveDateTime
}