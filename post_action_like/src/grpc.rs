use like::like_server::{Like, LikeServer};
use like::{LikeGet, LikeGetRequest, LikeGetResponse, Video};
use tonic::Status;
use tonic::{transport::Server, Request, Response};

use crate::db::establish_connection;

pub mod like {
    tonic::include_proto!("like");
}

#[derive(Debug, Default)]
pub struct LikeService {}

#[tonic::async_trait]
impl Like for LikeService {
    async fn get(
        &self,
        request: Request<LikeGetRequest>,
    ) -> Result<Response<LikeGetResponse>, Status> {
        let req = request.into_inner();

        println!("user_id {}", req.user_id);
        let connection = &mut establish_connection();

        // let likes = likes::table
        //     .select((likes::id, likes::user_id, likes::post_id, likes::created))
        //     .limit(15)
        //     .load(connection)
        //     .expect("a");
        let like = LikeGet {
            id: "a".to_string(),
            title: "teste".to_string(),
            video: Some(Video {
                id: "b".to_string(),
                thumb: "URL teste".to_string(),
            }),
        };

        let response = LikeGetResponse { likes: vec![like] };
        Ok(Response::new(response))
    }
}

#[tokio::main]
pub async fn setup_grpc() -> Result<(), Box<dyn std::error::Error>> {
    let addr = "[::1]:50051".parse()?;
    let like_service = LikeService::default();

    println!("Server running on {}", addr);

    Server::builder()
        .add_service(LikeServer::new(like_service))
        .serve(addr)
        .await?;

    Ok(())
}
