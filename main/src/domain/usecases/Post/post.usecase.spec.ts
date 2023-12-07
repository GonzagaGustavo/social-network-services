import Video from "../../entities/Video/Video";
import PostRepository from "../../repositories/Post/post.repository";
import PostUseCase from "./post.usecase";

describe("Post use case unit tests", () => {
  let postRepository: PostRepository;
  let postUseCase: PostUseCase;
  let id: number;

  beforeEach(() => {
    postRepository = new PostRepository("Post");
    postUseCase = new PostUseCase(postRepository);
  });

  it("should create a Post", async () => {
    const created = await postUseCase.create({
      autor_id: 1,
      title: "Video teste",
      description: "descrição teste",
      type: "video",
      video: new Video({
        thumb: "http://algumlugar",
        v1080p: "http://algumlugar",
        v144p: "http://algumlugar",
        v480p: "http://algumlugar",
        v720p: "http://algumlugar",
      }),
    });

    expect(created.id).toBeDefined();
    expect(created.autor.username).toBe("gustavo");
    expect(created.created).toBeDefined();
    expect(created.title).toBe("Video teste");
    expect(created.video.thumb).toBe("http://algumlugar");
  });

  afterEach(() => {});
});
