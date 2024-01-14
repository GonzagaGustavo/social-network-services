use like::like_server::{Like, LikeServer};
use like::{LikeGetRequest, LikeGetResponse};
use tonic::Status;
use tonic::{transport::Server, Request, Response};

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
        Ok(Response::new(message))
    }
}

fn setup_grpc() {}
