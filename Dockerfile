FROM node:18-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

RUN NODE_OPTIONS="--max-old-space-size=2048" npm run build

FROM node:18-alpine

WORKDIR /app

COPY --from=build /app/build ./build

RUN npm install -g serve

EXPOSE 8000
CMD ["serve", "-s", "build", "-l", "8000"]
