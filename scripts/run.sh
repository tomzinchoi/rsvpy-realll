#!/bin/bash

# Make sure scripts directory exists
mkdir -p scripts

# Create the file structure analyzer
node scripts/generate-file-structure.js

# Display success message
echo "Project structure analysis complete!"
echo "Check project-structure.json in the root directory."
