import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const DEMO_DIR = path.resolve('demo_video');

function getAudioDuration(wavPath) {
  try {
    const out = execSync(`ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${wavPath}"`).toString().trim();
    return parseFloat(out);
  } catch (e) {
    return 10.0;
  }
}

async function main() {
  console.log('Starting live action demo video recording...');

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1280,720', '--force-device-scale-factor=1']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 720 });
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });

  // Inject virtual cursor and helper styles
  await page.evaluate(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      #demo-cursor {
        position: fixed;
        top: 0;
        left: 0;
        z-index: 9999999;
        pointer-events: none;
        transition: transform 0.04s linear;
        filter: drop-shadow(0 4px 6px rgba(0,0,0,0.3));
      }
      .click-ripple {
        position: fixed;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background: rgba(0, 112, 186, 0.4);
        border: 2px solid #0070BA;
        transform: translate(-50%, -50%) scale(0);
        pointer-events: none;
        z-index: 9999998;
        animation: rippleAnim 0.35s ease-out forwards;
      }
      @keyframes rippleAnim {
        0% { transform: translate(-50%, -50%) scale(0.2); opacity: 1; }
        100% { transform: translate(-50%, -50%) scale(2.2); opacity: 0; }
      }
    `;
    document.head.appendChild(style);

    const cursor = document.createElement('div');
    cursor.id = 'demo-cursor';
    cursor.innerHTML = `
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
        <path d="M4 4L11 20L14 13L21 10L4 4Z" fill="#0070BA" stroke="#ffffff" stroke-width="2" stroke-linejoin="round"/>
      </svg>
    `;
    cursor.style.transform = 'translate(640px, 360px)';
    document.body.appendChild(cursor);

    window.__cursorX = 640;
    window.__cursorY = 360;

    window.moveCursorTo = (x, y) => {
      window.__cursorX = x;
      window.__cursorY = y;
      cursor.style.transform = `translate(${x}px, ${y}px)`;
    };

    window.triggerClickEffect = (x, y) => {
      const rip = document.createElement('div');
      rip.className = 'click-ripple';
      rip.style.left = `${x}px`;
      rip.style.top = `${y}px`;
      document.body.appendChild(rip);
      setTimeout(() => rip.remove(), 400);
    };
  });

  const fps = 15;
  const concatList = path.join(DEMO_DIR, 'live_concat_list.txt');
  if (fs.existsSync(concatList)) fs.unlinkSync(concatList);

  async function recordScene(sceneNumber, actionFn) {
    console.log(`\n=== Recording Live Scene ${sceneNumber} ===`);
    const wavPath = path.join(DEMO_DIR, `scene${sceneNumber}.wav`);
    const outMp4Path = path.join(DEMO_DIR, `live_scene${sceneNumber}.mp4`);
    const framesDir = path.join(DEMO_DIR, `frames_scene_${sceneNumber}`);

    if (fs.existsSync(framesDir)) fs.rmSync(framesDir, { recursive: true, force: true });
    fs.mkdirSync(framesDir, { recursive: true });

    const audioDur = getAudioDuration(wavPath);
    const targetFrames = Math.max(15, Math.round((audioDur + 0.3) * fps));
    console.log(`Audio: ${audioDur.toFixed(2)}s | Target Frames: ${targetFrames}`);

    let frameCount = 0;
    async function snap() {
      const p = path.join(framesDir, `f_${String(frameCount).padStart(5, '0')}.jpg`);
      await page.screenshot({ path: p, type: 'jpeg', quality: 80 });
      frameCount++;
    }

    async function moveCursor(tx, ty, steps = 10) {
      const cur = await page.evaluate(() => ({ x: window.__cursorX, y: window.__cursorY }));
      for (let s = 1; s <= steps; s++) {
        const nx = cur.x + (tx - cur.x) * (s / steps);
        const ny = cur.y + (ty - cur.y) * (s / steps);
        await page.evaluate((x, y) => window.moveCursorTo(x, y), nx, ny);
        await snap();
      }
    }

    async function clickPoint(x, y, holdFrames = 6) {
      await page.evaluate((cx, cy) => window.triggerClickEffect(cx, cy), x, y);
      await snap();
      for (let i = 0; i < holdFrames; i++) await snap();
    }

    async function smoothScroll(deltaY, steps = 12) {
      const perStep = deltaY / steps;
      for (let s = 0; s < steps; s++) {
        await page.evaluate((dy) => window.scrollBy(0, dy), perStep);
        await snap();
      }
    }

    async function hold(n = 6) {
      for (let i = 0; i < n; i++) await snap();
    }

    const helpers = { snap, moveCursor, clickPoint, smoothScroll, hold, page };
    await actionFn(helpers);

    // If recorded frames are less than target, hold on last frame
    if (frameCount < targetFrames) {
      const needed = targetFrames - frameCount;
      const lastFrame = path.join(framesDir, `f_${String(frameCount - 1).padStart(5, '0')}.jpg`);
      for (let i = 0; i < needed; i++) {
        const dest = path.join(framesDir, `f_${String(frameCount).padStart(5, '0')}.jpg`);
        fs.copyFileSync(lastFrame, dest);
        frameCount++;
      }
    }

    console.log(`Total frames for Scene ${sceneNumber}: ${frameCount}. Encoding MP4...`);
    execSync(`ffmpeg -y -framerate ${fps} -i "${framesDir}\\f_%05d.jpg" -i "${wavPath}" -c:v libx264 -pix_fmt yuv420p -c:a aac -shortest -movflags +faststart "${outMp4Path}"`);

    fs.appendFileSync(concatList, `file '${path.basename(outMp4Path)}'\n`);
    // Cleanup frame images to keep disk free
    fs.rmSync(framesDir, { recursive: true, force: true });
    console.log(`Scene ${sceneNumber} complete: ${path.basename(outMp4Path)}`);
  }

  // --- SCENE 1: Introduction ---
  await recordScene(1, async ({ moveCursor, smoothScroll, hold, page }) => {
    // Reset to top
    await page.evaluate(() => window.scrollTo(0, 0));
    await hold(5);
    // Cursor glides from center to the brand logo
    await moveCursor(220, 105, 12);
    await hold(10);
    // Cursor glides to the PayPal Sandbox badge
    await moveCursor(1180, 105, 12);
    await hold(10);
    // Cursor glides to Presentation Mode toggle
    await moveCursor(380, 20, 10);
    await hold(12);
    // Return to center
    await moveCursor(640, 360, 10);
    await hold(10);
  });

  // --- SCENE 2: Standalone Dashboard Overview & Safe Spend ---
  await recordScene(2, async ({ moveCursor, smoothScroll, hold, page }) => {
    // Cursor glides across KPI cards
    await moveCursor(320, 190, 10); // Safe spend card
    await hold(12);
    await moveCursor(640, 190, 10); // Balance runway card
    await hold(12);
    await moveCursor(960, 190, 10); // Total saved card
    await hold(12);
    // Smooth scroll down to reveal behavioral nudge and recent transactions
    await smoothScroll(380, 18);
    await hold(15);
    // Cursor points to the behavioral nudge
    await moveCursor(450, 280, 12);
    await hold(15);
    // Smooth scroll back up
    await smoothScroll(-380, 18);
    await hold(10);
    // Cursor hovers on the "Approve & Fund" button
    const btnCoords = await page.evaluate(() => {
      const b = Array.from(document.querySelectorAll('button')).find(x => x.innerText.includes('Approve & Fund'));
      if (!b) return null;
      const r = b.getBoundingClientRect();
      return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    });
    if (btnCoords) {
      await moveCursor(btnCoords.x, btnCoords.y, 12);
    }
    await hold(15);
  });

  // --- SCENE 3: PayPal Sandbox Orders API Micro-Transfer ---
  await recordScene(3, async ({ moveCursor, clickPoint, hold, page }) => {
    // Click "Approve & Fund" to open PayPal Modal
    const btnCoords = await page.evaluate(() => {
      const b = Array.from(document.querySelectorAll('button')).find(x => x.innerText.includes('Approve & Fund'));
      if (!b) return null;
      b.click();
      const r = b.getBoundingClientRect();
      return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    });
    if (btnCoords) {
      await clickPoint(btnCoords.x, btnCoords.y, 8);
    }
    await hold(10);

    // Cursor moves down modal to "Complete Payment" button
    const payBtnCoords = await page.evaluate(() => {
      const b = Array.from(document.querySelectorAll('button')).find(x => x.innerText.includes('Complete Payment'));
      if (!b) return null;
      const r = b.getBoundingClientRect();
      return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    });

    if (payBtnCoords) {
      await moveCursor(payBtnCoords.x, payBtnCoords.y, 14);
      await hold(6);
      await page.evaluate(() => {
        const b = Array.from(document.querySelectorAll('button')).find(x => x.innerText.includes('Complete Payment'));
        if (b) b.click();
      });
      await clickPoint(payBtnCoords.x, payBtnCoords.y, 15);
    }

    // Modal shows completed state, then closes or holds
    await hold(20);
    // Close modal if still open
    await page.evaluate(() => {
      const closeBtn = document.querySelector('button[aria-label="Close"], .modal-close');
      if (closeBtn) closeBtn.click();
    });
    await hold(10);
  });

  // --- SCENE 4: Savings Buckets ---
  await recordScene(4, async ({ moveCursor, clickPoint, smoothScroll, hold, page }) => {
    // Switch tab to Savings Buckets
    const tabCoords = await page.evaluate(() => {
      const tabs = Array.from(document.querySelectorAll('button'));
      const t = tabs.find(x => x.innerText.trim() === 'Savings Buckets');
      if (t) {
        t.click();
        const r = t.getBoundingClientRect();
        return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
      }
      return null;
    });

    if (tabCoords) {
      await moveCursor(tabCoords.x, tabCoords.y, 10);
      await clickPoint(tabCoords.x, tabCoords.y, 8);
    }
    await hold(12);

    // Cursor inspects buckets
    await moveCursor(320, 320, 12);
    await hold(10);
    await moveCursor(640, 320, 10);
    await hold(10);
    await moveCursor(960, 320, 10);
    await hold(12);
  });

  // --- SCENE 5: Group Goals & Payouts API ---
  await recordScene(5, async ({ moveCursor, clickPoint, smoothScroll, hold, page }) => {
    // Switch tab to Group Goals
    const tabCoords = await page.evaluate(() => {
      const tabs = Array.from(document.querySelectorAll('button'));
      const t = tabs.find(x => x.innerText.trim() === 'Group Goals');
      if (t) {
        t.click();
        const r = t.getBoundingClientRect();
        return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
      }
      return null;
    });

    if (tabCoords) {
      await moveCursor(tabCoords.x, tabCoords.y, 10);
      await clickPoint(tabCoords.x, tabCoords.y, 8);
    }
    await hold(14);

    // Cursor points to "Ibiza Summer Trip" progress bar
    await moveCursor(420, 340, 12);
    await hold(12);
    // Smooth scroll down to view contributors and payout badge
    await smoothScroll(250, 15);
    await hold(15);
    await moveCursor(480, 420, 10);
    await hold(15);
    await smoothScroll(-250, 15);
    await hold(10);
  });

  // --- SCENE 6: AG Grid Live Ledger ---
  await recordScene(6, async ({ moveCursor, clickPoint, hold, page }) => {
    // Switch tab to Live Ledger (AG Grid)
    const tabCoords = await page.evaluate(() => {
      const tabs = Array.from(document.querySelectorAll('button'));
      const t = tabs.find(x => x.innerText.includes('Live Ledger'));
      if (t) {
        t.click();
        const r = t.getBoundingClientRect();
        return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
      }
      return null;
    });

    if (tabCoords) {
      await moveCursor(tabCoords.x, tabCoords.y, 10);
      await clickPoint(tabCoords.x, tabCoords.y, 8);
    }
    await hold(12);

    // Cursor moves to Search input in AG Grid toolbar
    const searchCoords = await page.evaluate(() => {
      const input = document.querySelector('input[placeholder*="Search all columns"]');
      if (input) {
        input.focus();
        const r = input.getBoundingClientRect();
        return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
      }
      return null;
    });

    if (searchCoords) {
      await moveCursor(searchCoords.x, searchCoords.y, 10);
      await clickPoint(searchCoords.x, searchCoords.y, 4);

      // Type "paypal" live
      for (const ch of 'paypal') {
        await page.keyboard.type(ch);
        await hold(2);
      }
      await hold(12);

      // Clear search input
      await page.evaluate(() => {
        const input = document.querySelector('input[placeholder*="Search all columns"]');
        if (input) {
          input.value = '';
          input.dispatchEvent(new Event('input', { bubbles: true }));
        }
      });
      await hold(6);
    }

    // Move to Export CSV button and click
    const exportCoords = await page.evaluate(() => {
      const b = Array.from(document.querySelectorAll('button')).find(x => x.innerText.includes('Export CSV'));
      if (!b) return null;
      const r = b.getBoundingClientRect();
      return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    });

    if (exportCoords) {
      await moveCursor(exportCoords.x, exportCoords.y, 10);
      await clickPoint(exportCoords.x, exportCoords.y, 8);
    }
    await hold(10);
  });

  // --- SCENE 7: Spreadsheet Budget Ingestion Engine ---
  await recordScene(7, async ({ moveCursor, clickPoint, hold, page }) => {
    // Click "Import Spreadsheet" button in navbar
    const btnCoords = await page.evaluate(() => {
      const b = Array.from(document.querySelectorAll('button')).find(x => x.innerText.includes('Import Spreadsheet'));
      if (b) {
        b.click();
        const r = b.getBoundingClientRect();
        return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
      }
      return null;
    });

    if (btnCoords) {
      await moveCursor(btnCoords.x, btnCoords.y, 10);
      await clickPoint(btnCoords.x, btnCoords.y, 8);
    }
    await hold(12);

    // Click "+ Load Sample Student Budget CSV"
    const sampleBtnCoords = await page.evaluate(() => {
      const b = Array.from(document.querySelectorAll('button')).find(x => x.innerText.includes('Load Sample Student Budget CSV'));
      if (!b) return null;
      const r = b.getBoundingClientRect();
      return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    });

    if (sampleBtnCoords) {
      await moveCursor(sampleBtnCoords.x, sampleBtnCoords.y, 12);
      await clickPoint(sampleBtnCoords.x, sampleBtnCoords.y, 4);
      await page.evaluate(() => {
        const b = Array.from(document.querySelectorAll('button')).find(x => x.innerText.includes('Load Sample Student Budget CSV'));
        if (b) b.click();
      });
    }
    await hold(18);

    // Click "Calibrate Able AI with Spreadsheet"
    const calibBtnCoords = await page.evaluate(() => {
      const b = Array.from(document.querySelectorAll('button')).find(x => x.innerText.includes('Calibrate Able AI'));
      if (!b) return null;
      const r = b.getBoundingClientRect();
      return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    });

    if (calibBtnCoords) {
      await moveCursor(calibBtnCoords.x, calibBtnCoords.y, 12);
      await clickPoint(calibBtnCoords.x, calibBtnCoords.y, 6);
      await page.evaluate(() => {
        const b = Array.from(document.querySelectorAll('button')).find(x => x.innerText.includes('Calibrate Able AI'));
        if (b) b.click();
      });
    }
    await hold(22);
  });

  // --- SCENE 8: Inside PayPal Mobile App View ---
  await recordScene(8, async ({ moveCursor, clickPoint, smoothScroll, hold, page }) => {
    // Switch to "2. Inside PayPal Mobile App"
    const mobileBtnCoords = await page.evaluate(() => {
      const b = Array.from(document.querySelectorAll('button')).find(x => x.innerText.includes('Inside PayPal Mobile App'));
      if (b) {
        b.click();
        const r = b.getBoundingClientRect();
        return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
      }
      return null;
    });

    if (mobileBtnCoords) {
      await moveCursor(mobileBtnCoords.x, mobileBtnCoords.y, 10);
      await clickPoint(mobileBtnCoords.x, mobileBtnCoords.y, 8);
    }
    await hold(15);

    // Smooth scroll down the mobile view
    await smoothScroll(240, 16);
    await hold(12);

    // Move to 1-Tap Sweep button on the Able AI card inside PayPal
    const sweepBtnCoords = await page.evaluate(() => {
      const b = Array.from(document.querySelectorAll('button')).find(x => x.innerText.includes('1-Tap Sweep'));
      if (!b) return null;
      const r = b.getBoundingClientRect();
      return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    });

    if (sweepBtnCoords) {
      await moveCursor(sweepBtnCoords.x, sweepBtnCoords.y, 12);
      await clickPoint(sweepBtnCoords.x, sweepBtnCoords.y, 8);
      await page.evaluate(() => {
        const b = Array.from(document.querySelectorAll('button')).find(x => x.innerText.includes('1-Tap Sweep'));
        if (b) b.click();
      });
    }
    await hold(20);
  });

  // --- SCENE 9: Point-of-Sale Checkout Guardrail ---
  await recordScene(9, async ({ moveCursor, clickPoint, hold, page }) => {
    // Close any open modals
    await page.evaluate(() => {
      const closeBtn = document.querySelector('button[aria-label="Close"]');
      if (closeBtn) closeBtn.click();
    });
    await hold(4);

    // Click "Checkout Guardrail" in top navbar
    const guardrailBtnCoords = await page.evaluate(() => {
      const b = Array.from(document.querySelectorAll('button')).find(x => x.innerText.includes('Checkout Guardrail'));
      if (b) {
        b.click();
        const r = b.getBoundingClientRect();
        return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
      }
      return null;
    });

    if (guardrailBtnCoords) {
      await moveCursor(guardrailBtnCoords.x, guardrailBtnCoords.y, 10);
      await clickPoint(guardrailBtnCoords.x, guardrailBtnCoords.y, 8);
    }
    await hold(15);

    // Cursor hovers on "Split 50% with @maya_r"
    await moveCursor(640, 410, 12);
    await clickPoint(640, 410, 8);
    await hold(12);

    // Move to "Confirm Split Action" button and click
    const confirmBtnCoords = await page.evaluate(() => {
      const b = Array.from(document.querySelectorAll('button')).find(x => x.innerText.includes('Confirm') || x.innerText.includes('Proceed') || x.innerText.includes('Authorize'));
      if (!b) return null;
      const r = b.getBoundingClientRect();
      return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    });

    if (confirmBtnCoords) {
      await moveCursor(confirmBtnCoords.x, confirmBtnCoords.y, 10);
      await clickPoint(confirmBtnCoords.x, confirmBtnCoords.y, 8);
      await page.evaluate(() => {
        const b = Array.from(document.querySelectorAll('button')).find(x => x.innerText.includes('Confirm') || x.innerText.includes('Proceed') || x.innerText.includes('Authorize'));
        if (b) b.click();
      });
    }
    await hold(18);
  });

  // --- SCENE 10: Agentic AI Copilot Drawer ---
  await recordScene(10, async ({ moveCursor, clickPoint, hold, page }) => {
    // Switch back to Standalone App mode
    await page.evaluate(() => {
      const b = Array.from(document.querySelectorAll('button')).find(x => x.innerText.includes('Standalone App'));
      if (b) b.click();
    });
    await hold(6);

    // Click "Ask AI Agent" button
    const copilotBtnCoords = await page.evaluate(() => {
      const b = Array.from(document.querySelectorAll('button')).find(x => x.innerText.includes('Ask AI Agent'));
      if (b) {
        b.click();
        const r = b.getBoundingClientRect();
        return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
      }
      return null;
    });

    if (copilotBtnCoords) {
      await moveCursor(copilotBtnCoords.x, copilotBtnCoords.y, 10);
      await clickPoint(copilotBtnCoords.x, copilotBtnCoords.y, 8);
    }
    await hold(15);

    // Click quick question: "Can I afford dinner tonight for £25?"
    const questionCoords = await page.evaluate(() => {
      const b = Array.from(document.querySelectorAll('button')).find(x => x.innerText.includes('dinner tonight'));
      if (!b) return null;
      const r = b.getBoundingClientRect();
      return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    });

    if (questionCoords) {
      await moveCursor(questionCoords.x, questionCoords.y, 12);
      await clickPoint(questionCoords.x, questionCoords.y, 6);
      await page.evaluate(() => {
        const b = Array.from(document.querySelectorAll('button')).find(x => x.innerText.includes('dinner tonight'));
        if (b) b.click();
      });
    }
    await hold(22);
  });

  // --- SCENE 11: Summary & Outro ---
  await recordScene(11, async ({ moveCursor, hold, page }) => {
    // Close drawer
    await page.evaluate(() => {
      const closeBtn = document.querySelector('button[aria-label="Close"], button.copilot-close');
      if (closeBtn) closeBtn.click();
    });
    await hold(8);

    // Move cursor smoothly across KPIs to the PayPal badge
    await moveCursor(400, 200, 15);
    await hold(10);
    await moveCursor(1180, 105, 15);
    await hold(15);
    await moveCursor(640, 360, 12);
    await hold(18);
  });

  await browser.close();
  console.log('\nAll scenes recorded! Concatenating final video...');

  const finalVideo = path.resolve('able_ai_demo.mp4');
  execSync(`ffmpeg -y -f concat -safe 0 -i "${concatList}" -c copy "${finalVideo}"`);

  console.log(`\nFINAL VIDEO CREATED SUCCESSFULLY at: ${finalVideo}`);
  const finalDur = execSync(`ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${finalVideo}"`).toString().trim();
  const stats = fs.statSync(finalVideo);
  console.log(`Duration: ${parseFloat(finalDur).toFixed(1)} seconds (${(parseFloat(finalDur)/60).toFixed(2)} mins)`);
  console.log(`File Size: ${(stats.size / (1024 * 1024)).toFixed(2)} MB`);
}

main().catch(err => {
  console.error('Recording failed:', err);
  process.exit(1);
});
