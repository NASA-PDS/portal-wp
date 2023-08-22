FROM wordpress:6.3.0-php8.2-apache
LABEL maintainer="anil.natha@jpl.nasa.gov"
LABEL version="0.0.1"

# THIS COPY CODE IS NOT WORKING!
WORKDIR /usr/src/wordpress/wp-content
COPY ./plugins plugins
COPY ./themes themes
RUN mkdir uploads
COPY ./uploads uploads

EXPOSE 80

WORKDIR /var/www/html/