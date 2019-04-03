FROM mhart/alpine-node:11 as build
WORKDIR /repo
COPY . .
RUN yarn
RUN yarn build
RUN yarn install --production --ignore-scripts --prefer-offline

EXPOSE 3000

ENTRYPOINT ["node", "-r", "dotenv-extended/config"]

CMD ["server/index.js"]
