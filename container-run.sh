#!/bin/zsh

PORT="${PORT:=3000}"

docker rm --force pintra-container
docker run --env-file .env.local.docker --add-host=database:$(ipconfig getifaddr en0) -e PORT=$PORT -p $PORT:$PORT --name pintra-container -d pintra
