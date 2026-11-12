import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import dotenv from 'dotenv';

dotenv.config();

const API_KEY = process.env.ELEVENLABS_API_KEY || process.argv[2];
const VOICE_ID = process.env.ELEVENLABS_VOICE_ID || 'pNInz6obpgDQGcFmaJgB'; // Adam (default deep, clear voice) or Rachel: 21m00Tcm4TlvDq8ikWAM

if (!API_KEY) {
  console.error('ERROR: No ElevenLabs API key provided.');
  console.error('Usage: node generate_elevenlabs_audio.js <YOUR_API_KEY> [VOICE_ID]');
  process.exit(1);
}

const scenes = [
  {
    id: 1,
    text: "Welcome to Able AI, an autonomous finance and micro habit platform built for the PayPal AI Hackathon."
  },
  {
    id: 2,
    text: "Students and young adults receive lump sums, but high spending velocity often leads to empty balances before the term ends. Able AI continuously calculates your daily safe spend ceiling, keeping your cash flow balanced."
  },
  {
    id: 3,
    text: "When Gemini AI detects a spending surplus, users can approve micro transfers with a single click, executing directly through the PayPal Sandbox Orders API."
  },
  {
    id: 4,
    text: "Autonomous savings buckets automate rules like Friday sweeps or spare change roundups, turning small daily savings into emergency cushions."
  },
  {
    id: 5,
    text: "Collaborative pools let roommates split trips and bills using PayPal handles. When fully funded, Able AI automatically disburses the funds using the PayPal Payouts API."
  },
  {
    id: 6,
    text: "Every transaction is recorded in our enterprise live ledger powered by AG Grid, featuring multi-column sorting, live filtering, and one-click CSV export."
  },
  {
    id: 7,
    text: "Traditional budgeters do not need to start over. Users can upload an Excel or Google Sheets budget, and Gemini automatically extracts their categories, balances, and safe spend limits."
  },
  {
    id: 8,
    text: "Able AI is also built to live natively inside the PayPal mobile app. Users can view their safe spend dial on their home feed and execute one-tap sweeps directly from their PayPal balance."
  },
  {
    id: 9,
    text: "During online shopping, the Able AI guardrail intercepts checkouts that exceed your daily limit, offering intelligent peer-to-peer split options before payment authorization."
  },
  {
    id: 10,
    text: "Our conversational agentic copilot answers affordability questions and drafts executable PayPal payment payloads directly inside the chat window."
  },
  {
    id: 11,
    text: "Able AI bridges autonomous intelligence with the PayPal developer platform to turn little habits into big benefits. Thank you for watching."
  }
];

const DEMO_DIR = path.resolve('demo_video');
if (!fs.existsSync(DEMO_DIR)) {
  fs.mkdirSync(DEMO_DIR, { recursive: true });
}

async function generateAudioForScene(scene) {
  console.log(`Generating ElevenLabs voice for Scene ${scene.id}...`);
  const url = `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Accept': 'audio/mpeg',
      'Content-Type': 'application/json',
      'xi-api-key': API_KEY
    },
    body: JSON.stringify({
      text: scene.text,
      model_id: 'eleven_turbo_v2_5',
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.8
      }
    })
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`ElevenLabs API error (HTTP ${res.status}): ${errText}`);
  }

  const arrayBuffer = await res.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const mp3Path = path.join(DEMO_DIR, `scene${scene.id}_eleven.mp3`);
  const wavPath = path.join(DEMO_DIR, `scene${scene.id}.wav`);

  fs.writeFileSync(mp3Path, buffer);

  // Convert MP3 to standard 22050Hz mono WAV to ensure clean ffmpeg video sync
  execSync(`ffmpeg -y -i "${mp3Path}" -ar 22050 -ac 1 "${wavPath}"`);
  console.log(`Scene ${scene.id} audio saved to: ${wavPath}`);
}

async function run() {
  for (const scene of scenes) {
    await generateAudioForScene(scene);
  }
  console.log('\nAll 11 voice tracks successfully generated with ElevenLabs!');
  console.log('Now regenerating live action video with ElevenLabs audio...');
  execSync('node record_full_live_demo.js', { stdio: 'inherit' });
  console.log('\nDone! able_ai_demo.mp4 updated with ElevenLabs voiceover.');
}

run().catch(err => {
  console.error('Failed generating ElevenLabs audio:', err.message);
  process.exit(1);
});
