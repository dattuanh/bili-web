FROM node:18-alpine as builder

ARG SSH_PRIVATE_KEY
RUN mkdir /root/.ssh/
RUN apk update && apk add git openssh
RUN echo "${SSH_PRIVATE_KEY}" > /root/.ssh/id_rsa
RUN chmod 600 /root/.ssh/id_rsa
RUN ssh-keyscan github.com > /root/.ssh/known_hosts

WORKDIR /usr/src/app
COPY package.json ./
COPY yarn.lock ./
RUN yarn install --network-concurrency 1
COPY . ./
RUN yarn build 

EXPOSE 5000
CMD ["yarn", "start:prod"]

