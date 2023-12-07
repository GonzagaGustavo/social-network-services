interface JwtInput {
  id?: string;
  userId: number;
  expiresIn: number;
}

export default class Jwt {
  _id?: string;
  _userId: number;
  _expiresIn: number;

  constructor({ id, userId, expiresIn }: JwtInput) {
    this.id = id;
    this._userId = userId;
    this._expiresIn = expiresIn;
  }

  get id(): string | undefined {
    return this._id;
  }

  set id(id: string | undefined) {
    this._id = id;
  }

  get userId(): number | undefined {
    return this._userId;
  }

  set userId(userId: number | undefined) {
    this._userId = userId;
  }

  get expiresIn(): number | undefined {
    return this._expiresIn;
  }

  set expiresIn(expiresIn: number | undefined) {
    this._expiresIn = expiresIn;
  }
}
