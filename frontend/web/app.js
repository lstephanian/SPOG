import path from 'path';
import fs from 'fs';
import nunjucks from 'nunjucks';
import express from 'express';
import dotenv from 'dotenv';

const app = express();
const port = 3000;

dotenv.config({path: './.env'});
app.use(express.static('public/libs'));
app.use('/dist', express.static('dist'))
app.use('/assets', express.static('dist/assets'))

nunjucks.configure('views', {autoescape: true, express: app});
const env = nunjucks.configure('views', {autoescape: true, express: app});
env.addGlobal('manifest', JSON.parse(fs.readFileSync('dist/manifest.json', 'utf-8')));

app.get('/', (req, res) => {
  res.render('pages/spog.html', {});
});

app.get('/demo', (req, res) => {
  res.render('pages/demo.html', {
    'abi': fs.readFileSync(`./abi/${process.env.VITE_CONTRACT_ADDRESS}.json`, 'utf8')
  });
});

app.get('/research', (req, res) => {
  res.render('pages/research.html', {});
});

// Start the server
app.listen(port, () => {
  console.log(`Dev server running on http://localhost:${port}`);
});
