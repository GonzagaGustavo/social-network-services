use like::Handle;
use prost::Message;
use std::time::Duration;

use rdkafka::{
    consumer::{BaseConsumer, Consumer},
    ClientConfig, Message as OtherMessage,
};

pub mod like {
    tonic::include_proto!("like");
}

pub fn setup_consumer() {
    let consumer: BaseConsumer = ClientConfig::new()
        .set("bootstrap.servers", "localhost:9092")
        .set("group.id", "teste")
        .create()
        .expect("invalid consumer config");

    consumer
        .subscribe(&["Like"])
        .expect("topic subscribe failed");

    loop {
        match consumer.poll(Duration::from_millis(1000)) {
            Some(Ok(msg)) => {
                // Processa a mensagem recebida
                if let Some(payload) = msg.payload() {
                    println!("{:?}", payload.to_vec());

                    match Handle::decode(payload) {
                        Ok(protobuf_obj) => {
                            println!("{:?}", protobuf_obj);
                        }
                        Err(err) => {
                            eprintln!("Erro: {}", err)
                        }
                    }
                }
            }
            Some(Err(err)) => {
                // Trata erros de leitura
                println!("Erro ao ler mensagem: {:?}", err);
            }
            None => {
                // Não há mensagens disponíveis
            }
        }
    }
}
