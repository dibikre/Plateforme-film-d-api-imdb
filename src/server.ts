import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import {join} from 'node:path';

const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();

/**
 * Proxy IMDb suggestions to avoid CORS issues.
 */
app.get('/api/imdb-proxy/:type/:prefix/:q', async (req, res) => {
  try {
    const { type, prefix, q } = req.params;
    const includeVideos = req.query['includeVideos'];
    
    const imdbUrl = `https://v3.sg.media-imdb.com/suggestion/${type}/${prefix}/${q}${includeVideos ? '?includeVideos=1' : ''}`;
    
    const response = await fetch(imdbUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Referer': 'https://www.imdb.com/',
        'Origin': 'https://www.imdb.com'
      }
    });

    if (!response.ok) {
      res.status(response.status).json({ error: `IMDb returned ${response.status}` });
      return;
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('IMDb Proxy Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// For ID lookup like suggestion/x/tt123.json
app.get('/api/imdb-proxy/:prefix/:q', async (req, res) => {
  try {
    const { prefix, q } = req.params;
    
    const imdbUrl = `https://v3.sg.media-imdb.com/suggestion/${prefix}/${q}`;
    
    const response = await fetch(imdbUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Referer': 'https://www.imdb.com/',
        'Origin': 'https://www.imdb.com'
      }
    });

    if (!response.ok) {
      res.status(response.status).json({ error: `IMDb returned ${response.status}` });
      return;
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('IMDb Proxy Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/**
 * Proxy OMDB to hide API Key
 */
app.get('/api/omdb-proxy', async (req, res) => {
  try {
    const key = req.headers['x-custom-key'] as string || process.env['OMDB_API_KEY'];
    
    if (!key) {
      res.status(500).json({ error: 'OMDB_API_KEY not configured' });
      return;
    }

    const query = new URLSearchParams(req.query as Record<string, string>);
    
    const omdbUrl = `https://www.omdbapi.com/?apikey=${key}&${query.toString()}`;
    const response = await fetch(omdbUrl);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('OMDB Proxy Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/**
 * Proxy YouTube to hide API Key
 */
app.get('/api/youtube-proxy', async (req, res) => {
  try {
    const key = req.headers['x-custom-key'] as string || process.env['YOUTUBE_API_KEY'];

    if (!key) {
      res.status(500).json({ error: 'YOUTUBE_API_KEY not configured' });
      return;
    }

    const query = new URLSearchParams(req.query as Record<string, string>);
    
    const ytUrl = `https://www.googleapis.com/youtube/v3/search?key=${key}&${query.toString()}`;
    const response = await fetch(ytUrl);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('YouTube Proxy Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/**
 * Example Express Rest API endpoints can be defined here.
 */

/**
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next(),
    )
    .catch(next);
});

/**
 * Start the server if this module is the main entry point, or it is ran via PM2.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url) || process.env['pm_id']) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, (error) => {
    if (error) {
      throw error;
    }

    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app);
