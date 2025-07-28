#!/bin/bash

# Set your domain or IP address here
DOMAIN="13.213.66.220"  # Replace with your actual domain or IP
EMAIL="pgbee.company@gmail.com"  # Replace with your email

# Create directory for Let's Encrypt files
mkdir -p certbot/conf
mkdir -p certbot/www

# Check if certificate already exists
if [ -d "certbot/conf/live/$DOMAIN" ]; then
  echo "Certificate for $DOMAIN already exists. Skipping certificate generation."
  exit 0
fi

echo "### Starting nginx..."
docker-compose up -d nginx

echo "### Requesting Let's Encrypt certificate for $DOMAIN..."

# Request certificate
docker-compose run --rm --entrypoint "\
  certbot certonly --webroot -w /var/www/certbot \
    --email $EMAIL \
    --agree-tos \
    --no-eff-email \
    -d $DOMAIN" certbot

echo "### Reloading nginx..."
docker-compose exec nginx nginx -s reload

echo "### Certificate setup complete!"
echo "### Your site should now be available at https://$DOMAIN"
