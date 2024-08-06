FROM node:lts-hydrogen
LABEL maintainer="anil.natha@jpl.nasa.gov"
LABEL version="0.0.1"

WORKDIR /app

# Copy files
COPY package.json ./
COPY package-lock.json ./

# Set up application
RUN npm i

USER node
COPY ./* .

USER root
CMD ["npm", "run", "dev"]