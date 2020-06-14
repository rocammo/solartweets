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
    return [
      { tweet: "tweet1", user: "user1" },
      { tweet: "tweet2", user: "user2" },
    ];
  },
  mongodb: (): any => {},
  solr: (): any => {},
};

const endpointAdd: endpointAction = {
  posgres: (tweet: string, user: string): string => {
    let status: string;
    status = "200 OK";

    console.log("[POSGRES] {tweet:", tweet + ",", "user:", user + "}");

    return status;
  },
  mongodb: (tweet: string, user: string): string => {
    let status: string;
    status = "200 OK";

    console.log("[MONGODB] {tweet:", tweet + ",", "user:", user + "}");

    return status;
  },
  solr: (tweet: string, user: string): string => {
    let status: string;
    status = "200 OK";

    console.log("[SOLR] {tweet:", tweet + ",", "user:", user + "}");

    return status;
  },
};

export { dbms, endpointAll, endpointAdd };
