import path from 'path';
import fs from 'fs';
import nunjucks from 'nunjucks';
import express from 'express';
import dotenv from 'dotenv';
import yaml from 'js-yaml';

const app = express();
const port = 3000;

dotenv.config({path: './.env'});
app.use(express.static('public/libs'));
app.use('/dist', express.static('dist'))
app.use('/assets', express.static('dist/assets'))

nunjucks.configure('views', {autoescape: true, express: app});
const env = nunjucks.configure('views', {autoescape: true, express: app});
env.addGlobal('manifest', JSON.parse(fs.readFileSync('dist/manifest.json', 'utf-8')));
const contractsList = yaml.load(fs.readFileSync('./../../voting-rounds.yml', 'utf8'));
const contracts = contractsList.reduce((contracts, contract) => Object.assign({}, contracts, {[contract.address]: contract}), {});
env.addGlobal('contracts', contracts);
env.addGlobal('contractsList', contractsList);

app.get('/', (req, res) => {
  res.render('pages/spog.html', {});
});

app.get('/demo/:contractAddress', (req, res) => {
  res.render('pages/demo.html', {
    'contractAddress': req.params.contractAddress,
    'contract': contracts[req.params.contractAddress],
    'abi': fs.readFileSync(`./abi/${req.params.contractAddress}.json`, 'utf8')
  });
});

app.get('/research', (req, res) => {
  res.render('pages/research.html', {});
});

// Start the server
app.listen(port, () => {
  console.log(`Dev server running on http://localhost:${port}`);
});
