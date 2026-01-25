FROM node:20-alpine AS base
WORKDIR /app
ENV NODE_ENV=development

COPY package.json ./
# package-lock may not exist; use npm install for MVP
RUN npm install --no-fund --no-audit

COPY . .

EXPOSE 3000
CMD ["npm","run","dev"]
