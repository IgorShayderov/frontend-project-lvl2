import { stylish } from './stylish.js';

export function formatDiff(diff, formatterName = 'stylish') {
  switch (formatterName) {
    case 'stylish':
      return stylish(diff);
    default:
      throw new Error(`Unknown formatter name - ${formatterName}`);
  }
}
