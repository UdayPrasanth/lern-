Render deployment notes

- Build command: npm run build
- Publish directory: dist
- Start command: npm start   (only required if using the Node server; static sites on Render don't need it)

Notes:
1. The example build uses Vite which outputs to dist by default. If your project uses a different bundler, update the "build" script in package.json or change Render's publish directory to your actual output (e.g., build/ or public/).
2. If you want Render to serve static files without a Node server, leave the Start Command blank and set Publish Directory to the build output.
3. Before deploying, run locally:
   - npm install
   - npm run build
   - ls -la dist
   - npm start (to test server.js)
4. Security: run `npm audit` and `npm audit fix` locally. `--force` can introduce breaking changes — test locally.