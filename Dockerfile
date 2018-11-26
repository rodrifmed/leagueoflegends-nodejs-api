FROM node:8

ARG RIOT_API_KEY
ARG USE_CACHE
ARG REDIS_HOST
ARG REDIS_PORT

ENV RIOT_API_KEY=$RIOT_API_KEY
ENV USE_CACHE=$USE_CACHE
ENV REDIS_HOST=$REDIS_HOST
ENV REDIS_PORT=$REDIS_PORT

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm install --only=production

# Bundle app source
COPY . .

EXPOSE 8080
CMD [ "npm", "start" ]