FROM node:17-alpine
RUN apk update
# create root application folder
WORKDIR /src/app
COPY tsconfig.json ./
# copy source code to /app/src folder
COPY . /src/app

# check files list
RUN ls -las
RUN npm install
RUN npm run build

EXPOSE 8080

CMD [ "node", "./build/bin/www.js" ]