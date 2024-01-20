use std::time::Duration;

use rdkafka::{
    consumer::{BaseConsumer, Consumer},
    ClientConfig, Message,
};

use crate::config::event_type::read;

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
        match consumer.poll(Duration::from_millis(100)) {
            Some(Ok(msg)) => {
                // Processa a mensagem recebida
                if let Some(payload) = msg.payload() {
                    match read(payload.to_vec()) {
                        Ok(serialized_msg) => {
                            // Imprime os registros se a leitura for bem-sucedida
                            for record in serialized_msg {
                                println!("Registro Avro: {:?}", record);
                            }
                        }
                        Err(err) => {
                            // Imprime uma mensagem de erro se houver um problema na leitura
                            eprintln!("Erro ao ler dados Avro: {:?}", err);
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
