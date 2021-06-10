#!/bin/bash

docker build -t res/auditor ./image-auditor
docker build -t res/musician ./image-musician
docker build -t res/validate-music ./image-validation

docker run -d -p 2205:2205 res/auditor
docker run -d res/musician piano
docker run -d res/musician flute

echo ""
echo ""
echo "*** Starting validation..."
echo ""
git remote -v | tee check.log
docker run --name res_validation -v /var/run/docker.sock:/var/run/docker.sock res/validate-music | tee -a check.log
