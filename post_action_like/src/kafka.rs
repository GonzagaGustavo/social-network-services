use diesel::{insert_into, prelude::*};
use prost::Message;
use std::time::Duration;
use uuid::Uuid;

use rdkafka::{
    consumer::{BaseConsumer, Consumer},
    ClientConfig, Message as OtherMessage,
};

use crate::{db::establish_connection, grpc::like::Handle};

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

    let connection = &mut establish_connection();

    loop {
        match consumer.poll(Duration::from_millis(1000)) {
            Some(Ok(msg)) => {
                // Processa a mensagem recebida
                if let Some(payload) = msg.payload() {
                    println!("{:?}", payload);

                    match Handle::decode(payload) {
                        Ok(protobuf_obj) => {
                            if protobuf_obj.event == 1 {
                                println!("{}", "Delete");
                            } else if protobuf_obj.event == 0 {
                                create(connection, protobuf_obj);
                            }
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

fn create(connection: &mut PgConnection, data: Handle) {
    use crate::schema::likes::dsl::*;

    let new_uuid = Uuid::new_v4().to_string();
    insert_into(likes)
        .values((
            post_id.eq(data.id),
            user_id.eq(data.user_id),
            id.eq(new_uuid),
        ))
        .execute(connection)
        .expect("Erro ao inserir no banco de dados");
}

// fn delete(connection: &mut PgConnection) {}
