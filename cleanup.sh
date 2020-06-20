#!/bin/sh

# shutdown and remove volumes
docker-compose down -v

# start
docker-compose up -d

# populate containers with data
./populate_dbms.sh
