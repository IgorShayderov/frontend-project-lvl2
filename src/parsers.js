import yaml from 'js-yaml';

export function parseYml(file) {
  return yaml.load(file);
}

export function parseJSON(file) {
  return JSON.parse(file);
}
