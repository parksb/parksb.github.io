#! /bin/bash

DIST="./parksb.github.io"
CYAN="\033[36m"
GREEN="\033[32m"
WHITE="\033[0m"

echo -e "${CYAN}Start build:\n"

echo -e "${GREEN}Run node-sass...${WHITE}"
echo -e "> ./node_modules/node-sass/bin/node-sass ./app/src/scss --output ./app/src/css\n"
./node_modules/node-sass/bin/node-sass ./app/src/scss --output ./app/src/css

echo -e "\n${GREEN}Reset distribution directory...${WHITE}"
echo "> rm -r ${DIST}/*"
rm -r $DIST/*

echo -e "\n${GREEN}Copy static files to distribution directory...${WHITE}"
echo "> cp ./app/static/robots.txt ${DIST}/robots.txt"
cp ./app/static/robots.txt $DIST/robots.txt
echo "> cp ./app/static/sitemap.xml ${DIST}/sitemap.xml"
cp ./app/static/sitemap.xml $DIST/sitemap.xml
echo "> cp ./app/static/naver16dc3632e707d380264984a55bd10171.html ${DIST}/naver16dc3632e707d380264984a55bd10171.html"
cp ./app/static/naver16dc3632e707d380264984a55bd10171.html $DIST/naver16dc3632e707d380264984a55bd10171.html
echo "> cp ./app/static/googleb1e5dbcc1d32e7b1.html ${DIST}/googleb1e5dbcc1d32e7b1.html"
cp ./app/static/googleb1e5dbcc1d32e7b1.html $DIST/googleb1e5dbcc1d32e7b1.html
echo "> cp -r ./app/project ${DIST}/project"
cp -r ./app/project $DIST/project

echo -e "\n${GREEN}Run parcel...${WHITE}"
echo -e "> parcel build ./app/index.html -d ${DIST}\n"
parcel build ./app/index.html -d $DIST

echo -e "\n${CYAN}Done!${WHITE}"