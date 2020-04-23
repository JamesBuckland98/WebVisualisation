# Scrumble Back End

This is the back end for Scrumble, an Agile tool to be used in conjunction with various issue ticketing systems. This project aims to follow BT's ideal views for managing multiple GitLab projects from a simplified and joined user interface.

The back end for this project uses Spring Boot, a Java web framework, a framework that aims to make easy to use Spring standalone applications that you can "just run".

This Spring Boot application will be updated in conjunction with the Preact client.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

## Prerequisites

What things you need to install:

```
Java v11+
Docker (optional)
PostgreSQL (optional)
Flyway CLI (optional)
```

### Running

To aid in the process of starting the server, a Docker Compose file is provided for setting up the database. From the project root, run:

```
docker-compose up --build -d
```

This will start the Postgres DB in the background.

We only ran migrations via Docker, and if you can do the same, run from the project root:

```
docker run --rm \
    -v "$PWD/src/main/resources/db/migration/:/flyway/sql" \
    -v "$PWD:/flyway/conf" \
    --network="api_default" \
    flyway/flyway:latest-alpine migrate
```

The Docker image built for flyway will run "Flyway" without any arguments, making the container act like a normal CLI. However, that very large command is necessary upon every use. It is therefore recommend creating an alias in a .bashrc or .zshrc, so the tool can be just called with "flyway-cli [command]". An example of this alias:

```
alias flyway-cli='docker run --rm \
    -v "$PWD/src/main/resources/db/migration/:/flyway/sql" \
    -v "$PWD:/flyway/conf" \
    --network="api_default" \
    flyway/flyway:latest-alpine';
```

If you are running Postgres outside of Docker, or are not using Flyway via Docker, you will need to edit the [Flyway configuration file](flyway.conf).

To start the server, run:

```
./gradlew bootRun
```

See [running.md](../../running.md) for instructions relating to a real production deployment.

## Code Style

The code style followed loosely follow CheckStyle with the Sun Config. We also have used [Google Java Format](https://github.com/google/google-java-format) to auto-format what it can.

### Run CheckStyle

```
./gradlew checkstyleMain
```

## Built With

- [Spring Boot](https://spring.io/projects/spring-boot) - Web Framework used for API Server
