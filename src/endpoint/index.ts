import { posgresConnection, mongodbConnection } from "../config";

const { Client } = require("pg");
const MongoClient = require("mongodb").MongoClient;
const SolrNode = require("solr-node");
const solrClient = new SolrNode({
  host: "127.0.0.1",
  port: "8983",
  core: "solartweets",
  protocol: "http",
});

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

    const client = new Client({ connectionString: posgresConnection });
    await client.connect();
    const res = await client.query("SELECT * from tweets");

    let response: responseType[] = new Array(res.rows.length);
    for (let i = 0; i < response.length; i++) {
      response[i] = { tweet: res.rows[i].text, user: res.rows[i].username };
    }

    await client.end();

    return response;
  },
  mongodb: async (): Promise<responseType[]> => {
    console.log(`[MONGODB] endpointAll`);

    const client = new MongoClient(mongodbConnection, {
      useUnifiedTopology: true,
    });
    const response: responseType[] = await new Promise((resolve, reject) => {
      client.connect((err) => {
        if (err) reject(err);

        const db = client.db("solartweets");
        const collection = db.collection("tweets");

        collection.find({}).toArray((err, docs) => {
          if (err) reject(err);

          let res: responseType[] = new Array(docs.length);
          for (let i = 0; i < res.length; i++) {
            res[i] = { tweet: docs[i].text, user: docs[i].userName };
          }

          resolve(res);

          client.close();
        });
      });
    });

    return response;
  },
  solr: async (): Promise<responseType[]> => {
    console.log(`[SOLR] endpointAll`);

    let query = solrClient.query().q({});
    const rows: number = await new Promise((resolve, reject) => {
      solrClient.search(query, function (err, result) {
        if (err) reject(err);

        resolve(result.response.numFound);
      });
    });

    query = solrClient.query().q({}).rows(rows);
    const response: responseType[] = await new Promise((resolve, reject) => {
      solrClient.search(query, function (err, result) {
        if (err) reject(err);

        let res: responseType[] = new Array(result.response.docs.length);
        for (let i = 0; i < res.length; i++) {
          res[i] = {
            tweet: result.response.docs[i].text[0],
            user: result.response.docs[i].userName[0],
          };
        }

        resolve(res);
      });
    });

    return response;
  },
};

/**
 * Endpoint action to insert new data.
 */
