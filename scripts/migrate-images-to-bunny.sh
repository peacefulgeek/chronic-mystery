#!/bin/bash
# Migrate 40 library images from CloudFront to Bunny CDN (chronic-mystery zone)
# Storage: ny.storage.bunnycdn.com
# Zone: chronic-mystery
# API Key: a060ee8d-4bac-446c-adcecf21942c-4458-4920
# Pull Zone: chronic-mystery.b-cdn.net

BUNNY_STORAGE="https://ny.storage.bunnycdn.com/chronic-mystery"
BUNNY_KEY="a060ee8d-4bac-446c-adcecf21942c-4458-4920"
BUNNY_CDN="https://chronic-mystery.b-cdn.net"

DOWNLOAD_DIR="/tmp/library-images"
mkdir -p "$DOWNLOAD_DIR"

SUCCESS=0
FAIL=0

# Extract all CloudFront URLs from image-library.mjs
URLS=$(grep -oP 'https://d2xsxph8kpxj0f\.cloudfront\.net[^"]+' /home/ubuntu/chronic-mystery/src/lib/image-library.mjs)

for URL in $URLS; do
  # Extract filename from URL (e.g., library-01-oA6488u5F2kurhVwrp6Fah.webp)
  FILENAME=$(basename "$URL")
  # Simplify to library-NN.webp
  NUM=$(echo "$FILENAME" | grep -oP 'library-\d+')
  REMOTE_PATH="images/library/${NUM}.webp"
  LOCAL_FILE="$DOWNLOAD_DIR/${NUM}.webp"

  echo "Processing $NUM..."
  
  # Download from CloudFront
  curl -s -o "$LOCAL_FILE" "$URL"
  if [ $? -ne 0 ] || [ ! -f "$LOCAL_FILE" ]; then
    echo "  FAIL: Download failed for $URL"
    FAIL=$((FAIL + 1))
    continue
  fi
  
  FILESIZE=$(stat -f%z "$LOCAL_FILE" 2>/dev/null || stat -c%s "$LOCAL_FILE" 2>/dev/null)
  echo "  Downloaded: ${FILESIZE} bytes"
  
  # Upload to Bunny CDN
  HTTP_CODE=$(curl --http1.1 -s -w "%{http_code}" -o /dev/null -X PUT \
    "${BUNNY_STORAGE}/${REMOTE_PATH}" \
    -H "AccessKey: ${BUNNY_KEY}" \
    -H "Content-Type: image/webp" \
    --data-binary @"$LOCAL_FILE")
  
  if [ "$HTTP_CODE" = "201" ] || [ "$HTTP_CODE" = "200" ]; then
    echo "  Uploaded: ${BUNNY_CDN}/${REMOTE_PATH} (HTTP $HTTP_CODE)"
    SUCCESS=$((SUCCESS + 1))
  else
    echo "  FAIL: Upload returned HTTP $HTTP_CODE"
    FAIL=$((FAIL + 1))
  fi
done

echo ""
echo "=== Migration Complete ==="
echo "Success: $SUCCESS"
echo "Failed: $FAIL"

# Cleanup
rm -rf "$DOWNLOAD_DIR"
