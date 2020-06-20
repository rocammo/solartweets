# solartweets

A small Google-style search engine of the most interesting tweets, powered by PostgreSQL, MongoDB and Apache Solr.

## Installation

> Run `npm install` in the **/solartweets** directory.

## Pre-Usage

Before start using it, the three different DBMS implemented have to be deployed. To do so, three Docker containers (or three docker-compose services) have been built to facilitate multi-platform development, deployment and operation. In addition, three scripts have been provided to improve its operation: `start.sh`, `populate_dbms.sh` and `stop.sh`.

Before going to the next step, you need to:

> Run `./start.sh`, followed by `./populate_dbms.sh` in the **/solartweets** directory.

At this point, you can now proceed with **Usage** step.

Whenever you are done, you just have to:

> Run `./stop.sh`in the **/solartweets** directory.

## Usage

> Run `npm start` and enjoy!
