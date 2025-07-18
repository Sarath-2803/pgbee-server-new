FROM node:latest

WORKDIR /app

RUN npm install -g pnpm

COPY . .

RUN pnpm i

EXPOSE 8000

CMD ["pnpm", "run", "dev"]
