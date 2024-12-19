ARG IMAGE=node:22.12.0-alpine

FROM ${IMAGE}

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE $PORT

WORKDIR /home/node

RUN apk add --no-cache tini

ENTRYPOINT ["/sbin/tini", "--"]

COPY --chown=node:node package*.json yarn*.lock ./

RUN apk add --no-cache python3 g++ make \
    && yarn --production --no-progress \
    && yarn cache clean \
    && apk del --no-cache python3 g++ make

COPY --chown=node:node dist ./dist

USER node:node

CMD ["yarn", "start:prod"]
