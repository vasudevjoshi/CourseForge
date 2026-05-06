FROM node:20-alpine AS deps

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

FROM node:20-alpine

WORKDIR /app
COPY --from=deps /app/node_modules /app/node_modules
COPY . .

EXPOSE 5173
CMD ["npm", "run", "dev","--","--host","0.0.0.0", "--port", "5173"]