#!/bin/sh
yarn app:bubbles:build
yarn app:bubbles:cli db-reset
yarn app:bubbles:fixtures
yarn app:bubbles:cli dev-set-passwords test

# npm run build
# # dropdb bl
# # createdb bl -O bl
# # npm run typeorm:migration:run
# npm run cli db-reset
# npm run fixtures 
# npm run cli dev-set-passwords test
