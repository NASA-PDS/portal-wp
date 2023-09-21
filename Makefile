export NAME_PREFIX = pds-portal
export DB_CONTAINER_NAME = $(NAME_PREFIX)-db
export WWW_CONTAINER_NAME = $(NAME_PREFIX)-www
export WORDPRESS_CONTAINER_NAME = ${NAME_PREFIX}-wordpress
export WPCLI_CONTAINER_NAME = ${NAME_PREFIX}-wpcli
export RUN_OPTIONS = 

build:	## Builds all services using Docker Compose
	docker-compose build

build-nocache:	## Builds all services using Docker Compose without the cache
	docker-compose build --no-cache

build-db:		## Builds db service image
	docker-compose build db

build-db-no-cache:	## Builds db service image without the cache
	docker-compose build db --no-cache

build-www:	## Builds www service image
	docker-compose build www

build-www-no-cache:	## Builds www service image without the cache
	docker-compose build www --no-cache

build-wordpress:	## Builds wordpress service image
	docker-compose build wordpress

build-wordpress-no-cache:	## Builds wordpress service image without the cache
	docker-compose build wordpress --no-cache

build-wpcli: ## Builds wpcli service image
	docker-compose build wpcli

build-wpcli-no-cache: ## Builds wpcli service image without the cache
	docker-compose build wpcli --no-cache

destroy:	## Stops running app locally and removes Docker container images requiring a rebuild
	docker-compose down --rmi all

list-images: ## List images related to this project
	docker images --filter=reference='$(NAME_PREFIX)*'

login-db: ## Open terminal window using db container
	docker exec -it $(DB_CONTAINER_NAME) /bin/bash

login-www: ## Open terminal window using www container
	docker exec -it $(WWW_CONTAINER_NAME) /bin/bash

login-wpcli: ## Open terminal window using frontend container
	docker exec -it pds-portal-wpcli /bin/bash

open: ## open default browser to view the portal
	open http://localhost:8080/

open-login: ## open default browser to login to the portal (bypass CAS)
	open http://localhost:8080/wp-login.php?external=wordpress

remove-containers:  ## Remove all containers related to this project.
	docker container ls --all | awk '{print $$2}' | grep "$(NAME_PREFIX)" | xargs -I {} docker rm -f {}

remove-images: remove-containers	## Remove all images related to this project. This depends on also removing project's containers; otherwise this target will fail if containers reference any images.
	docker images --all | awk '{print $$1}' | grep "${NAME_PREFIX}" | xargs -I {} docker rmi -f {}

restart:	## Restarts all services, does not reload environment variables
	docker-compose restart

restart-db:	## Restarts the db service
	docker-compose restart db

restart-www:	## Restarts the www service
	docker-compose restart www

start:	## Starts up all services using Docker Compose
	docker-compose up $(RUN_OPTIONS)

start-detached: RUN_OPTIONS = "-d" ## Starts up all services with Docker Compose in detached mode
start-detached: start

start-db:	## Starts up the db service using Docker Compose
	docker-compose up $(RUN_OPTIONS) db

start-db-detached: RUN_OPTIONS = "-d" ## Starts up db service with Docker Compose in detached mode
start-db-detached: start-db

start-www:	## Starts up the www service using Docker Compose
	docker-compose up $(RUN_OPTIONS) www

start-www-detached: RUN_OPTIONS = "-d" ## Starts up the application with Docker Compose in detached mode
start-www-detached: start-www

start-wordpress:	## Stars up the wordpress service using Docker Compose
	docker-compose up ${RUN_OPTIONS} wordpress

start-wordpress-detached: RUN_OPTIONS = "-d" ## Starts up wordpress service with Docker Compose in detached mode
start-wordpress-detached: start-wordpress

start-wpcli:	## Starts up the wpcli service using Docker Compose
	docker-compose up ${RUN_OPTIONS} wpcli

start-wpcli-detached: RUN_OPTIONS = "-d" ## Starts up wpcli service with Docker Compose in detached mode
start-wpcli-detached: start-wpcli

stop:	## Stops all running services
	docker-compose stop

stop-db:	## Stops running db service
	docker-compose stop db

stop-www:	## Stops running www service
	docker-compose stop www

stop-wordpress	## Stops running wordpress service
	docker-compose stop wordpress

stop-wpcli: ## Stops running wpcli service
	docker-compose stop wpcli

watch-containers: ## Display a list of running containers that refreshes periodically
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
