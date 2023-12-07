import User from "../User/User";
import Post from "./Post";

describe("Post unit test", () => {
  it("new post", () => {
    const user = new User({
      id: 1,
      name: "Gustavo",
      bio: "",
      birthday: new Date("2005-11-26"),
      city: "Indaial",
      estate: "Santa Catarina",
      country: "Brazil",
      email: "gonzaga@eliti.com.br",
      gender: "Male",
      password: "123",
      username: "gustavo",
    });
    const post = new Post({
      autor: user,
      autor_id: user.id,
      description: "descriptiom\r\n now",
      title: "Titulo",
      type: "video/mp4",
      video_id: 1,
    });

    expect(post.autor.id).toBe(user.id);
    expect(post.description).toBe("descriptiom\r\n now");
  });
});
