import { defineConfig } from 'vite';
import { readdirSync } from 'fs';
import { resolve } from 'path';

const publicDir = 'public/custom';

// Dynamically generate entry points
function generateEntryPoints() {
  const entryPoints = {};
  const staticDir = resolve(__dirname, publicDir);

  // Read the files in the "public/pages" directory
  const files = readdirSync(staticDir);

  // Create entry points for JavaScript and CSS files
  files.forEach((file) => {
    const ext = file.split('.').pop();
    const fileName = file.replace(`.${ext}`, '');

    if (ext === 'js' || ext === 'css') {
      entryPoints[`${publicDir}/${fileName}`] = `${publicDir}/${file}`;
    }
  });

  return entryPoints;
}

export default defineConfig({
  publicDir: publicDir,
  build: {
    manifest: true,
    rollupOptions: {
      input: generateEntryPoints(),
    },
    outDir: 'dist',
  },
});
