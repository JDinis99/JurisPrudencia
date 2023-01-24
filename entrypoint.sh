#!/bin/bash

# Proxy service
npm run proxy &

# React dev server 
npm start &

#https://docs.docker.com/config/containers/multi-service_container/
wait -n

exit $?
