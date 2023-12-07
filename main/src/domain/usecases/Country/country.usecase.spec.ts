import CountryRepository from "../../repositories/Country/country.repository";
import CountryUseCase from "./country.usecase";

describe("country use case unit tests", () => {
  it("shhould create a country", async () => {
    const countryRepository = new CountryRepository("country");
    const countryUseCase = new CountryUseCase(countryRepository);

    const created = await countryUseCase.create({
      name: "United States",
      abbr: "USA",
    });

    expect(created.id).toBeDefined();
    expect(created.sort).toBeDefined();
    expect(created.created).toBeDefined();
    expect(created.name).toBe("United States");
    expect(created.abbr).toBe("USA");
  });
});
