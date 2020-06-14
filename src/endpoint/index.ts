const dbms: String[] = ["posgres", "mongodb", "solr"];

interface endpointAction {
  /**
   * READ_ONLY operations return the entire dbms response.
   * WRITE_ONLY operations return a status code of whether the operation went
   *    well or badly.
   */
  [indexer: string]: () => any;
}

const endpointAll: endpointAction = {
  posgres: (): any => {},
  mongodb: (): any => {},
  solr: (): any => {},
};

const endpointAdd: endpointAction = {
  posgres: (): string => {
    let status: string;
    status = "200 OK";

    console.log("hit posgres");

    return status;
  },
  mongodb: (): string => {
    let status: string;
    status = "200 OK";

    console.log("hit mongodb");

    return status;
  },
  solr: (): string => {
    let status: string;
    status = "200 OK";

    console.log("hit solr");

    return status;
  },
};

export { dbms, endpointAll, endpointAdd };
