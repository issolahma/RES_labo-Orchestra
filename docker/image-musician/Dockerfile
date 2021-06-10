FROM node:14.17

RUN apt update && apt install -y vim

COPY src /opt/app
COPY ../orchestra-protocol.js /opt/app

CMD ["node", "/opt/app/instrument.js"]

# docker build -t res/musician .
# docker run -d res/musician piano
