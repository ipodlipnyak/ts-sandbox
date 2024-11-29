#!/bin/bash
echo "password: my"
docker compose exec db psql -U my
#psql -h 127.0.0.1 -U my -W my
