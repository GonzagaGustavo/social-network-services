import MissingParamError from "../../../interfaces/errors/missing-param";
import Post from "../../entities/Post/Post";
import PostRepository from "../../repositories/Post/post.repository";
import { CreatePostInput, ReadPostInput, UpdatePostInput } from "./post.dto";

export default class PostUseCase {
  postRepository: PostRepository;

  constructor(postRepository: PostRepository) {
    this.postRepository = postRepository;
  }

  async create(input: CreatePostInput): Promise<Post> {
    const post = new Post(input);

    return await this.postRepository.create(post);
  }

  async update(input: UpdatePostInput): Promise<Post> {
    const post = new Post(input);

    return await this.postRepository.update(post);
  }

  async read(input: ReadPostInput): Promise<Post[]> {
    return await this.postRepository.paginate(input);
  }

  async getById(id: number): Promise<Post> {
    return await this.postRepository.getById(id);
  }

  async remove(id: string): Promise<Post> {
    if (!id) throw new MissingParamError("id");
    return await this.postRepository.remove(id);
  }
}
