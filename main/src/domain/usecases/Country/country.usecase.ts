import MissingParamError from "../../../interfaces/errors/missing-param";
import Country from "../../entities/Country/Country";
import CountryRepository from "../../repositories/Country/country.repository";
import {
  CreateCountryInput,
  ReadCountryInput,
  UpdateCountryInput,
} from "./country.dto";

export default class CountryUseCase {
  countryRepository: CountryRepository;

  constructor(countryRepository: CountryRepository) {
    this.countryRepository = countryRepository;
  }

  async create(input: CreateCountryInput): Promise<Country> {
    const country = new Country(input);

    return await this.countryRepository.create(country);
  }

  async update(input: UpdateCountryInput): Promise<Country> {
    const country = new Country(input);

    return await this.countryRepository.update(country);
  }

  async read(input: ReadCountryInput): Promise<Country[]> {
    return await this.countryRepository.paginate(input);
  }

  async getById(id: number): Promise<Country> {
    return await this.countryRepository.getById(id);
  }

  async remove(id: number): Promise<Country> {
    if (!id) throw new MissingParamError("id");
    return await this.countryRepository.remove(id);
  }
}
