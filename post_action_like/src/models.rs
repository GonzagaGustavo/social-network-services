use diesel::prelude::*;

#[derive(Queryable, Selectable)]
#[diesel(table_name = crate::schema::likes)]
#[diesel(check_for_backend(diesel::pg::Pg))]
pub struct Likes {
    pub id: String,
    pub user_id: i32,
    pub post_id: String,
    pub created: chrono::NaiveDateTime,
}
#[derive(Queryable, Selectable, Identifiable, PartialEq, Debug)]
#[diesel(table_name = crate::schema::post)]
pub struct Post {
    pub id: String,
    pub autor_id: i32,
    pub type_: String,
    pub file: Option<String>,
    pub title: String,
    pub description: String,
    pub created: chrono::NaiveDateTime,
    pub deslikes: i32,
    pub shares: i32,
    pub video_id: Option<String>,
}

#[derive(Selectable, Queryable, Debug)]
#[diesel(table_name = crate::schema::video)]
pub struct Video {
    pub id: String,
    pub thumb: String,
    pub v1080p: Option<String>,
    pub v720p: Option<String>,
    pub v480p: Option<String>,
    pub v144p: Option<String>,
}
