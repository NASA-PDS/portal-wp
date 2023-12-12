export NAME_PREFIX = pds-portal
export DB_CONTAINER_NAME = $(NAME_PREFIX)-db
export FRONTEND_CONTAINER_NAME = $(NAME_PREFIX)-frontend
export WORDPRESS_CONTAINER_NAME = ${NAME_PREFIX}-wordpress
export WPCLI_CONTAINER_NAME = ${NAME_PREFIX}-wpcli
export RUN_OPTIONS = 
export DOCKER_COMPOSE_YML = ./apps/docker-compose.yml

build:		## Builds all services using Docker Compose
	docker compose --file ${DOCKER_COMPOSE_YML} build

build-nocache:		## Builds all services using Docker Compose without the cache
	docker compose --file ${DOCKER_COMPOSE_YML} build --no-cache

build-db:		## Builds db service image
	docker compose --file ${DOCKER_COMPOSE_YML} build db

build-db-no-cache:		## Builds db service image without the cache
	docker compose --file ${DOCKER_COMPOSE_YML} build db --no-cache

build-frontend:		## Builds frontend service image
	docker compose --file ${DOCKER_COMPOSE_YML} build frontend

build-frontend-no-cache:		## Builds frontend service image without the cache
	docker compose --file ${DOCKER_COMPOSE_YML} build frontend --no-cache

build-wordpress:		## Builds wordpress service image
	docker compose --file ${DOCKER_COMPOSE_YML} build wordpress

build-wordpress-no-cache:		## Builds wordpress service image without the cache
	docker compose --file ${DOCKER_COMPOSE_YML} build wordpress --no-cache

build-wpcli:		## Builds wpcli service image
	docker compose --file ${DOCKER_COMPOSE_YML} build wpcli

build-wpcli-no-cache:		## Builds wpcli service image without the cache
	docker compose --file ${DOCKER_COMPOSE_YML} build wpcli --no-cache

destroy:		## Stops running app locally and removes Docker container images requiring a rebuild
	docker compose --file ${DOCKER_COMPOSE_YML} down --rmi all

list-images:		## List images related to this project
	docker images --filter=reference='$(NAME_PREFIX)*'

login-db:		## Open terminal window using db container
	docker exec -it $(DB_CONTAINER_NAME) /bin/bash

login-frontend:		## Open terminal window using frontend container
	docker exec -it $(FRONTEND_CONTAINER_NAME) /bin/bash

login-wpcli:		## Open terminal window using frontend container
	docker exec -it ${WPCLI_CONTAINER_NAME} /bin/bash

open:		## open default browser to view the portal
	open http://localhost:8080/

open-login:		## open default browser to login to the portal (bypass CAS)
	open http://localhost:8080/wp-login.php?external=wordpress

remove-containers:  ## Remove all containers related to this project.
	docker container ls --all | awk '{print $$2}' | grep "$(NAME_PREFIX)" | xargs -I {} docker rm -f {}

remove-images: remove-containers	## Remove all images related to this project. This depends on also removing project's containers; otherwise this target will fail if containers reference any images.
	docker images --all | awk '{print $$1}' | grep "${NAME_PREFIX}" | xargs -I {} docker rmi -f {}

restart:		## Restarts all services, does not reload environment variables
	docker compose --file ${DOCKER_COMPOSE_YML} restart

restart-db:		## Restarts the db service
	docker compose --file ${DOCKER_COMPOSE_YML} restart db

restart-frontend:		## Restarts the frontend service
	docker compose --file ${DOCKER_COMPOSE_YML} restart frontend

start:		## Starts up all services using Docker Compose
	docker compose --file ${DOCKER_COMPOSE_YML} up $(RUN_OPTIONS)

start-detached: RUN_OPTIONS = "-d" ## Starts up all services with Docker Compose in detached mode
start-detached: start

start-db:		## Starts up the db service using Docker Compose
	docker compose --file ${DOCKER_COMPOSE_YML} up $(RUN_OPTIONS) db

start-db-detached: RUN_OPTIONS = "-d" ## Starts up db service with Docker Compose in detached mode
start-db-detached: start-db

start-frontend:		## Starts up the frontend service using Docker Compose
	docker compose --file ${DOCKER_COMPOSE_YML} up $(RUN_OPTIONS) frontend

start-frontend-detached: RUN_OPTIONS = "-d" ## Starts up frontend service with Docker Compose in detached mode
start-frontend-detached: start-frontend

start-wordpress:		## Stars up the wordpress service using Docker Compose
	docker compose --file ${DOCKER_COMPOSE_YML} up ${RUN_OPTIONS} wordpress

start-wordpress-detached: RUN_OPTIONS = "-d" ## Starts up wordpress service with Docker Compose in detached mode
start-wordpress-detached: start-wordpress

start-wpcli:		## Starts up the wpcli service using Docker Compose
	docker compose --file ${DOCKER_COMPOSE_YML} up ${RUN_OPTIONS} wpcli

start-wpcli-detached: RUN_OPTIONS = "-d" ## Starts up wpcli service with Docker Compose in detached mode
start-wpcli-detached: start-wpcli

stop:		## Stops all running services
	docker compose --file ${DOCKER_COMPOSE_YML} stop

stop-db:		## Stops running db service
	docker compose --file ${DOCKER_COMPOSE_YML} stop db

stop-frontend:		## Stops running frontend service
	docker compose --file ${DOCKER_COMPOSE_YML} stop frontend

stop-wordpress:		## Stops running wordpress service
	docker compose --file ${DOCKER_COMPOSE_YML} stop wordpress

stop-wpcli:		## Stops running wpcli service
	docker compose --file ${DOCKER_COMPOSE_YML} stop wpcli

watch-containers:		## Display a list of running containers that refreshes periodically
	watch docker container ls

# ----------------------------------------------------------------------------
# Self-Documented Makefile
# ref: http://marmelab.com/blog/2016/02/29/auto-documented-makefile.html
# ----------------------------------------------------------------------------
help:						## (DEFAULT) This help information
	@echo ====================================================================
	@grep -E '^## .*$$'  \
		$(MAKEFILE_LIST)  \
		| awk 'BEGIN { FS="## " }; {printf "\033[33m%-20s\033[0m \n", $$2}'
	@echo
	@grep -E '^[0-9a-zA-Z_-]+:.*?## .*$$'  \
		$(MAKEFILE_LIST)  \
		| awk 'BEGIN { FS=":.*?## " }; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'  \
#		 | sort
.PHONY: help
.DEFAULT_GOAL := help
