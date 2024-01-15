mod db;
mod grpc;
mod kafka;
mod models;

use grpc::setup_grpc;
use kafka::setup_consumer;

fn main() {
    // setup_consumer();
    setup_grpc().expect("error to start gRPC server");
}
