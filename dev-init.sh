#!/bin/bash
echo "password: my"
createuser -s -P my
createdb -O my my
yarn workspace bubbles-client install
yarn app:bubbles:build
yarn app:bubbles:typeorm:run
yarn app:bubbles:fixtures
yarn app:bubbles:cli dev-set-passwords test
yarn app:bubbles:dev
