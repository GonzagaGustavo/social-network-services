use std::thread;

use rdkafka::{
    consumer::{BaseConsumer, Consumer},
    ClientConfig,
};

pub fn setup_consumer() {
    let consumer: BaseConsumer = ClientConfig::new()
        .set("metadata.broker.list", "localhost:9092")
        .set("group.id", "post_action_like")
        .create()
        .expect("invalid consumer config");

    consumer
        .subscribe(&["Like"])
        .expect("topic subscribe failed");

    thread::spawn(move || loop {
        for msg_result in consumer.iter() {
            let msg = msg_result.unwrap();

            println!("{}", msg)
        }
    })
}
