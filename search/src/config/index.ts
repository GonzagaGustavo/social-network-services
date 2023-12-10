const { PORT, SECRET_TOKEN } = process.env;

export const port = PORT ?? "5000";
export const secret_token = SECRET_TOKEN ?? "development_search";
