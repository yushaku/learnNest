# Description

Project use [Nest](https://github.com/nestjs/nest) 10 framework TypeScript

## Requirements

- Docker and docker-compose are installed.
- NodeJS version 18 is installed.

## Development

Migrate database and running the app

```bash
cp .env.dev .env
docker-compose up
```

- the OVERHEAD of this app.
  Using k6 test with 1000 v_users call API `http://app`

| test      | https time | RPS          | min    | max      | p95   | cpu  |
| --------- | ---------- | ------------ | ------ | -------- | ----- | ---- |
| get empty | 13.84 ms   | 2118 times/s | 0.15ms | 520.27ms | 55.87 | 113% |

## Deploy

```bash
cp .env.prod .env
yarn
yarn build
./run-prod.sh
```
