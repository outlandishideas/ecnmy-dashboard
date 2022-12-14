#!/bin/sh

# This script is taken from https://aws.amazon.com/blogs/security/how-to-manage-secrets-for-amazon-ec2-container-service-based-applications-by-using-amazon-s3-and-docker/
# and is used to set up app secrets in ECS without exposing them as widely as using ECS env vars directly would.

# Check that the environment variable has been set correctly
if [ -z "$SECRETS_URI" ]; then
  echo >&2 'error: missing SECRETS_URI environment variable'
  exit 1
fi

# Load the S3 secrets file contents into the environment variables
export $(aws s3 cp ${SECRETS_URI} - | grep -v '^#' | xargs)

echo "Populating database..."
/var/www/html/scripts/populate_db_docker_deployed

# For now we load data in afresh on each app entry / startup. We don't have DB migrations
# or a way to populate it at build time, and no time this sprint to make a separate data patch ECS task.

# Simulate vanilla/default CMD. `npm run build` should have happened at Docker build time.
echo "Starting app..."
npm start --port=80
