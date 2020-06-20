#!/bin/sh

# =============================================================================
#  Script Name: populate_dbms.sh
#  Description: Import data from file into DBMS instances hosted within Docker.
#  Author     : Rodrigo Casamayor
#  Email      : alu.89657@usj.es
# =============================================================================

# PostgreSQL
echo "PostgreSQL dump..."
echo "========================================"
docker container exec -i $(docker-compose ps -q postgres) psql -U posgres tweets <tweets.sql
echo "\n[ OK ]"
echo "========================================\n\n"

# MongoDB
echo "MongoDB dump..."
echo "========================================"
docker cp ./tweets.json mongodb:/tmp/
docker container exec -i $(docker-compose ps -q mongodb) mongoimport --authenticationDatabase admin -u mongodb -p mongodb -d solartweets -c tweets --file /tmp/tweets.json --jsonArray
echo "\n[ OK ]"
echo "========================================\n\n"

# Solr
echo "Solr dump..."
echo "========================================"
docker cp ./tweets.json solr:/var/solr/data/solartweets/data
curl 'http://localhost:8983/solr/solartweets/update/json?commit=true' --data-binary @tweets.json -H 'Content-type:application/json'
echo "\n[ OK ]"
echo "========================================\n"
