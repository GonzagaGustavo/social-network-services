import InvalidParamError from "../../../interfaces/errors/invalid-param";
import Country from "./Country";

describe("Country unit test", () => {
  it("throw a error if abbr is big than three letters", () => {
    expect(() => {
      const country = new Country({ name: "Brazil", abbr: "BRAZ" });
    }).toThrowError(new InvalidParamError("abbr"));
  });
});
