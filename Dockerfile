FROM node:18
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn
COPY . .
CMD ["./run-dev.sh"]
