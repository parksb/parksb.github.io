#! /bin/bash

echo "Start server:"

echo "Run node-sass..."
echo "> ./node_modules/node-sass/bin/node-sass --watch ./app/src/scss --output ./app/src/css &"
./node_modules/node-sass/bin/node-sass --watch ./app/src/scss --output ./app/src/css &

echo "Reset server directory..."
echo "> rm -r ./server/*"
rm -r ./server/*

echo "Run parcel..."
echo "> parcel serve ./app/index.html -d ./server --open"
parcel serve ./app/index.html -d ./server --open