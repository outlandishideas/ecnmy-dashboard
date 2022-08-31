# For local docker-compose use only – CMD is `npm run dev`.
# See also `deploy/Dockerfile` which does this but with Prod builds and installing the AWS CLI.

FROM node:16-alpine3.15

RUN apk add postgresql

# https://stackoverflow.com/a/65443098/2803757
WORKDIR /var/www/html
COPY ./ ./

# There's a decent change an incompatible binary will be in node_modules,
# so a force install is the safest option. See
# https://nextjs.org/docs/messages/failed-loading-swc
RUN npm install --force

ARG PORT

ENV HOST=0
ENV PORT=$PORT

EXPOSE $PORT

CMD [ "npm", "run", "dev" ]
