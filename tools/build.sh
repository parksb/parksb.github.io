#! /bin/bash

DIST="./dist"
PUBLIC="./app/public"
PUBLIC_ARTICLE="./app/public/article"
PUBLIC_WORK="./app/public/work"

CYAN="\033[36m"
GREEN="\033[32m"
WHITE="\033[0m"

echo -e "${CYAN}Start build:\n"

echo -e "${GREEN}Create ${PUBLIC} directory if it does not exist...${WHITE}"
echo -e "> [-d ${PUBLIC} ] || mkdir ${PUBLIC}"
[ -d $PUBLIC ] || mkdir $PUBLIC
echo -e "> [-d ${PUBLIC_ARTICLE} ] || mkdir ${PUBLIC_ARTICLE}"
[ -d $PUBLIC_ARTICLE ] || mkdir $PUBLIC_ARTICLE
echo -e "> [-d ${PUBLIC_WORK} ] || mkdir ${PUBLIC_WORK}\n"
[ -d $PUBLIC_WORK ] || mkdir $PUBLIC_WORK

echo -e "${GREEN}Create ${DIST} directory if it does not exist...${WHITE}"
echo -e "> [-d ${DIST} ] || mkdir ${DIST}\n"
[ -d $DIST ] || mkdir $DIST

echo -e "\n${GREEN}Publish the templates...${WHITE}"
echo "> npm run publish ./tools/publish.ts page"
npm run publish -- page
echo "> npm run publish -- article"
npm run publish -- article
echo "> npm run publish -- work"
npm run publish -- work

echo -e "\n${GREEN}Reset distribution directory...${WHITE}"
echo "> rm -r ${DIST}/*"
rm -r $DIST/*

echo -e "> mkdir ${DIST}/styles\n"
mkdir $DIST/styles
echo -e "> mkdir ${DIST}/assets\n"
mkdir $DIST/assets
echo -e "> mkdir ${DIST}/images\n"
mkdir $DIST/images

echo -e "\n${GREEN}Copy files to distribution directory...${WHITE}"
echo "> cp -r ./app/static/* ${DIST}/"
cp -r ./app/static/* $DIST/
echo "> cp -r ./app/public/* ${DIST}/"
cp -r ./app/public/* $DIST/
echo "> cp -r ./app/styles/* ${DIST}/styles/"
cp -r ./app/styles/* $DIST/styles/
echo "> cp -r ./app/assets/* ${DIST}/assets/"
cp -r ./app/assets/* $DIST/assets/
echo "> cp -r ./images/* ${DIST}/images/"
cp -r ./images/* $DIST/images/

echo -e "\n${GREEN}Minify css files...${WHITE}"
cleancss --batch --batch-suffix '' $DIST/styles/*.css
npm run inline

echo -e "\n${GREEN}Minify html files...${WHITE}"
html-minifier --input-dir $DIST --output-dir $DIST --file-ext html --remove-comments --remove-redundant-attributes --remove-script-type-attributes --remove-tag-whitespace --collapse-whitespace --keep-closing-slash

echo -e "\n${CYAN}Done!${WHITE}"
