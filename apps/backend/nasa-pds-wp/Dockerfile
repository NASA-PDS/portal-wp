FROM wordpress:6.3.1-php8.2-apache
LABEL maintainer="anil.natha@jpl.nasa.gov"
LABEL version="0.0.1"

WORKDIR /usr/src/wordpress/wp-content
COPY ./data/wp-content/themes/ themes/
COPY ./data/wp-content/plugins/ plugins/

RUN mkdir uploads

# Commenting-out this `COPY` statement:
#
#     COPY ./uploads uploads
#
# I suspect the intent here is to have a filesystem location for media files
# uploaded to WordPress, so rather than COPY there should be a `volume` in
# the `docker-compose.yaml` (yes, with an `a`) 😉


EXPOSE 80

WORKDIR /var/www/html/
