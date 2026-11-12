import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createPayPalOrder, capturePayPalOrder, createPayPalPayout } from './paypal.js';
import { analyzeSpendingWithGemini, chatWithAbleCopilot, ingestSpreadsheetWithGemini } from './gemini.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'Able AI Autonomous Finance Engine',
    paypalConfigured: Boolean(process.env.PAYPAL_CLIENT_ID && process.env.PAYPAL_CLIENT_ID !== 'YOUR_PAYPAL_CLIENT_ID'),
    geminiConfigured: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'YOUR_GEMINI_API_KEY'),
  });
});

// Config Endpoint (Safe public config for frontend)
app.get('/api/config', (req, res) => {
  res.json({
    paypalClientId: process.env.PAYPAL_CLIENT_ID || 'sb',
    currency: 'GBP',
    environment: process.env.PAYPAL_MODE || 'sandbox',
  });
});

// PayPal: Create Order
app.post('/api/paypal/create-order', async (req, res) => {
  try {
    const { amount, currency = 'GBP', description, customId } = req.body;
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      return res.status(400).json({ error: 'Valid positive amount is required.' });
    }

    const order = await createPayPalOrder({ amount, currency, description, customId });
    res.json(order);
  } catch (error) {
    console.error('Error creating PayPal order:', error);
    res.status(500).json({ error: error.message || 'Failed to create PayPal order' });
  }
});

// PayPal: Capture Order
app.post('/api/paypal/capture-order', async (req, res) => {
  try {
    const { orderId } = req.body;
    if (!orderId) {
      return res.status(400).json({ error: 'orderId is required' });
    }

    const result = await capturePayPalOrder(orderId);
    res.json(result);
  } catch (error) {
    console.error('Error capturing PayPal order:', error);
    res.status(500).json({ error: error.message || 'Failed to capture PayPal order' });
  }
});

// PayPal: Group Pool Payout
app.post('/api/paypal/payout', async (req, res) => {
  try {
    const { amount, recipientEmail, recipientHandle, note } = req.body;
    if (!amount || Number(amount) <= 0) {
      return res.status(400).json({ error: 'Valid payout amount is required' });
    }

    const result = await createPayPalPayout({ amount, recipientEmail, recipientHandle, note });
    res.json(result);
  } catch (error) {
    console.error('Error creating PayPal payout:', error);
    res.status(500).json({ error: error.message || 'Failed to disburse PayPal payout' });
  }
});

// AI: Analyze Spending & Generate Behavioural Nudge
app.post('/api/ai/analyze', async (req, res) => {
  try {
    const { lumpBalance, dailySafeSpend, buckets, transactions, daysRemaining } = req.body;
    const analysis = await analyzeSpendingWithGemini({
      lumpBalance,
      dailySafeSpend,
      buckets,
      transactions,
      daysRemaining
    });
    res.json(analysis);
  } catch (error) {
    console.error('Error generating AI analysis:', error);
    res.status(500).json({ error: error.message || 'Failed to run AI analysis' });
  }
});

// AI: Agentic Copilot Chat
app.post('/api/ai/chat', async (req, res) => {
  try {
    const { message, history, financialContext } = req.body;
    const response = await chatWithAbleCopilot({ message, history, financialContext });
    res.json(response);
  } catch (error) {
    console.error('Error in AI Copilot chat:', error);
    res.status(500).json({ error: error.message || 'Failed to process AI chat' });
  }
});

// AI: Smart Spreadsheet Ingestion
app.post('/api/ai/import-spreadsheet', async (req, res) => {
  try {
    const { csvContent } = req.body;
    if (!csvContent) {
      return res.status(400).json({ error: 'csvContent is required' });
    }

    const result = await ingestSpreadsheetWithGemini({ csvContent });
    res.json(result);
  } catch (error) {
    console.error('Error importing spreadsheet with AI:', error);
    res.status(500).json({ error: error.message || 'Failed to ingest spreadsheet' });
  }
});

app.listen(PORT, () => {
  console.log(`[Able AI Backend] Server running on http://localhost:${PORT}`);
  console.log(`[Able AI Backend] PayPal Sandbox: ${process.env.PAYPAL_CLIENT_ID ? 'Configured' : 'Simulation Fallback Mode'}`);
  console.log(`[Able AI Backend] Gemini AI: ${process.env.GEMINI_API_KEY ? 'Configured' : 'Heuristic Fallback Engine'}`);
});
