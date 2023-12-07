import orm from "../../../framework/database";
import Country from "../../entities/Country/Country";
import CountryRepository from "./country.repository";

describe("country unit tests", () => {
  it("should create a country", async () => {
    const repository = new CountryRepository("country");
    const country = new Country({ name: "Brazil", abbr: "BR" });

    const created = await repository.create(country);

    expect(created.id).toBeDefined();
    expect(created.name).toBe(country.name);
    expect(created.abbr).toBe(country.abbr);
    expect(created.sort).toBe(0);
  });

  afterAll(async () => {
    await orm.country.deleteMany({});
  });
});
