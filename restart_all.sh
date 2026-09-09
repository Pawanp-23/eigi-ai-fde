ENV=$1
IMAGE_TAG=$2
echo "Restarting all containers"
./stop_all.sh $ENV $IMAGE_TAG
./start_all.sh $ENV $IMAGE_TAG 