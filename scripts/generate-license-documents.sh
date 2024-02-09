#!/bin/sh

set -eux

# generates a big file with all licenses of all dependencies at license-disclaimer.txt
yarn licenses generate-disclaimer --recursive > license-disclaimer.txt

for lang in de en; do
  TARGETFILE=apps/web/.next/standalone/apps/web/public/documents/openSource_${lang}.html
  cp "$(dirname "$0")"/openSource-template_${lang}.html $TARGETFILE
  {
    echo "<div>"
    # encode existing HTML entities, separate licenses ("-----" is the separator between license texts) into div-containers, replace empty lines with double linebreaks (simulating paragraphs)
    sed -e 's/&/\&amp;/g; s/</\&lt;/g; s/>/\&gt;/g; s/"/\&quot;/g; s/'"'"'/\&#39;/g' -e 's/^-----$/<\/div><div>/' -e 's/^$/<br\/><br\/>/' license-disclaimer.txt
    echo "</div>"
  } >> $TARGETFILE
done
