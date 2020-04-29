#!/usr/bin/env node
const fs = require('fs');

fs.appendFileSync('.npmrc', 'package-lock=false');
fs.appendFileSync('.gitignore', 'package-lock.json');
try{
  fs.unlinkSync('package-lock.json');
}catch(e){} // don't care
