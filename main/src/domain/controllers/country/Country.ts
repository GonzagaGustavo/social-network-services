import { Response } from "express";
import Controller, { HttpRequest } from "../../../interfaces/controller";
import { Filter } from "../../../interfaces/repository";
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

  async GET(httpRequest: HttpRequest, res: Response): Promise<void> {
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
      const response = this.res.ok(
        countrys.map((country) => this.res.removeUnderline(country))
      );
      res.status(response.statusCode).send(response.body);
    } catch (err) {
      const response = this.res.badRequest(err);
      res.status(response.statusCode).send(response.body);
    }
  }

  async POST(httpRequest: HttpRequest, res: Response): Promise<void> {
    try {
      const input: CreateCountryInput = {
        name: httpRequest.body.name,
        abbr: httpRequest.body.abbr,
      };

      const country = await this.useCase.create(input);

      const response = this.res.ok(country);
      res.status(response.statusCode).send(response.body);
    } catch (err) {
      console.error(err);
      const response = this.res.badRequest(err);
      res.status(response.statusCode).send(response.body);
    }
  }

  async PUT(httpRequest: HttpRequest, res: Response): Promise<void> {
    try {
      const input: UpdateCountryInput = {
        id: httpRequest.body.id,
        name: httpRequest.body.name,
        abbr: httpRequest.body.abbr,
        sort: httpRequest.body.sort,
      };

      const output = await this.useCase.update(input);

      const response = this.res.ok(output);
      res.status(response.statusCode).send(response.body);
    } catch (err) {
      const response = this.res.badRequest(err);
      res.status(response.statusCode).send(response.body);
    }
  }

  async DELETE(httpRequest: HttpRequest, res: Response): Promise<void> {
    try {
      const deleted = await this.useCase.remove(+httpRequest.params.id);

      const response = this.res.ok(deleted);
      res.status(response.statusCode).send(response.body);
    } catch (err) {
      const response = this.res.badRequest(err);
      res.status(response.statusCode).send(response.body);
    }
  }
}
