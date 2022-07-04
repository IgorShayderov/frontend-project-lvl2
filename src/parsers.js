import yaml from 'js-yaml';

export function parseYml(data) {
  return yaml.load(data);
}

export function parseJSON(data) {
  return JSON.parse(data);
}
