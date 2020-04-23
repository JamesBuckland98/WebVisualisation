# Scrumble

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes, as well as (roughly) describe the production deployment process.

### Prerequisites

```
NodeJS v12+
NPM (or Yarn, but slight changes may need to be made to the package.json file)
Java v11+
Docker/Docker-Compose (optional)
PostgreSQL (optional)
Flyway 6.3.2 (optional)
```

### Running in Production

Look in each sub-project for running in a development context.

#### API Server

Firstly, you will need to copy some files from your development or CI system to prepare for deployment. You will need the Jar file, the [Flyway configuration file](packages/api/flyway.conf), the [database migrations](packages/api/src/main/resources/db/migration), the [Dockerfile](packages/api/Dockerfile), and the [docker-compose-prod.yml](packages/api/docker-compose-prod.yml). I recommend copying the migrations files to `db-migrations`, and the docker-compose file to `docker-compose`.

You can build the Jar by running the following command from the [api](packages/api) directory:

```
./gradlew build
```

The jar can then be found in [api](packages/api/build/libs).

Secondly, you will need to build the docker file. This will run Postgres, the Scrumble Api, and Jaeger. This can be done by running:

```
docker-compose up --build -d
```

If you choose to use some other Postgres source, you will need to edit the [application-prod.properties](packages/api/src/main/resources/application-prod.properties) file and provide your database configuration details.

To run database migrations, run the following command:

```
docker run --rm \
    -v "$PWD/db-migrations/:/flyway/sql" \
    -v "$PWD:/flyway/conf" \
    --network="scrumble_default" \
    flyway/flyway:latest-alpine migrate
```

The Docker image built for flyway will run "Flyway" without any arguments, making the container act like a normal CLI. However, that very large command is necessary upon every use. It is therefore recommend creating an alias in a .bashrc or .zshrc, so the tool can be just called with "flyway-cli [command]". An example of this alias:

```
alias flyway-cli='docker run --rm \
    -v "$PWD/db-migrations/:/flyway/sql" \
    -v "$PWD:/flyway/conf" \
    --network="scrumble_default" \
    flyway/flyway:latest-alpine';
```

The network you use depends on the parent directory, so if the docker compose is indeed within `scrumble`, the command above will work just fine. Change it if you change the directory name.

This Flyway container uses a configuration file [flyway.conf](packages/api/flyway.conf), which will need to be edited if you are not using the Docker-Compose database, but your own Postgres source.

#### Front End Client

To prepare the front end for deployment, in your development or CD environment, from the [web-app](packages/web-app) directory, run:

```
npm install
npm run build
```

The output can be found in [build](packages/web-app/build). That output can then be used, in conjunction with the [Nginx config provided](exampleNginx.conf), to serve the front end.

#### GitLab

As the API consumes data from a GitLab source, a GitLab instance (with a valid user account) is necessary.

For demonstration purposes, a GitLab instance has been set up at [gitlab.ryanchristian.dev](https://gitlab.ryanchristian.dev). The Client ID and Secret for OAuth used to configure this instance can be found in [application.properties](packages/api/src/main/resources/application.properties).

Navigate to the instance in your browser and register for a new account using your own name, email, and password of your choice. You will need it in order to use this application.

If you would like to configure this application to use your own GitLab instance, you will need to register Scrumble as an OAuth application in the administration settings of your target GitLab instance. Instructions on this can be found [here](https://docs.gitlab.com/ee/integration/oauth_provider.html#oauth-applications-in-the-admin-area).

In this configuration, provide a callback URL of <your_base_api_url>/api/login/oauth2/code. If you would like a different URL, you must change the value of the base URI for the redirection endpoint in [SecurityConfig.java](packages/api/src/main/java/com/nsa/bt/scrumble/config.SecurityConfig.java) accordingly. More info on this value can be found [here](https://docs.spring.io/spring-security/site/docs/5.0.7.RELEASE/reference/html/oauth2login-advanced.html#oauth2login-advanced-redirection-endpoint).

You will need to alter values in [application.properties](packages/api/src/main/resources/application.properties), or your property file of choice for the profile you'll be running.
Please note, all properties listed here depend on the fact that spring.security.oauth2.client.registration.gitlab.client-name has been set to 'gitlab'.

After registering Scrumble as an OAuth application, GitLab will give you an application ID and a secret. These values, along with the full callback URL you provided must be given to the following properties:

```
spring.security.oauth2.client.registration.gitlab.client-id=<your_application_id>
spring.security.oauth2.client.registration.gitlab.client-secret=<your_secret>
spring.security.oauth2.client.registration.gitlab.redirect-uri=<your_callback_url>
```

In an application properties file you will also need to set your own values for the following:
```
spring.security.oauth2.client.provider.gitlab.token-uri=<your_gitlab_url>/oauth/token
spring.security.oauth2.client.provider.gitlab.authorization-uri=<your_gitlab_url>/oauth/authorize
spring.security.oauth2.client.provider.gitlab.user-info-uri=<your_gitlab_url>/oauth/userinfo
```
