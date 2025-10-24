#!/bin/bash

API_ID="2fnaijjjz9"
AUTHORIZER_ID="db49jr"

# Routes already done: 1rw999t, 2aaskap, 3ab28ti, 46uae9h
ROUTE_IDS=(
  "10e9o6i"
  "5k6bgpp"
  "5kstn2o"
  "5w8dl7e"
  "6s1be3p"
  "72io9ek"
  "7m273se"
  "an3pt0j"
  "azj3wpi"
  "b9skh9s"
  "cr5u1si"
  "dn222v2"
  "e71kg8t"
  "ep0gbhe"
  "fjf1d14"
  "hgayvm6"
  "k6gd6jn"
  "kd8lzte"
  "nt2gdfl"
  "o7jlmv4"
  "p2s39nt"
  "rcq83xo"
  "toy1jyj"
  "vb68tg8"
  "wzqhg1v"
  "x7b2sx8"
  "yshmed8"
  "zx5qx57"
)

for ROUTE_ID in "${ROUTE_IDS[@]}"; do
  echo "🔧 Updating route $ROUTE_ID..."
  aws apigatewayv2 update-route \
    --api-id "$API_ID" \
    --route-id "$ROUTE_ID" \
    --authorization-type JWT \
    --authorizer-id "$AUTHORIZER_ID"
done

echo "✅ All remaining routes updated with JWT authorizer."
