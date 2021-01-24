#!/bin/zsh

# Instructions for setting up Heroku container registry:
# 
# https://devcenter.heroku.com/articles/container-registry-and-runtime
# 

heroku container:push web
heroku container:release web