const endpointAdd: endpointAction = {
  posgres: async (tweet: string, user: string): Promise<string> => {
    console.log(`[POSGRES] endpointAdd <- {tweet: ${tweet}, user: ${user}}`);

    let status: string;

    const client = new Client({ connectionString: posgresConnection });
    await client.connect();

    try {
      const res = await client.query(
        "INSERT INTO tweets(id, text, userName) VALUES($1, $2, $3) RETURNING *",
        [ID(), tweet, user]
      );
      // console.log(res.rows[0]);
      status = "200 OK";
    } catch (err) {
      // console.log(err.stack);
      status = "500 ERROR";
    }

    await client.end();

    return status;
  },
  mongodb: async (tweet: string, user: string): Promise<string> => {
    console.log(`[MONGODB] endpointAdd <- {tweet: ${tweet}, user: ${user}}`);

    let status: string;

    const client = new MongoClient(mongodbConnection, {
      useUnifiedTopology: true,
    });
    client.connect((err) => {
      const db = client.db("solartweets");
      const collection = db.collection("tweets");

      collection.insertOne({
        text: tweet,
        userName: user,
        date: DATE(),
        retweets: 0,
        likes: 0,
      });

      client.close();
    });

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

    const client = new Client({ connectionString: posgresConnection });
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
  mongodb: async (tweet: string): Promise<responseType[]> => {
    console.log(`[MONGODB] endpointSearchByTweet <- {tweet: ${tweet}}`);

    const client = new MongoClient(mongodbConnection, {
      useUnifiedTopology: true,
    });
    const response: responseType[] = await new Promise((resolve, reject) => {
      client.connect((err) => {
        if (err) reject(err);

        const db = client.db("solartweets");
        const collection = db.collection("tweets");

        collection
          .find({ text: { $regex: `.*${tweet}.*` } })
          .toArray((err, docs) => {
            if (err) reject(err);

            let res: responseType[] = new Array(docs.length);
            for (let i = 0; i < res.length; i++) {
              res[i] = { tweet: docs[i].text, user: docs[i].userName };
            }

            resolve(res);

            client.close();
          });
      });
    });

    return response;
  },
  solr: async (tweet: string): Promise<responseType[]> => {
    console.log(`[SOLR] endpointSearchByTweet <- {tweet: ${tweet}}`);

    let query = solrClient.query().q({});
    const rows: number = await new Promise((resolve, reject) => {
      solrClient.search(query, function (err, result) {
        if (err) reject(err);

        resolve(result.response.numFound);
      });
    });

    query = solrClient.query().q({ text: tweet }).rows(rows);
    const response: responseType[] = await new Promise((resolve, reject) => {
      solrClient.search(query, function (err, result) {
        if (err) reject(err);

        let res: responseType[] = new Array(result.response.docs.length);
        for (let i = 0; i < res.length; i++) {
          res[i] = {
            tweet: result.response.docs[i].text[0],
            user: result.response.docs[i].userName[0],
          };
        }

        resolve(res);
      });
    });

    return response;
  },
};

/**
 * Endpoint action to search by queried user.
 */
const endpointSearchByUser: endpointAction = {
  posgres: async (user: string): Promise<responseType[]> => {
    console.log(`[POSGRES] endpointSearchByUser <- {user: ${user}}`);

    const client = new Client({ connectionString: posgresConnection });
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
  mongodb: async (user: string): Promise<responseType[]> => {
    console.log(`[MONGODB] endpointSearchByUser <- {user: ${user}}`);

    const client = new MongoClient(mongodbConnection, {
      useUnifiedTopology: true,
    });
    const response: responseType[] = await new Promise((resolve, reject) => {
      client.connect((err) => {
        if (err) reject(err);

        const db = client.db("solartweets");
        const collection = db.collection("tweets");

        collection
          .find({ userName: { $regex: `.*${user}.*` } })
          .toArray((err, docs) => {
            if (err) reject(err);

            let res: responseType[] = new Array(docs.length);
            for (let i = 0; i < res.length; i++) {
              res[i] = { tweet: docs[i].text, user: docs[i].userName };
            }

            resolve(res);

            client.close();
          });
      });
    });

    return response;
  },
  solr: async (user: string): Promise<responseType[]> => {
    console.log(`[SOLR] endpointSearchByUser <- {user: ${user}}`);

    let query = solrClient.query().q({});
    const rows: number = await new Promise((resolve, reject) => {
      solrClient.search(query, function (err, result) {
        if (err) reject(err);

        resolve(result.response.numFound);
      });
    });

    query = solrClient.query().q({ userName: user }).rows(rows);
    const response: responseType[] = await new Promise((resolve, reject) => {
      solrClient.search(query, function (err, result) {
        if (err) reject(err);

        let res: responseType[] = new Array(result.response.docs.length);
        for (let i = 0; i < res.length; i++) {
          res[i] = {
            tweet: result.response.docs[i].text[0],
            user: result.response.docs[i].userName[0],
          };
        }

        resolve(res);
      });
    });

    return response;
  },
};

const ID = () => {
  // Math.random should be unique because of its seeding algorithm.
  // Convert it to base 36 (numbers + letters), and grab the first 9 characters
  // after the decimal.
  return "_" + Math.random().toString(36).substr(2, 9);
};

const DATE = () => {
  let date_ob = new Date();

  // adjust 0 before single digit date
  let date = ("0" + date_ob.getDate()).slice(-2); // current date
  let month = ("0" + (date_ob.getMonth() + 1)).slice(-2); // current month
  let year = date_ob.getFullYear(); // current year
  let hours = date_ob.getHours(); // current hours
  let minutes = date_ob.getMinutes(); // current minutes
  let seconds = date_ob.getSeconds(); // current seconds

  return (
    year +
    "-" +
    month +
    "-" +
    date +
    "T" +
    hours +
    ":" +
    minutes +
    ":" +
    seconds +
    "Z"
  );
};

export {
  DBMS,
  endpointAll,
  endpointAdd,
  endpointSearchByTweet,
  endpointSearchByUser,
};
