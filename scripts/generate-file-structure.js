const fs = require('fs');
const path = require('path');

// Directories to ignore
const ignoreDirs = [
  'node_modules',
  '.next',
  '.git',
  'out',
  'build',
  'dist',
  'scripts'
];

// File extensions to include
const includeExtensions = [
  '.js', '.jsx', '.ts', '.tsx', '.css', '.scss', '.json', '.md'
];

function shouldIgnore(filePath) {
  return ignoreDirs.some(dir => filePath.includes(`/${dir}/`));
}

function isRelevantFile(filePath) {
  const ext = path.extname(filePath);
  return includeExtensions.includes(ext);
}

function readDirRecursive(dir, baseDir = '') {
  const result = {
    type: 'directory',
    name: path.basename(dir),
    path: path.join(baseDir, path.basename(dir)),
    children: []
  };
  
  const items = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const item of items) {
    const itemPath = path.join(dir, item.name);
    const relativePath = path.join(baseDir, path.basename(dir), item.name);
    
    if (shouldIgnore(itemPath)) continue;
    
    if (item.isDirectory()) {
      result.children.push(readDirRecursive(itemPath, path.join(baseDir, path.basename(dir))));
    } else if (isRelevantFile(itemPath)) {
      result.children.push({
        type: 'file',
        name: item.name,
        path: relativePath,
        extension: path.extname(item.name)
      });
    }
  }
  
  return result;
}

try {
  console.log('Reading project structure...');
  const rootDir = path.resolve(__dirname, '..');
  const fileStructure = readDirRecursive(rootDir);
  
  // Save to JSON file
  const outputPath = path.join(rootDir, 'project-structure.json');
  fs.writeFileSync(outputPath, JSON.stringify(fileStructure, null, 2));
  
  console.log(`File structure saved to ${outputPath}`);
} catch (error) {
  console.error('Error generating file structure:', error);
}
