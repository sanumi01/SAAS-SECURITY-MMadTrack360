#!/bin/bash

# Define variables
USER_POOL_ID="us-west-2_mKClK8Ign"
CLIENT_ID="3cpdkmdjmjupc2bubks1ilkiml"
CLIENT_NAME="MMadTrack360WebClient"
COGNITO_DOMAIN="https://${USER_POOL_ID}.auth.us-west-2.amazoncognito.com"
REDIRECT_URI_LOCAL="http://localhost:3000/callback"
REDIRECT_URI_PROD="https://mmadtrack360.com/callback"
LOGOUT_URI_LOCAL="http://localhost:3000"
LOGOUT_URI_PROD="https://mmadtrack360.com"
SCOPES="email openid phone"
RESPONSE_TYPE="code"

echo "🔧 Updating Cognito App Client OAuth settings..."

aws cognito-idp update-user-pool-client \
  --user-pool-id "$USER_POOL_ID" \
  --client-id "$CLIENT_ID" \
  --supported-identity-providers "COGNITO" \
  --callback-urls "$REDIRECT_URI_LOCAL" "$REDIRECT_URI_PROD" \
  --logout-urls "$LOGOUT_URI_LOCAL" "$LOGOUT_URI_PROD" \
  --allowed-o-auth-flows "code" \
  --allowed-o-auth-scopes $SCOPES \
  --allowed-o-auth-flows-user-pool-client \
  --client-name "$CLIENT_NAME"

echo "✅ Cognito App Client updated successfully."

echo "🔗 Hosted UI Login URL (Local):"
echo "$COGNITO_DOMAIN/login?client_id=$CLIENT_ID&response_type=$RESPONSE_TYPE&scope=$(echo $SCOPES | sed 's/ /+/g')&redirect_uri=$REDIRECT_URI_LOCAL"

echo "🔗 Hosted UI Login URL (Production):"
echo "$COGNITO_DOMAIN/login?client_id=$CLIENT_ID&response_type=$RESPONSE_TYPE&scope=$(echo $SCOPES | sed 's/ /+/g')&redirect_uri=$REDIRECT_URI_PROD"
