FROM node:18 as backend-build-stage
WORKDIR /app
COPY ./ .
# ENV NODE_ENV=production
COPY package.json .
RUN npm i -g @nestjs/cli
RUN yarn install
RUN npm run build

# FROM node:18 as frontend-build-stage
# 
# ARG MY_REGISTRY_TOKEN
# 
# RUN echo "//npm.pkg.github.com/:_authToken=${MY_REGISTRY_TOKEN}" > ~/.npmrc
# WORKDIR /app
# COPY ./apps/template/client/ .
# RUN yarn install 
# RUN npm run generate

FROM node:18 as prod
WORKDIR /app
# COPY package.json .
# ENV NODE_ENV=production
# RUN yarn install

COPY --from=backend-build-stage /app/package* ./
COPY --from=backend-build-stage /app/node_modules ./node_modules/
COPY --from=backend-build-stage /app/apps/template/fixtures ./apps/template/fixtures/

#COPY --from=backend-build-stage /app/dist ./dist/
COPY --from=backend-build-stage /app/dist/apps/template/apps/template/src ./dist/

COPY --from=backend-build-stage /app/apps/template/client/.output/public ./dist/apps/template/client/

# WORKDIR /app

CMD npm run start:prod
