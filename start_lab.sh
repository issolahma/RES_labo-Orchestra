#!/bin/bash

echo ""
echo ""
echo "*** Rebuilding our 3 Docker images"
echo ""
docker build --tag res/musician --file ./docker/image-musician/Dockerfile ./docker/image-musician/
docker build --tag res/auditor --file ./docker/image-auditor/Dockerfile ./docker/image-auditor/
docker build --tag res/validate-music --file ./docker/image-validation/Dockerfile ./docker/image-validation/

#
# We start a single container. The Node.js application executed in this container will use
# a npm package to control Docker. It will start/stop musician and auditor containers and check that
# the auditor works as expected.
#
echo ""
echo ""
echo "*** Starting validation..."
echo ""
git remote -v | tee check.log
docker run --name res_validation -v /var/run/docker.sock:/var/run/docker.sock res/validate-music | tee -a check.log
