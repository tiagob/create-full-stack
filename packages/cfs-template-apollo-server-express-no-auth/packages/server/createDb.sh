#!/bin/bash

# TODO: Remove in favor of using docker for DB
# Create database for dev
psql -d postgres -c "CREATE DATABASE postgres;"
psql -d postgres -c "CREATE USER postgres WITH ENCRYPTED PASSWORD 'postgrespassword';"
psql -d postgres -c "GRANT ALL PRIVILEGES ON DATABASE postgres TO postgres;"
