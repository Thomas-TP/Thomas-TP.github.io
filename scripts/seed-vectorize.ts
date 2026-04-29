/**
 * Seed the Vectorize index with portfolio knowledge chunks.
 *
 * Prerequisites:
 *   1. Create the index:
 *      wrangler vectorize create portfolio-knowledge --dimensions 768 --metric cosine
 *   2. Set environment variables:
 *      CF_ACCOUNT_ID=<your account id>
 *      CF_API_TOKEN=<your API token with Workers AI + Vectorize permissions>
 *   3. Run:
 *      bun run scripts/seed-vectorize.ts
 */

const ACCOUNT_ID = process.env.CF_ACCOUNT_ID;
const API_TOKEN = process.env.CF_API_TOKEN;
const INDEX_NAME = 'portfolio-knowledge';

if (!ACCOUNT_ID || !API_TOKEN) {
  console.error('Missing CF_ACCOUNT_ID or CF_API_TOKEN environment variables.');
  process.exit(1);
}

interface Chunk {
  id: string;
  text: string;
  category: string;
}

const chunks: Chunk[] = [
  {
    id: 'bio',
    category: 'identity',
    text: 'Thomas Prudhomme is a Computer Science student at Geneva Institute of Technology (Geneva IT School), pursuing a Swiss CFC. He is located in Geneva, Switzerland, available across the Lake Geneva region. He speaks native French and fluent English. He is open to internships and freelance work.',
  },
  {
    id: 'education',
    category: 'education',
    text: 'Thomas is on the Swiss CFC track at Geneva IT School. Timeline: 2024 school entry, 2025 development phase, 2026 specialization (current year), 2027 internship, 2028 graduation.',
  },
  {
    id: 'focus-areas',
    category: 'skills',
    text: 'Thomas focuses on: cloud computing, cybersecurity and ethical hacking, IoT and smart home, and web development with a modern React stack.',
  },
  {
    id: 'certifications',
    category: 'credentials',
    text: 'Thomas holds verified professional certifications in cloud, cybersecurity, and software development. All badges are publicly verifiable on his Credly profile: https://www.credly.com/users/thomas-prudhomme',
  },
  {
    id: 'tech-portfolio',
    category: 'tech',
    text: 'Portfolio site tech stack: Bun runtime, Rsbuild + Rspack bundler, React 19, TypeScript 6, UnoCSS, GSAP animations, Three.js with react-three-fiber for 3D, i18next for FR+EN internationalization, Cloudflare Pages hosting with Cloudflare Workers backend using KV and Workers AI, Resend for email, Cloudflare Turnstile CAPTCHA, pdfjs-dist with react-pdf for CV display.',
  },
  {
    id: 'tech-other',
    category: 'tech',
    text: 'Other technologies Thomas knows: PowerShell scripting and system automation, Rust + Tauri (TomBoard project), Cisco Packet Tracer for networking, HTML/CSS/vanilla JavaScript, Flutter/Dart for mobile, C++ and Swift for mobile build chains.',
  },
  {
    id: 'project-xclone',
    category: 'project',
    text: 'X-clone (2024) — A Twitter/X clone with AI chat (Grok integration). Built with HTML/CSS/JavaScript. A responsive web application replicating the X platform UI with integrated AI chat features. Repository: https://github.com/Thomas-TP/X-clone. Live: https://x-clone-teal-phi.vercel.app/',
  },
  {
    id: 'project-empire',
    category: 'project',
    text: 'PowerShell Empire (2024) — Modernized fork of the Empire post-exploitation framework for ethical security testing. Built with PowerShell for cybersecurity automation and scripting. Repository: https://github.com/Thomas-TP/Powershell-Empire-test',
  },
  {
    id: 'project-tankio',
    category: 'project',
    text: 'Tank.io (2025) — Multiplayer tank battle game with React + HTML5 Canvas, featuring real-time gameplay via WebSocket technology. A game development project showcasing multiplayer networking and Canvas API rendering. Live: https://tank-io-wr49.onrender.com. Repository: https://github.com/Thomas-TP/Tank.io',
  },
  {
    id: 'project-tomboard',
    category: 'project',
    text: 'TomBoard (2026) — Open-source Windows soundboard, a free Voicemod alternative. Features real-time voice changer with presets, dual audio output to speakers and virtual microphone for Discord/OBS, drag-and-drop sound organization, and global hotkeys. Built with Rust, Tauri, React, and TypeScript for audio DSP. Repository: https://github.com/Thomas-TP/tomboard. Releases: https://github.com/Thomas-TP/TomBoard/releases',
  },
  {
    id: 'contact',
    category: 'contact',
    text: 'Contact Thomas: email thomas@prudhomme.li, contact form at https://thomastp.ch/#contact, all links at https://links.thomastp.ch, GitHub https://github.com/Thomas-TP, LinkedIn https://www.linkedin.com/in/thomas-tp/, Credly https://www.credly.com/users/thomas-prudhomme, CV/Resume at https://thomastp.ch/documents/ThomasPrudhommeCV.pdf',
  },
  {
    id: 'personality',
    category: 'identity',
    text: 'Thomas is detail-oriented and craft-focused: his portfolio scores Lighthouse 100 across all categories, features custom GLSL shaders, and is fully edge-deployed. He is bilingual (French/English).',
  },
];

const API_BASE = `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}`;
const headers = { Authorization: `Bearer ${API_TOKEN}`, 'Content-Type': 'application/json' };

async function embed(texts: string[]): Promise<number[][]> {
  const res = await fetch(`${API_BASE}/ai/run/@cf/baai/bge-base-en-v1.5`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ text: texts }),
  });
  if (!res.ok) throw new Error(`Embedding failed: ${res.status} ${await res.text()}`);
  const data = (await res.json()) as { result: { data: number[][] } };
  return data.result.data;
}

async function upsertVectors(
  vectors: Array<{ id: string; values: number[]; metadata: Record<string, string> }>,
) {
  const ndjson = vectors.map((v) => JSON.stringify(v)).join('\n');
  const res = await fetch(`${API_BASE}/vectorize/v2/indexes/${INDEX_NAME}/upsert`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${API_TOKEN}`, 'Content-Type': 'application/x-ndjson' },
    body: ndjson,
  });
  if (!res.ok) throw new Error(`Upsert failed: ${res.status} ${await res.text()}`);
  return res.json();
}

async function main() {
  console.log(`Seeding ${chunks.length} chunks into Vectorize index "${INDEX_NAME}"...`);

  console.log('Generating embeddings...');
  const texts = chunks.map((c) => c.text);
  const embeddings = await embed(texts);
  console.log(`  Got ${embeddings.length} embeddings (${embeddings[0].length} dimensions)`);

  const vectors = chunks.map((c, i) => ({
    id: c.id,
    values: embeddings[i],
    metadata: { text: c.text, category: c.category },
  }));

  console.log('Upserting vectors...');
  const result = await upsertVectors(vectors);
  console.log('Done:', JSON.stringify(result, null, 2));
}

main();
