// scripts/mock-scraper.ts
// APIx Mock Scraper — Standalone runner
// ⚠️  This is NOT real web scraping. Generates simulated fare data for SIH 2026 demo.

import 'dotenv/config';
import mongoose from 'mongoose';
import { runMockScraper } from '../src/services/scraperService';

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('❌ MONGODB_URI not set. Create a .env file from .env.example');
    process.exit(1);
  }

  console.log('Connecting to MongoDB...');
  await mongoose.connect(uri);
  console.log('✅ Connected\n');

  const result = await runMockScraper();

  console.log('\n══════════════════════════════════════════');
  console.log('  APIx Mock Scraper — Summary');
  console.log('══════════════════════════════════════════');
  console.log(`  Sources scanned:   ${result.sourcesScanned}`);
  console.log(`  Routes processed:  ${result.routesProcessed}`);
  console.log(`  Records collected: ${result.recordsCollected}`);
  console.log(`  Valid records:     ${result.validRecords}`);
  console.log(`  Records inserted:  ${result.recordsInserted}`);
  console.log(`  Status:            ${result.status.toUpperCase()}`);
  console.log('══════════════════════════════════════════\n');

  await mongoose.disconnect();
  console.log('Disconnected from MongoDB. Done.');
}

main().catch((err) => {
  console.error('Scraper error:', err);
  process.exit(1);
});
