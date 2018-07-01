#!/bin/bash
docker build -t sophatvathana/slash-express-restful .
docker push sophatvathana/slash-express-restful

ssh deploy@$DEPLOY_SERVER << EOF
docker pull sophatvathana/slash-express-restful
docker stop api-boilerplate || true
docker rm api-boilerplate || true
docker rmi sophatvathana/slash-express-restful:current || true
docker tag sophatvathana/slash-express-restful:latest sophatvathana/slash-express-restful:current
docker run -d --restart always --name api-boilerplate -p 3000:3000 sophatvathana/slash-express-restful:current
EOF
