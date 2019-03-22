#! /bin/bash

echo "Start build:"

echo "Run node-sass..."
echo "> ./node_modules/node-sass/bin/node-sass ./app/src/scss --output ./app/src/css"
./node_modules/node-sass/bin/node-sass ./app/src/scss --output ./app/src/css

echo "Reset distribution directory..."
echo "> rm -r ./parksb.github.io/*"
rm -r ./parksb.github.io/*

echo "Run parcel..."
echo "> parcel build ./app/index.html -d ./parksb.github.io"
parcel build ./app/index.html -d ./parksb.github.io

echo "Done!"