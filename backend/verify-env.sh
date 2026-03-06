#!/bin/bash
# Quick script to verify .env format

cd /Users/davidreichardt/chess-mate/backend

if [ ! -f ".env" ]; then
    echo "❌ .env file not found!"
    exit 1
fi

echo "Checking .env file format..."
echo ""

# Check if DATABASE_URL exists
if grep -q "^DATABASE_URL=" .env; then
    echo "✅ DATABASE_URL variable found"
    
    # Check if it has quotes
    if grep -q '^DATABASE_URL="' .env; then
        echo "✅ DATABASE_URL has quotes"
    else
        echo "⚠️  DATABASE_URL might be missing quotes"
    fi
    
    # Check for spaces around =
    if grep -q "^DATABASE_URL = " .env; then
        echo "⚠️  WARNING: Found spaces around = sign (should be DATABASE_URL=\"...\")"
    else
        echo "✅ No spaces around = sign"
    fi
    
    echo ""
    echo "Current DATABASE_URL line (first 50 chars):"
    grep "^DATABASE_URL=" .env | head -c 80
    echo "..."
    
else
    echo "❌ DATABASE_URL not found in .env file"
    exit 1
fi
