FROM node:22-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .
RUN npm run build

FROM node:22-alpine AS runtime
WORKDIR /app

ENV NODE_ENV=production \
    PORT=3000 \
    UPLOAD_DIR=/app/uploads \
    RESUME_DIR=/app/private/resumes

COPY package.json package-lock.json ./
RUN npm install --omit=dev --ignore-scripts && npm cache clean --force
COPY --from=build /app/dist ./dist

RUN mkdir -p /app/uploads /app/private/resumes && chown -R node:node /app
USER node

EXPOSE 3000
CMD ["node", "dist/server/node-build.mjs"]
