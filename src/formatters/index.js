import { plain } from './plain.js';
import { stylish } from './stylish.js';

export function formatDiff(diff, formatterName) {
  switch (formatterName) {
    case 'stylish':
      return stylish(diff);
    case 'plain':
      return plain(diff);
    case 'json':
      return JSON.stringify(diff, null, 2);
    default:
      throw new Error(`Unknown formatter name - ${formatterName}`);
  }
}
