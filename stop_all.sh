ENV=$1
IMAGE_TAG=$2
export IMAGE_TAG=$IMAGE_TAG
if [ "$ENV" == "local" ]; then
    docker-compose -f docker-compose.yml down
elif [ "$ENV" == "prod" ]; then
    docker-compose -f docker-compose-prod.yml down
else
    echo "Error: Invalid ENV parameter. Use 'local', 'prod'."
    exit 1
fi