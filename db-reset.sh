#!/bin/sh
yarn app:alfa:build
yarn app:alfa:cli db-reset
yarn app:alfa:fixtures
yarn app:alfa:cli dev-set-passwords test

# npm run build
# # dropdb bl
# # createdb bl -O bl
# # npm run typeorm:migration:run
# npm run cli db-reset
# npm run fixtures 
# npm run cli dev-set-passwords test
