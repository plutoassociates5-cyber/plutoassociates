/**
 * Aggregates the curated FAQ database from the per-practice seed modules and
 * assigns each record a stable id + display order. `contentStore` seeds its
 * `pa_faqs` collection from `FAQ_SEED`, so the public site + admin both read
 * the merged database (seed content merged with any admin overrides).
 */
import { companySeed } from './seed/company.js';
import { governanceSeed } from './seed/governance.js';
import { contractSeed } from './seed/contracts.js';
import { employmentTaxSeed } from './seed/people.js';
import { ipPropertySeed } from './seed/propertyIp.js';
import { disputeSeed } from './seed/dispute.js';
import { otherSeed } from './seed/other.js';

function slugId(question) {
  return ('fq-' + String(question)
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 48)) || 'faq';
}

function withIds(arr, start) {
  const seen = new Map();
  return arr.map((r, i) => {
    let id = slugId(r.question);
    if (seen.has(id)) {
      const n = seen.get(id) + 1;
      seen.set(id, n);
      id = `${id}-${n}`;
    } else {
      seen.set(id, 1);
    }
    return { ...r, id, order: start + i };
  });
}

export const FAQ_SEED = withIds([
  ...companySeed,
  ...governanceSeed,
  ...contractSeed,
  ...employmentTaxSeed,
  ...ipPropertySeed,
  ...disputeSeed,
  ...otherSeed,
], 1).sort((a, b) => a.order - b.order);

export default FAQ_SEED;