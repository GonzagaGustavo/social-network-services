// @generated automatically by Diesel CLI.

diesel::table! {
    _prisma_migrations (id) {
        #[max_length = 36]
        id -> Varchar,
        #[max_length = 64]
        checksum -> Varchar,
        finished_at -> Nullable<Timestamptz>,
        #[max_length = 255]
        migration_name -> Varchar,
        logs -> Nullable<Text>,
        rolled_back_at -> Nullable<Timestamptz>,
        started_at -> Timestamptz,
        applied_steps_count -> Int4,
    }
}

diesel::table! {
    country (id) {
        id -> Int4,
        name -> Text,
        #[max_length = 3]
        abbr -> Varchar,
        sort -> Int4,
        created -> Timestamptz,
    }
}

diesel::table! {
    favorite (id) {
        id -> Text,
        user_id -> Int4,
        post_id -> Text,
        created -> Timestamptz,
    }
}

diesel::table! {
    likes (id) {
        id -> Text,
        user_id -> Int4,
        post_id -> Text,
        created -> Timestamptz,
    }
}

diesel::table! {
    post (id) {
        id -> Text,
        autor_id -> Int4,
        #[sql_name = "type"]
        #[max_length = 50]
        type_ -> Varchar,
        #[max_length = 150]
        file -> Nullable<Varchar>,
        #[max_length = 200]
        title -> Varchar,
        description -> Text,
        created -> Timestamptz,
        deslikes -> Int4,
        shares -> Int4,
        video_id -> Nullable<Text>,
    }
}

diesel::table! {
    refresh_token (id) {
        id -> Text,
        expiresIn -> Int4,
        userId -> Int4,
    }
}

diesel::table! {
    user (id) {
        id -> Int4,
        #[max_length = 150]
        name -> Varchar,
        #[max_length = 200]
        email -> Varchar,
        #[max_length = 100]
        password -> Varchar,
        #[max_length = 200]
        username -> Varchar,
        #[max_length = 50]
        phone -> Nullable<Varchar>,
        #[max_length = 1000]
        bio -> Varchar,
        #[max_length = 50]
        gender -> Varchar,
        birthday -> Date,
        #[max_length = 80]
        country -> Varchar,
        #[max_length = 100]
        estate -> Varchar,
        #[max_length = 100]
        city -> Varchar,
        created -> Timestamptz,
    }
}

diesel::table! {
    video (id) {
        id -> Text,
        #[max_length = 150]
        thumb -> Varchar,
        #[max_length = 150]
        v1080p -> Nullable<Varchar>,
        #[max_length = 150]
        v720p -> Nullable<Varchar>,
        #[max_length = 150]
        v480p -> Nullable<Varchar>,
        #[max_length = 150]
        v144p -> Nullable<Varchar>,
    }
}

diesel::joinable!(favorite -> post (post_id));
diesel::joinable!(favorite -> user (user_id));
diesel::joinable!(likes -> post (post_id));
diesel::joinable!(likes -> user (user_id));
diesel::joinable!(post -> user (autor_id));
diesel::joinable!(post -> video (video_id));
diesel::joinable!(refresh_token -> user (userId));

diesel::allow_tables_to_appear_in_same_query!(
    _prisma_migrations,
    country,
    favorite,
    likes,
    post,
    refresh_token,
    user,
    video,
);
