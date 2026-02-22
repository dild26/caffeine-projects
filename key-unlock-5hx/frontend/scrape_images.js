import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TARGET_URL = 'https://key-unlock-5hx.caffeine.xyz';
// Use process.cwd() or similar if __dirname behaves unexpectedly in some envs, 
// but since we run `node scrape_images.js` from `frontend`, `__dirname` is `frontend`.
// We want to save to `public` (create if missing) or `src/assets`.
// Let's look for `public` first.
const OUTPUT_DIR = path.join(__dirname, 'public');

if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function downloadImage(url, filepath) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            if (res.statusCode === 200) {
                res.pipe(fs.createWriteStream(filepath))
                    .on('error', reject)
                    .once('close', () => resolve(filepath));
            } else {
                res.resume();
                reject(new Error(`Request Failed With a Status Code: ${res.statusCode}`));
            }
        });
    });
}

function fetchHtml(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve(data));
            res.on('error', reject);
        });
    });
}

(async () => {
    console.log(`Fetching ${TARGET_URL}...`);
    try {
        const html = await fetchHtml(TARGET_URL);
        const imgRegex = /src="([^"]+\.(png|jpg|jpeg|svg|ico|webp))"/g;
        const linkRegex = /href="([^"]+\.(png|jpg|jpeg|svg|ico|webp))"/g;

        const images = new Set();
        let match;

        while ((match = imgRegex.exec(html)) !== null) {
            images.add(match[1]);
        }
        while ((match = linkRegex.exec(html)) !== null) {
            images.add(match[1]);
        }

        console.log(`Found ${images.size} potential images.`);

        for (const imgPath of images) {
            // Handle relative URLs
            let fullUrl = imgPath.startsWith('http') ? imgPath : new URL(imgPath, TARGET_URL).toString();
            try {
                const filename = path.basename(new URL(fullUrl).pathname) || 'image.png';
                const filepath = path.join(OUTPUT_DIR, filename);
                console.log(`Downloading ${fullUrl} to ${filepath}...`);
                await downloadImage(fullUrl, filepath);
            } catch (e) {
                console.error(`Failed to download ${fullUrl}:`, e.message);
            }
        }
        console.log('Done.');
    } catch (e) {
        console.error('Scraping failed:', e);
    }
})();
