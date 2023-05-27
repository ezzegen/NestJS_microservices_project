<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

## NestJS microservices. Step_4.

TypeScrypt, TypeORM, RabbitMQ.
## Description
Шаблон проекта, состоящий только из двух микросервисов - профиль и авторизация.
- запускается через docker;
- у каждого микросервиса своя отдельная база данных (у одного таблица пользователей, у другого таблица профайла);
- общение микросервисов между собой через rabbitMq;

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
