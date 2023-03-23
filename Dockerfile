
FROM node:17-alpine3.14 as builder

WORKDIR /app

COPY package.json .
COPY yarn.lock .
COPY tsconfig.build.json .


COPY env .
COPY env ./env

RUN yarn --production=true
RUN cp -R node_modules prod_node_modules
RUN yarn --production=false
COPY . .

RUN yarn build 

FROM node:17-alpine3.14
ENV NODE_ENV=production
ENV PORT=3000

EXPOSE $PORT

WORKDIR /app

COPY package.json .
COPY --from=builder /app/env ./env
COPY --from=builder /app/prod_node_modules ./node_modules
COPY --from=builder /app/dist ./dist






