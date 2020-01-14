FROM node:7.4
WORKDIR /app
ADD . /app
RUN npm install
EXPOSE 4567
CMD npm run build

ENTRYPOINT npm start && ls 