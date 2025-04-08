FROM node:22.6

RUN npm install -g @othentic/othentic-cli

WORKDIR /app
COPY . .

ENTRYPOINT ["othentic-cli"] 