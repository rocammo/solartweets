// API
const port: number = Number(process.env.PORT) || 3000;

// POSGRES
const posgresConnection: string =
  "postgressql://posgres:posgres@localhost:5432/tweets";

// MONGODB
const mongodbConnection: string = "mongodb://mongodb:mongodb@localhost:27017";

export { port, posgresConnection, mongodbConnection };
