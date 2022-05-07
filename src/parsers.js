import yaml from 'js-yaml';

export function parseYml(file) {
  return yaml.load(file);
}
