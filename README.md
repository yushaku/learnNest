## Description

Project use [Nest](https://github.com/nestjs/nest) 10 framework TypeScript 

## Requirements

- Docker and docker-compose are installed.
- NodeJS version 18 is installed.

## Development

Migrate database and running the app 

```bash
$ cp .env.dev .env
$ docker-compose up
```

## Deploy
Prepare Database and update .env file

```bash
$ cp .env.prod .env
```

Build app

```bash
$ yarn
$ yarn build
```

Migrate database and running the app 

```bash
$ ./run-prod.sh
```
