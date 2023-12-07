import InvalidParamError from "../../../interfaces/errors/invalid-param";
import MissingParamError from "../../../interfaces/errors/missing-param";

type UserInput = {
  name: string;
  email?: string;
  password?: string;
  username: string;
  phone?: string;
  bio: string;
  gender?: string;
  birthday?: Date;
  country?: string;
  estate?: string;
  city?: string;
  created?: Date;
  id?: number;
};

export default class User {
  _id?: number;
  _name: string;
  _email?: string;
  _password: string;
  _username: string;
  _phone?: string;
  _bio: string;
  _gender?: string;
  _birthday?: Date;
  _country?: string;
  _estate?: string;
  _city?: string;
  _created?: Date;

  constructor({
    id,
    name,
    email,
    password,
    username,
    phone,
    bio,
    gender,
    birthday,
    country,
    estate,
    city,
    created,
  }: UserInput) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.username = username;
    this.phone = phone;
    this.bio = bio;
    this.gender = gender;
    this.birthday = birthday;
    this.country = country;
    this.estate = estate;
    this.city = city;
    this.created = created;
  }

  getuser() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      password: this.password,
      username: this.username,
      phone: this.phone,
      bio: this.bio,
      gender: this.gender,
      birthday: this.birthday,
      country: this.country,
      estate: this.estate,
      city: this.city,
      created: this.created,
    };
  }

  get id(): number | undefined {
    return this._id;
  }

  set id(id: number | undefined) {
    this._id = id;
  }

  get name(): string {
    return this._name;
  }

  set name(name: string) {
    if (name.length > 150) throw new InvalidParamError("name");

    this._name = name;
  }

  get email(): string {
    return this._email;
  }

  set email(email: string | undefined) {
    if (email) {
      if (!this.validEmail(email)) throw new InvalidParamError("email");
    }

    this._email = email;
  }

  get password(): string {
    return this._password;
  }

  set password(password: string) {
    this._password = password;
  }

  get username(): string {
    return this._username;
  }

  set username(username: string) {
    if (!username) throw new MissingParamError("username");
    if (username.length > 200) throw new InvalidParamError("username");

    this._username = username;
  }

  get phone(): string | undefined {
    return this._phone;
  }

  set phone(phone: string | undefined) {
    if (phone) {
      if (phone.length > 50) throw new InvalidParamError("phone");
    }

    this._phone = phone;
  }

  get bio(): string {
    return this._bio;
  }

  set bio(bio: string) {
    if (bio.length > 1000) throw new InvalidParamError("bio");

    this._bio = bio;
  }

  get gender(): string | undefined {
    return this._gender;
  }

  set gender(gender: string | undefined) {
    if (gender) {
      if (gender.length > 50) throw new InvalidParamError("gender");
    }

    this._gender = gender;
  }

  get birthday(): Date | undefined {
    return this._birthday;
  }

  set birthday(birthday: Date | undefined) {
    this._birthday = birthday;
  }

  get country(): string | undefined {
    return this._country;
  }

  set country(country: string | undefined) {
    if (country) {
      if (country.length > 80) throw new InvalidParamError("country");
    }

    this._country = country;
  }

  get estate(): string | undefined {
    return this._estate;
  }

  set estate(estate: string | undefined) {
    if (estate) {
      if (estate.length > 100) throw new InvalidParamError("estate");
    }

    this._estate = estate;
  }

  get city(): string | undefined {
    return this._city;
  }

  set city(city: string | undefined) {
    if (city) {
      if (city.length > 100) throw new InvalidParamError("city");
    }

    this._city = city;
  }

  get created(): Date | undefined {
    return this._created;
  }

  set created(created: Date | undefined) {
    this._created = created;
  }

  private async validEmail(email: string) {
    const tester =
      /^[-!#$%&'*+/0-9=?A-Z^_a-z`{|}~](\.?[-!#$%&'*+/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;
    if (!email) {
      return false;
    }
    if (email.length > 256) {
      return false;
    }
    if (!tester.test(email)) {
      return false;
    }
    const [account, address] = email.split("@");
    if (account.length > 64) {
      return false;
    }
    const domainParts = address.split(".");
    if (
      domainParts.some(function (part) {
        return part.length > 63;
      })
    ) {
      return false;
    }

    return true;
  }
}
