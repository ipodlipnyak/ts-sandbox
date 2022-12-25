#!/bin/sh
# yarn app:bubbles:build
# yarn app:bubbles:cli db-reset
# yarn app:bubbles:fixtures
# yarn app:bubbles:cli dev-set-passwords test

dropdb my
createdb my -O my
yarn build:server
yarn typeorm:migration:generate
yarn typeorm:migration:run
yarn cli db-reset
yarn fixtures
yarn cli dev-set-passwords test

# npm run build
# # dropdb bl
# # createdb bl -O bl
# # npm run typeorm:migration:run
# npm run cli db-reset
# npm run fixtures 
# npm run cli dev-set-passwords test
