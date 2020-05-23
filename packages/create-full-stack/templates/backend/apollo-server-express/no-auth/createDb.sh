#!/bin/bash

# Create database for dev
psql -d postgres -c "CREATE DATABASE todo;"
psql -d postgres -c "CREATE USER todo WITH ENCRYPTED PASSWORD 'todo';"
psql -d postgres -c "GRANT ALL PRIVILEGES ON DATABASE todo TO todo;"
