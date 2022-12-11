#!/bin/bash
echo "password: alfa"
createuser -s -P alfa
createdb -O alfa alfa
yarn workspace alfa-client install
yarn app:alfa:build
yarn app:alfa:typeorm:run
yarn app:alfa:fixtures
yarn app:alfa:cli dev-set-passwords test
yarn app:alfa:dev
