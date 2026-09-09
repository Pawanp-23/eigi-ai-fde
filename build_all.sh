ENV=$1
IMAGE_TAG=$2
export IMAGE_TAG=$IMAGE_TAG
if [ "$ENV" == "local" ]; then
    docker-compose -f docker-compose.yml up --build -d
elif [ "$ENV" == "prod" ]; then
    docker-compose -f docker-compose-prod.yml up --build -d
else
    echo "Error: Invalid ENV parameter. Use 'local' or 'prod'."
    exit 1
fi