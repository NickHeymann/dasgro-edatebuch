#!/bin/bash

# Helper script for extracting JavaScript functions from index.html
# Usage: ./extract-helper.sh [function_name]

EXTRACTED_JS="/tmp/extracted_js.txt"
INDEX_HTML="index.html"

# Check if extracted JS exists, if not create it
if [ ! -f "$EXTRACTED_JS" ]; then
    echo "📦 Extracting JavaScript from index.html..."
    awk '/<script>$/,/<\/script>/' "$INDEX_HTML" > "$EXTRACTED_JS"
    echo "✅ JavaScript extracted to $EXTRACTED_JS"
fi

# If function name provided, extract that function
if [ -n "$1" ]; then
    FUNC_NAME="$1"
    echo "🔍 Searching for function: $FUNC_NAME"
    echo ""

    # Find and extract the function
    awk "/function $FUNC_NAME/,/^        }/" "$EXTRACTED_JS" | head -100

    echo ""
    echo "---"
    echo "💡 Copy the above function and paste it into the appropriate module"
else
    echo "📋 JavaScript Extraction Helper"
    echo ""
    echo "Usage: ./extract-helper.sh [function_name]"
    echo ""
    echo "Examples:"
    echo "  ./extract-helper.sh renderEventCard"
    echo "  ./extract-helper.sh initGlobe"
    echo "  ./extract-helper.sh setupSearch"
    echo ""
    echo "Available functions:"
    echo ""
    grep -n "^\s*function " "$EXTRACTED_JS" | head -30 | sed 's/function //' | sed 's/(.*$//'
    echo ""
    echo "... and many more (use grep to search)"
fi
