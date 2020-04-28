#!/bin/bash

reset="\e[0m"
bold="\e[1m"
green="\e[92m"
yellow="\e[93m"
red="\e[31m"

check_files() {
  addedAndModified=$(git status -s | grep "AM *\|MM *" | awk '{print $2}');
  if [ -n "$addedAndModified" ]; then
    echo -e "\nChanges detected: \n";
    while IFS= read -r line; do
      echo -e "$red\tmodified:    $line$reset";
    done <<< "$addedAndModified"

    echo -e "\nChanges added to your commit..."

    files=$(echo "$addedAndModified" | awk 'BEGIN{ORS=" "}1');
    $(git add $files);
    echo -e "\n$bold$green✦ ESLINT COMPLETED WITHOUT ERRORS$reset\n"
    exit 0
  fi
}

echo -e "$bold$yellow✦ STARTING ESLINT$reset"
npm run lint --silent
if [ $? -eq 1 ]; then
    echo -e "${bold}If possible eslint will now try and auto-fix theese issues$reset"
    npm run lint-fix --silent
    if [ $? -eq 1 ]; then
        echo -e "$bold$red✦ ESLINT FAILED, above errors needs to be fixed manually$reset\n"
        exit 1
    else
        echo -e "\n$bold$green✦ Eslint fixed the issues, you may proceed.💕$reset"
        check_files
    fi
else
    echo -e "$bold$green✦ ESLINT COMPLETED WITHOUT ERRORS$reset\n"
fi
