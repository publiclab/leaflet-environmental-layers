# Generate New Spreadsheet Layer

This directory contains scripts and logic for manual as well as automated generation of new spreadsheet based layers.

## Steps to manually generate layer

1. Create `input.json`
   ```sh
   cp sample.input.json
   ```

2. Replace values in `input.json` with the data for new spreadsheet layer
3. Execute `manualGenLayer.js`
   ```sh
   node manualGenLayer.js
   ```
4. Check if json files are modified inside `src/`
5. Build the entire package
   ```sh
   grunt build
   ```
6. Modify example files and check if you can use the newly generated layer
   ```sh
   npm start
   ```
7. Commit Files and Create Pull Request


## Automatically Generate Layer

// To be added in follow up PR