FROM node:14

WORKDIR .
COPY package*.json /
COPY . /
RUN npm config set strict-ssl false
RUN npm install -g nodemon && npm install
RUN npm run build-client

EXPOSE 3000
CMD ["node", "bin/www"]