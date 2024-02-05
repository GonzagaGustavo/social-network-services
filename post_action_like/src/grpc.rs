use diesel::prelude::*;
use like::like_server::{Like, LikeServer};
use like::{LikeGet, LikeGetRequest, LikeGetResponse, Video};
use tonic::Status;
use tonic::{transport::Server, Request, Response};

use crate::db::establish_connection;
use crate::models::{Likes as LikeModel, Post, Video as VideoModel};

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
        use crate::schema::likes;
        use crate::schema::post;
        use crate::schema::video;

        let req = request.into_inner();

        println!("user_id {}", req.user_id);
        let connection = &mut establish_connection();

        let result: Vec<LikeModel> = likes::table
            .filter(likes::user_id.eq(req.user_id))
            .limit(15)
            .load::<LikeModel>(connection)
            .expect("error loading data");

        let posts_id: Vec<String> = result.iter().map(|l| l.post_id.clone()).collect();

        let likes_with_videos: Vec<(Post, Option<VideoModel>)> = post::table
            .left_join(video::table)
            .filter(post::id.eq_any(posts_id))
            .limit(15)
            .load::<(Post, Option<VideoModel>)>(connection)
            .expect("error loading data");

        let mut likes: Vec<LikeGet> = Vec::new();
        for (post, video) in likes_with_videos {
            match video {
                Some(video) => likes.push(LikeGet {
                    id: post.id,
                    title: post.title,
                    video: Some(Video {
                        id: video.id,
                        thumb: video.thumb,
                    }),
                }),
                None => {}
            }
        }

        let response = LikeGetResponse { likes };
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
