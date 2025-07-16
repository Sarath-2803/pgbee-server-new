FROM node:latest

WORKDIR /app

RUN npm install -g pnpm

COPY . .

RUN pnpm i --recursive

EXPOSE 8000
EXPOSE 80

CMD ["pnpm", "run", "dev"]
