mod db;
mod grpc;
mod kafka;
mod models;

use kafka::setup_consumer;

fn main() {
    setup_consumer();
}
