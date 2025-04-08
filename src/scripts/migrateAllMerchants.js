// This is a runner script for the TypeScript migration
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Create a temporary migration script with correct imports
const createTempScript = () => {
  // Read the original script
  const sourcePath = path.join(__dirname, 'migrateAllMerchants.ts');
  const content = fs.readFileSync(sourcePath, 'utf8');
  
  // Replace Next.js path aliases with relative paths
  const modifiedContent = content
    .replace(/from ['"]@\/models\/merchant['"]/g, 'from \'../models/merchant\'')
    .replace(/from ['"]@\/data\/merchants['"]/g, 'from \'../data/merchants\'')
    .replace(/from ['"]@\/lib\/mongodb['"]/g, 'from \'../lib/mongodb\'');
  
  // Write to a temporary file
  const tempPath = path.join(__dirname, 'temp-migrate.ts');
  fs.writeFileSync(tempPath, modifiedContent);
  
  return tempPath;
};

// Run the migration script with ts-node
console.log('Preparing migration script...');
const tempScriptPath = createTempScript();

// Get command line arguments
const args = process.argv.slice(2);
console.log(`Running migration script with arguments: ${args.join(' ')}`);

// Set up environment variables
process.env.NODE_PATH = path.join(__dirname, '..', '..');

// Resolve the ts-node path
const tsNodePath = path.join(__dirname, '..', '..', 'node_modules', '.bin', 'ts-node');

// Spawn the process
const child = spawn(tsNodePath, [
  '--project', path.join(__dirname, '..', '..', 'tsconfig.json'),
  tempScriptPath,
  ...args
], {
  stdio: 'inherit',
  env: process.env
});

// Handle process completion
child.on('close', (code) => {
  // Clean up temp file
  try {
    fs.unlinkSync(tempScriptPath);
    console.log('Cleaned up temporary files');
  } catch (err) {
    console.error('Failed to clean up:', err);
  }
  
  if (code !== 0) {
    console.error(`Migration script exited with code ${code}`);
    process.exit(code);
  }
  console.log('Migration script completed successfully');
}); 