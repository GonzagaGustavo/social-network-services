import Controller, {
  HttpRequest,
  ResponseObject,
} from "../../../interfaces/controller";
import { Filter, initialFilter } from "../../../interfaces/repository";
import CountryRepository from "../../repositories/Country/country.repository";
import {
  CreateCountryInput,
  UpdateCountryInput,
} from "../../usecases/Country/country.dto";
import CountryUseCase from "../../usecases/Country/country.usecase";

export default class CountryController extends Controller<CountryUseCase> {
  useCase: CountryUseCase;

  constructor() {
    super();
    const countryRepository = new CountryRepository("country");
    this.useCase = new CountryUseCase(countryRepository);
  }

  async GET(httpRequest: HttpRequest): Promise<ResponseObject> {
    try {
      const input: Filter = {
        page: httpRequest.query.page ? +httpRequest.query.page : 1,
        search: httpRequest.query.search ? httpRequest.query.search : "",
        order: httpRequest.query.order ? httpRequest.query.order : "",
        limit: httpRequest.query.limit ? +httpRequest.query.limit : 8,
        desc: Boolean(httpRequest.query.desc),
        more: Boolean(httpRequest.query.more),
      };

      const countrys = await this.useCase.read(input);
      return this.res.ok(
        countrys.map((country) => this.res.removeUnderline(country))
      );
    } catch (err) {
      return this.res.badRequest(err);
    }
  }

  async POST(httpRequest: HttpRequest): Promise<ResponseObject> {
    try {
      const input: CreateCountryInput = {
        name: httpRequest.body.name,
        abbr: httpRequest.body.abbr,
      };

      const country = await this.useCase.create(input);

      return this.res.ok(country);
    } catch (err) {
      console.error(err);
      return this.res.badRequest(err);
    }
  }

  async PUT(httpRequest: HttpRequest): Promise<ResponseObject> {
    try {
      const input: UpdateCountryInput = {
        id: httpRequest.body.id,
        name: httpRequest.body.name,
        abbr: httpRequest.body.abbr,
        sort: httpRequest.body.sort,
      };

      const output = await this.useCase.update(input);

      return this.res.ok(output);
    } catch (err) {
      return this.res.badRequest(err);
    }
  }

  async DELETE(httpRequest: HttpRequest): Promise<ResponseObject> {
    try {
      const deleted = await this.useCase.remove(+httpRequest.params.id);

      return this.res.ok(deleted);
    } catch (err) {
      return this.res.badRequest(err);
    }
  }
}
