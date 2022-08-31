FROM node:16-alpine3.15

# Install the AWS CLI - needed to load in secrets safely from S3 – and `postgresql` for DB client.
# See https://aws.amazon.com/blogs/security/how-to-manage-secrets-for-amazon-ec2-container-service-based-applications-by-using-amazon-s3-and-docker/
RUN apk add --no-cache aws-cli postgresql

# https://stackoverflow.com/a/65443098/2803757
# + Follow the conventional deploy location for all simple ECS apps.
WORKDIR /var/www/html
COPY ./ ./

RUN npm install --force --quiet

# We always want ECS builds to be 'prod-like' from Next's perspective, including
# on staging => `NODE_ENV=production`.
RUN NODE_ENV=production npm run build

ARG PORT

ENV HOST=0
ENV PORT=$PORT

EXPOSE $PORT

ENTRYPOINT [ "npm", "start" ]
