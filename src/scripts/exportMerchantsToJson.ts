// TypeScript script to export merchants data to a JSON file
import fs from 'fs';
import path from 'path';
import { merchants } from '../data/merchants';

const outputDir = path.resolve(process.cwd(), 'temp');
const outputFile = path.resolve(outputDir, 'merchants.json');

// Create the output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Write the merchants data to a JSON file
fs.writeFileSync(outputFile, JSON.stringify(merchants, null, 2));

console.log(`Successfully exported ${merchants.length} merchants to ${outputFile}`); 