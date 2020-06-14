import express = require("express");
const app: express.Application = express();

import * as config from "./config";
import * as endpoint from "./endpoint";

app.listen(config.port, () =>
  console.log(`[LOG] server listening on port ${config.port}`)
);

app.get("/:dbms/all", (req: any, res: any) => {
  const dbms: string = req.params.dbms;

  // check wether the dbms is accepted or not
  const acceptedDbms: string = isDbmsAccepted(dbms);

  // execute action into dbms
  const data: any =
    dbms.localeCompare(acceptedDbms) === 0
      ? endpoint.endpointAll[dbms]()
      : "500 ERROR";

  res.send(data);
});

app.get("/:dbms/add/:tweet/:user?", (req: any, res: any) => {
  const dbms: string = req.params.dbms;
  const tweet: string = req.params.tweet;
  const user: string = req.params.user ? req.params.user : "anonymous";

  // check wether the dbms is accepted or not
  const acceptedDbms: string = isDbmsAccepted(dbms);

  // execute action into dbms
  const returnedStatus: string =
    dbms.localeCompare(acceptedDbms) === 0
      ? endpoint.endpointAdd[dbms]()
      : "500 ERROR";

  res.send({
    dbms: acceptedDbms,
    tweet: tweet,
    user: user,
    status: returnedStatus,
  });
});

function isDbmsAccepted(dbms: string): string {
  return endpoint.dbms.indexOf(dbms) >= 0 ? dbms : "404 Not Found";
}
