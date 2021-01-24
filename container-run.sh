#!/bin/zsh

docker rm --force pintra-container
docker run --env-file .env.local.docker --add-host=database:$(ipconfig getifaddr en0) -p 3000:3000 --name pintra-container -d pintra
