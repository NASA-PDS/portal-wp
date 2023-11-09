# Planetary Data System (PDS) — Portal Codebase

This repo aims to contains the configuration to stand up the services needed by the Planetary Data System (PDS) to establish its web presence, while also providing the means to provide support for local development.

## Prerequisites

### Install Docker Desktop

The services in this codebase rely on docker containerization to host the various services. Locally, this can be achieved by using [Docker Desktop](https://www.docker.com/products/docker-desktop/). Other tools, like [podman](https://podman.io/) could be used, but would require changes to the configuration as the recipes contained in the Makefile are specific to docker.

### Install Node or Node Version Manager

The `frontend` service relies on Node.js. The minimum version of Node.js that is needed is specified in [frontend/.nvmrc](frontend/.nvmrc). For developers that work on multiple projects relying on different versions of Node.js, we recommend installing [Node Version Manager (nvm)](https://github.com/nvm-sh/nvm). `nvm` helps faciliate easily switching between different versions of node for a given shell environment.

## Setup

To set up your local machine, follow these instructions:

### Clone repositories

#### nasa-pds/portal-wp (this repository)

```shell
# Clone this repo using your preffered method, https is shown here
git clone https://github.com/NASA-PDS/portal-wp.git
```

#### nasa-pds/wds-react

The goal is create a set of components that are built for React and neatly organize them into a package named `wds-react`. During development we can use `npm link` to reference this for development purposes.

```
# Clone this repo using your preffered method, https is shown here
git clone https://github.com/NASA-PDS/wds-react.git
```

### Setup Docker Secrets

To store and retrieve values needed by the `db` and `wordpress` services, we rely on docker secrets. The files you are about to create, should never be committed to the repository. Our `.gitignore` is already configured to ignore these secret files, but if new services are added, the `.gitignore` will need to be updated to ignore new folders containing docker secrets. 

Here are instructions to configure the docker secrets:

#### Database Service

1. Within the `db/secrets` folder, create new files for each of the files ending in `.example` by copying the `.example` file and renaming it so it doesn't end with `.example`.
2. Update the seceret file contents: 
   * `MYSQL_DATABASE.txt`: store the name of the database you wish to use for the Wordpress Service, this will be needed later.
   * `MYSQL_PASSWORD.txt`: create a unique password and store it in this file, this will be needed later.
   * `MYSQL_ROOT_PASSWORD.txt`: This password is for root access to your local database, create a unique password and store it in this file.
   * `MYSQL_USER.txt`: select the name of the database user account that the wordpress service will use when connecting to the database, this will be needed later.

#### Wordpress service

1. Within the `wordpress/secrets` folder, create new files for each of the files ending in `.example` by copying the `.example` file and renaming it so it doesn't end with `.example`.
2. Update the seceret file contents: 
   * `WORDPRESS_DB_NAME.txt`: reuse the value stored in `db/secrets/MYSQL_DATABASE.txt`.
   * `WORDPRESS_DB_PASSWORD.txt`: reuse the value stored in `db/secrets/MYSQL_PASSWORD.txt`.
   * `WORDPRESS_DB_USER.txt`: reuse the value stored in `db/secrets/MYSQL_USER.txt`.

## Development Instructions

All of the services needed for the platform are specified in the [`docker-compose.yml`](docker-compose.yml) file except for the [frontend service](#frontend-service-workaround). 

To run these services locally, ensure Docker Desktop is [installed](#install-docker-desktop) and running.

First build the containers, as needed:

```
docker-compose build
```

And then start the containers:

```
docker-compose up
```

### Notes:

#### Invoking Docker Compose

Depending on the version of docker compose you have installed, it can be invoked differently. Docker Compose V1 uses `docker-compose`; whereas the newer V2 uses `docker compose`, note the missing dash. Reference: https://docs.docker.com/compose/migrate/#docker-compose-vs-docker-compose

#### Common commands

Many of the commands often used for local development are captured in the [`Makefile`](Makefile.sh). Review this file for other helpful recipes to delete images, restart services, etc. For example:

```
make build-images    # Builds all images specified in docker-compose.yml
make start           # Starts all services specified in docker-compose.yml
```

### Frontend service workaround

Additional configuration is needed to standup a containerized frontend service due to an integration issue with `npm link`. ***Until then, the frontend service needs to be run separately.***

To run the frontend service, follow these steps:

#### I. Install frontend service dependencies

   1. If you installed [`nvm`](#install-node-or-node-version-manager), open a ***new*** terminal window, navigate to the `frontend` folder at the root of the `portal-wp` repo and set up Node.js:
      ```
      nvm use
      ```

   2. Install dependencies
      ```
      npm clean-install
      ```

#### II. Publish `wds-react` locally via `npm link`

   1. If you installed [`nvm`](#install-node-or-node-version-manager), open a ***new*** terminal window, navigate to the folder containing the `wds-react` repo, and set up Node.js:
      ```
      nvm use
      ```

   2. Install the dependencies needed by `wds-react`:
      ```
      npm clean-install
      ```

   3. Build the package (rerun as you make updates to `wds-react`):
      ```
      npm build-lib
      ```

   4. Publish the package locally, so it can be referenced by `portal-wp/frontend` in the next step
      ```
      npm link
      ```

   5. Run `npm link -g`, if you see `@nasapds/wds-react` in the list, it was published locally successfully (note the path on your machine will point to the location of the `wds-react` repo on your machine):
      ```
      % npm list -g
      /Users/<username>/.nvm/versions/node/v18.18.2/lib
      ├── @nasapds/wds-react@0.1.0 -> ./../../../../../Projects/PDS/Engineering Node/Repos/wds-react
      ├── corepack@0.19.0
      └── npm@9.8.1npm link -g
      ```

#### III. Link to locally published copy of `wds-react`

   1. If you installed [`nvm`](#install-node-or-node-version-manager), open a ***new*** terminal window, navigate to the `frontend` folder at the root of the `portal-wp` repo and set up Node.js:
      ```
      nvm use
      ```

   2. Reference the locally published instance of the `wds-react` package
      ```
      npm link @nasapds/wds-react
      ```

      ***Note:*** Anytime `npm install` is run in `portal-wp/frontend`, you'll have to rerun the `npm link @nasapds/wds-react` command to relink the package.

#### IV. Start the frontend service

   ```
   npm run dev
   ```

   Open a browser and navigate to, https://localhost:5173

## Usage

TBD
