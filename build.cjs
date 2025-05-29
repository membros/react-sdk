#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Clean dist directory
if (fs.existsSync('dist')) {
  fs.rmSync('dist', { recursive: true });
}
fs.mkdirSync('dist');

console.log('Building ESM...');
execSync('tsc --project tsconfig.esm.json', { stdio: 'inherit' });

console.log('Building CommonJS...');
execSync('tsc --project tsconfig.cjs.json', { stdio: 'inherit' });

// Copy ESM files to root dist with .esm.js extension
const esmDir = path.join(__dirname, 'dist', 'esm');
const distDir = path.join(__dirname, 'dist');

function copyWithExtension(srcDir, destDir, srcExt, destExt) {
  const files = fs.readdirSync(srcDir, { withFileTypes: true });
  
  for (const file of files) {
    const srcPath = path.join(srcDir, file.name);
    
    if (file.isDirectory()) {
      const destSubDir = path.join(destDir, file.name);
      if (!fs.existsSync(destSubDir)) {
        fs.mkdirSync(destSubDir, { recursive: true });
      }
      copyWithExtension(srcPath, destSubDir, srcExt, destExt);
    } else if (file.name.endsWith(srcExt)) {
      const destName = file.name.replace(srcExt, destExt);
      const destPath = path.join(destDir, destName);
      
      // Read file content and fix import paths
      let content = fs.readFileSync(srcPath, 'utf8');
      
      if (destExt === '.esm.js') {
        // Fix ESM imports to use .esm.js extension
        content = content.replace(/from ["']\.\/([^"']+)["']/g, 'from "./$1.esm.js"');
        content = content.replace(/from ["']\.\.\/([^"']+)["']/g, 'from "../$1.esm.js"');
      } else if (destExt === '.cjs') {
        // Fix CommonJS requires to use .cjs extension
        content = content.replace(/require\(["']\.\/([^"']+)["']\)/g, 'require("./$1.cjs")');
        content = content.replace(/require\(["']\.\.\/([^"']+)["']\)/g, 'require("../$1.cjs")');
      }
      
      fs.writeFileSync(destPath, content);
    }
  }
}

// Copy ESM JS files with .esm.js extension and fix imports
copyWithExtension(esmDir, distDir, '.js', '.esm.js');

// Copy CommonJS files with .cjs extension and fix requires
const cjsDir = path.join(__dirname, 'dist', 'cjs');
copyWithExtension(cjsDir, distDir, '.js', '.cjs');

// Copy type definitions from ESM (they're the same for both)
copyWithExtension(esmDir, distDir, '.d.ts', '.d.ts');

// Clean up intermediate directories
fs.rmSync(esmDir, { recursive: true });
fs.rmSync(cjsDir, { recursive: true });

console.log('Build complete!'); 