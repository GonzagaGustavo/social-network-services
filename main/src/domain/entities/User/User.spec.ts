import User from "./User";

describe("users unit test", () => {
  it("should have a name", () => {
    const user = new User({
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

    expect(user.name).toBe("Gustavo");
  });
});
