FROM hasura/graphql-engine:v1.3.2.cli-migrations-v2

COPY ./migrations /hasura-migrations
COPY ./metadata /hasura-metadata

CMD graphql-engine serve
