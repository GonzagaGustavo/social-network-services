use kafka::setup_consumer;

#[macro_use]
extern crate diesel;

mod db;
mod grpc;
mod kafka;
mod models;

fn main() {
    setup_consumer();
}
