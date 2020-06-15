const dbms: String[] = ["posgres", "mongodb", "solr"];

interface endpointAction {
  /**
   * READ_ONLY operations return the entire dbms response.
   * WRITE_ONLY operations return a status code of whether the operation went
   *    well or badly.
   */
  [indexer: string]: (tweet?: string, user?: string) => any;
}

const endpointAll: endpointAction = {
  posgres: (): any => {
    console.log(`[POSGRES] endpointAll`);

    return [
      { tweet: "tweet1", user: "user1" },
      { tweet: "tweet2", user: "user2" },
    ];
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

const endpointSearchByTweet: endpointAction = {
  posgres: (tweet: string): any => {
    console.log(`[POSGRES] endpointSearchByTweet <- {tweet: ${tweet}}`);

    return [
      { tweet: "queried_tweet1", user: "user1" },
      { tweet: "queried_tweet2", user: "user2" },
    ];
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

const endpointSearchByUser: endpointAction = {
  posgres: (user: string): any => {
    console.log(`[POSGRES] endpointSearchByUser <- {user: ${user}}`);

    return [
      { tweet: "tweet1", user: "queried_user1" },
      { tweet: "tweet2", user: "queried_user2" },
    ];
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
  dbms,
  endpointAll,
  endpointAdd,
  endpointSearchByTweet,
  endpointSearchByUser,
};
