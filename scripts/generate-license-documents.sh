#!/bin/bash

set -euxo pipefail

# generates a big file with all licenses of all dependencies at license-disclaimer.txt
yarn licenses generate-disclaimer

AGPL_TEXT=$(<LICENSE.md)
LICENSES_TEXT=$(<license-disclaimer.txt)




for lang in de en; do
  TARGETFILE=apps/web/.next/standalone/apps/web/public/documents/openSource_${lang}.html
  cp "$(dirname "$0")"/openSource-template_${lang}.html $TARGETFILE
  {
    echo "<pre>"
    cat LICENSE.md
    echo ""
    cat license-disclaimer.txt
    echo "</pre>"
   } >> $TARGETFILE
done
