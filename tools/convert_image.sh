#!/bin/bash

INPUT=$1
OUTPUT=$(uuidgen | tr "[:upper:]" "[:lower:]").webp
WIDTH=900

if (( "$(identify -format "%w" "$INPUT")" > "$WIDTH" )); then
  convert -resize "$WIDTH"x "$INPUT" "$OUTPUT"
else
  convert "$INPUT" "$OUTPUT"
fi

echo "$OUTPUT"
