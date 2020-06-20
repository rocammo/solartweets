import { posgresConnection } from "../config";

const { Client } = require("pg");

/**
 * List of supported DBMS.
 */
const DBMS: String[] = ["posgres", "mongodb", "solr"];

/**
 * Interface to be implemented in all endpoints for the different actions.
 * --
 *
 * READ_ONLY (operations)
 * @returns {any} entire DBMS response.
 *
 * WRITE_ONLY (operations)
 * @returns {string} status of whether the operation went well or badly.
 */
interface endpointAction {
  [indexer: string]: (tweet?: string, user?: string) => any;
}

interface responseType {
  tweet: string;
  user: string;
}

/**
 * Endpoint action to retrieve all data.
 */
const endpointAll: endpointAction = {
  posgres: async (): Promise<responseType[]> => {
    console.log(`[POSGRES] endpointAll`);

    const client = new Client({
      connectionString: posgresConnection,
    });
    await client.connect();
    const res = await client.query("SELECT * from tweets");

    let response: responseType[] = new Array(res.rows.length);
    for (let i = 0; i < response.length; i++) {
      response[i] = { tweet: res.rows[i].text, user: res.rows[i].username };
    }

    await client.end();

    return response;
  },
  mongodb: (): any => {
    console.log(`[MONGODB] endpointAll`);

    return [
      { tweet: "tweet3", user: "user3" },
      { tweet: "tweet4", user: "user4" },
    ];
  },
  solr: (): any => {
    console.log(`[SOLR] endpointAll`);

    return [
      { tweet: "tweet5", user: "user5" },
      { tweet: "tweet6", user: "user6" },
    ];
  },
};

/**
 * Endpoint action to insert new data.
 */
const endpointAdd: endpointAction = {
  posgres: (tweet: string, user: string): string => {
    console.log(`[POSGRES] endpointAdd <- {tweet: ${tweet}, user: ${user}}`);

    let status: string;
    status = "200 OK";

    return status;
  },
  mongodb: (tweet: string, user: string): string => {
    console.log(`[MONGODB] endpointAdd <- {tweet: ${tweet}, user: ${user}}`);

    let status: string;
    status = "200 OK";

    return status;
  },
  solr: (tweet: string, user: string): string => {
    console.log(`[SOLR] endpointAdd <- {tweet: ${tweet}, user: ${user}}`);

    let status: string;
    status = "200 OK";

    return status;
  },
};

/**
 * Endpoint action to search by queried tweet.
 */
const endpointSearchByTweet: endpointAction = {
  posgres: async (tweet: string): Promise<responseType[]> => {
    console.log(`[POSGRES] endpointSearchByTweet <- {tweet: ${tweet}}`);

    const client = new Client({
      connectionString: posgresConnection,
    });
    await client.connect();
    const res = await client.query("SELECT * from tweets");

    let response: responseType[] = new Array(res.rows.length);
    for (let i = 0, j = 0; i < response.length; i++) {
      if (res.rows[i].text.includes(tweet))
        response[j++] = { tweet: res.rows[i].text, user: res.rows[i].username };
    }

    await client.end();

    return response;
  },
  mongodb: (tweet: string): any => {
    console.log(`[MONGODB] endpointSearchByTweet <- {tweet: ${tweet}}`);

    return [
      { tweet: "queried_tweet3", user: "user3" },
      { tweet: "queried_tweet4", user: "user4" },
    ];
  },
  solr: (tweet: string): any => {
    console.log(`[SOLR] endpointSearchByTweet <- {tweet: ${tweet}}`);

    return [
      { tweet: "queried_tweet5", user: "user5" },
      { tweet: "queried_tweet6", user: "user6" },
    ];
  },
};

/**
 * Endpoint action to search by queried user.
 */
const endpointSearchByUser: endpointAction = {
  posgres: async (user: string): Promise<responseType[]> => {
    console.log(`[POSGRES] endpointSearchByUser <- {user: ${user}}`);

    const client = new Client({
      connectionString: posgresConnection,
    });
    await client.connect();
    const res = await client.query("SELECT * from tweets");

    let response: responseType[] = new Array(res.rows.length);
    for (let i = 0, j = 0; i < response.length; i++) {
      if (res.rows[i].username.includes(user))
        response[j++] = { tweet: res.rows[i].text, user: res.rows[i].username };
    }

    await client.end();

    return response;
  },
  mongodb: (user: string): any => {
    console.log(`[MONGODB] endpointSearchByUser <- {user: ${user}}`);

    return [
      { tweet: "tweet3", user: "queried_user3" },
      { tweet: "tweet4", user: "queried_user4" },
    ];
  },
  solr: (user: string): any => {
    console.log(`[SOLR] endpointSearchByUser <- {user: ${user}}`);

    return [
      { tweet: "tweet5", user: "queried_user5" },
      { tweet: "tweet6", user: "queried_user6" },
    ];
  },
};

export {
  DBMS,
  endpointAll,
  endpointAdd,
  endpointSearchByTweet,
  endpointSearchByUser,
};
