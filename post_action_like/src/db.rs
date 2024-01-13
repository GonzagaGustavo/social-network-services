use std::env;

use diesel::prelude::*;
use dotenvy::dotenv;

pub fn establish_connection() -> PgConnection {
    dotenv().ok();

    let database_url = env::var("DATABASE_URL").expect("Database URL must be set");

    PgConnection::establish(&database_url).expect(&format!("Error connecting to {}", database_url))

}