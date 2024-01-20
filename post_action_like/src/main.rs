mod config {
    pub mod event_type;
}
mod db;
mod grpc;
mod kafka;
mod models;

use std::thread;

use grpc::setup_grpc;
use kafka::setup_consumer;

fn main() {
    let consumer_thread = thread::spawn(|| {
        setup_consumer();
    });

    setup_grpc().expect("error to start gRPC server");

    consumer_thread
        .join()
        .expect("Erro ao aguardar a conclusão da thread do consumidor");
}
