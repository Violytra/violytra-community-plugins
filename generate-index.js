const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execSync } = require('child_process');

const args = process.argv.slice(2);
let distDir = '';
let baseUrl = '';
let outFile = '';
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--dist') distDir = args[++i];
  else if (args[i] === '--base-url') baseUrl = args[++i];
  else if (args[i] === '--out') outFile = args[++i];
}

const plugins = {};

const files = fs.readdirSync(distDir).filter(f => f.endsWith('.zip'));
for (const file of files) {
  const zipPath = path.join(distDir, file);
  const tmpDir = path.join('/tmp', 'idx_' + file.replace(/[^a-zA-Z0-9.]/g, '_'));
  fs.mkdirSync(tmpDir, { recursive: true });
  execSync('unzip -o -q "' + zipPath + '" -d "' + tmpDir + '"');

  const manifest = JSON.parse(fs.readFileSync(path.join(tmpDir, 'manifest.json'), 'utf8'));
  const id = manifest.id;
  const version = manifest.version;

  const stat = fs.statSync(zipPath);
  const hash = crypto.createHash('sha256').update(fs.readFileSync(zipPath)).digest('hex');

  if (!plugins[id]) {
    plugins[id] = {
      name: manifest.name,
      description: manifest.description,
      author: manifest.author,
      contributors: manifest.contributors || [],
      icon: manifest.icon,
      channels: { latest: version },
      versions: {}
    };
  }

  plugins[id].versions[version] = {
    url: baseUrl + '/' + file,
    sha256: hash,
    size: stat.size,
    dependencies: manifest.dependencies || {}
  };

  plugins[id].channels.latest = version;

  execSync('rm -rf "' + tmpDir + '"');
}

const index = {
  format: 1,
  name: 'Violytra Community Plugins',
  description: 'Community plugins for Violytra.',
  plugins
};

fs.writeFileSync(outFile, JSON.stringify(index, null, 2));
console.log('Generated index with ' + Object.keys(plugins).length + ' plugins');