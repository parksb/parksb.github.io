#! /bin/bash

DIST="./parksb.github.io"
CYAN="\033[36m"
GREEN="\033[32m"
WHITE="\033[0m"

echo -e "${CYAN}Deploy to ${DIST}:\n"

echo -e "${WHITE}> cd ${DIST}"
cd ${DIST}

echo -e "> git status -s\n"
git status -s
echo ""

echo -e "${GREEN}Stage the all files...${WHITE}"
echo "> git add ."
git add .
echo -e "> git status -s\n"
git status -s
echo ""

DATE=$(date +"%Y-%m-%d %H:%M:%S")
while true; do
  read -p "Do you wish to commit the staged files? (yes/no) " yn
  case $yn in
    [Yy]* ) git commit -m "dist: ${DATE} 배포"; break;;
    [Nn]* ) git reset .; exit;;
  esac
done

echo -e "\n${GREEN}Pull from origin/master...${WHITE}"
echo "> git pull --rebase origin master"
git pull --rebase origin master

echo -e "\n${GREEN}Push the committed files...${WHITE}"
echo "> git push origin master"
git push origin master

echo -e "\n${GREEN}Stage the submodule file...${WHITE}"
echo "> cd .."
cd ..
echo "> git add ${DIST}"
git add ${DIST}
echo -e "> git status -s\n"
git status -s
echo ""

echo -e "${GREEN}Commit the submodule file...${WHITE}"
echo "> git commit -m \"dist: ${DATE} 배포\""
git commit -m "dist: ${DATE} 배포"

echo -e "\n${CYAN}Done!"