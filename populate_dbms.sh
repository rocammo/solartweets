#!/bin/sh

# =============================================================================
#  Script Name: populate_dbms.sh
#  Description: Import data from file into DBMS instances hosted within Docker.
#  Author     : Rodrigo Casamayor
#  Email      : alu.89657@usj.es
# =============================================================================

# PostgreSQL
docker container exec -i $(docker-compose ps -q postgres) psql -U posgres tweets <tweets.sql

# MongoDB
# docker ...

# Solr
# docker cp ./tweets.json solr:/opt/solr-8.5.2/example/exampledocs

# docker-compose run postgres <command>
# docker-compose run mongodb <command>
# docker-compose run solr <command>
