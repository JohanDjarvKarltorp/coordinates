#!/bin/bash

reset="\e[0m"
bold="\e[1m"
green="\e[92m"
yellow="\e[93m"
red="\e[31m"

echo -e "$bold$yellow✦ STARTING ESLINT$reset"

npm run lint --silent
if [ $? -eq 1 ]; then
    echo -e "${bold}If possible, do you want to auto-fix the issues? (y/n)$reset"
    read userInput
    if [ "$userInput" = "y" ]; then
        echo -e "\n$bold$yellow✦ Running eslint --fix$reset"
        npm run lint-fix --silent
        if [ $? -eq 1 ]; then
          echo -e "$bold${red}✦ ESLINT FAILED, above errors needs to be fixed manually$reset\n"
        else
          echo -e "$bold$green✦ ESLINT COMPLETED WITHOUT ERRORS$reset\n"
          exit 0
        fi
    else
        echo -e "$bold$red✦ aborting autofix, errors remains.$reset\n"
        exit 0
    fi
else
    echo -e "$bold$green✦ ESLINT COMPLETED WITHOUT ERRORS$reset\n"
    exit 0
fi
