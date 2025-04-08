#!/bin/bash
set -e

node_version=`node --version`

if [[ `echo ${node_version} | cut -d. -f1` != "v16"  ]]
then
  echo "Needs node version 16. Current version is ${node_version}"
  exit 1
fi

current_branch=`git branch --show-current`

if [[ "$1" == "platform" ]]
then
  server="flux50"
  domain="tes.fluxility.dev"
  app="tes-platform"
  path_on_server="/webapps/tes_platform_app/"
  desired_branch="develop"
else
  echo "Please select an app to build. (platform)"
  exit 1
fi

if [[ "${desired_branch}" != "${current_branch}" ]]
then
  echo "On branch ${current_branch} expected ${desired_branch}. Canceled execution."
  exit 1
fi

echo "Publishing app ${app} to ${server} (https://${domain})"

npm install
$(npm bin)/nx run ${app}:build:staging
cd dist/apps/${app}
zip -r ${app}.zip .
ssh ${server} mkdir -p ${path_on_server}${app}
scp ${app}.zip ${server}:${path_on_server}
ssh ${server} rm -rf ${path_on_server}${app}
ssh ${server} unzip ${path_on_server}${app}.zip -d ${path_on_server}${app}
cd -

echo "Done publishing. Visit https://${domain} to check!"
