FROM node:14.17

RUN apt update && apt install -y vim

COPY src /opt/app

CMD ["node", "/opt/app/auditor.js"]

# docker build -t res/auditor .
# docker run -d -p 2205:2205 res/auditor
# telnet 239.255.22.5 2205
