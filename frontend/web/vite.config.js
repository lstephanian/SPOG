import { defineConfig } from 'vite';
import { readdirSync } from 'fs';
import { resolve } from 'path';

const publicDir = 'public/custom';

// Dynamically generate entry points
function generateEntryPoints(dir) {
  var entryPoints = {};
  const staticDir = resolve(__dirname, dir);

  // Read the files in the "public/pages" directory
  const files = readdirSync(staticDir);

  // Create entry points for JavaScript and CSS files
  files.forEach((file) => {
    if (file.indexOf('.') === -1) {
      entryPoints = Object.assign({}, entryPoints, generateEntryPoints(`${dir}/${file}`));
      return;
    }
    const ext = file.split('.').pop();
    const fileName = file.replace(`.${ext}`, '');

    if (ext === 'js' || ext === 'css') {
      entryPoints[`${dir}/${fileName}`] = `${dir}/${file}`;
    }
  });

  return entryPoints;
}

export default defineConfig({
  publicDir: publicDir,
  build: {
    manifest: true,
    rollupOptions: {
      input: generateEntryPoints(publicDir),
    },
    outDir: 'dist',
  },
});
