import fs from 'fs';

const dir = process.argv[2] || `dist`;

const readStream = fs.createReadStream(`package.json`);
const packageJsonWriteStream = fs.createWriteStream(`./${dir}/package.json`);
const procfigWriteStream = fs.createWriteStream(`./${dir}/Procfile`);

readStream.on('data', (chunk) => {
  let packageJson = JSON.parse(chunk.toString());

  let { devDependencies, ...prodPackageJson } = packageJson;
  let { build_prod, build_webpacked_prod, tsc, start, dev, ...scripts } = packageJson.scripts;

  prodPackageJson.scripts = scripts;

  packageJsonWriteStream.write(JSON.stringify(prodPackageJson));
  procfigWriteStream.write('web: npm run prod');
});
