#!/bin/bash

echo "Addding all changes to staging..."
git add .

if git diff --cached --quiet; then
    echo "No changes to commit."
    exit 0
fi

COMMIT_MSG="${1:-Initial Commit}"

echo "Committing changes with message: '$COMMIT_MSG'"
git commit -m "$COMMIT_MSG"

if [ $? -eq 0 ]; then
    echo "Commit successful. Pushing to origin main..."
    git push -u origin main
    
    if [ $? -eq 0 ]; then
        echo "Successfully pushed to origin main!"
    else
        echo "Error: Failed to push to origin main."
        exit 1
    fi
else
    echo "Error: Commit failed."
    exit 1
fi