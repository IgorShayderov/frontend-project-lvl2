import yaml from 'js-yaml';

export default function parseData(data, extension) {
  switch (extension) {
    case '.json':
      return JSON.parse(data);
    case '.yml':
      return yaml.load(data);
    default:
      throw new Error(`Unknown file extension - ${extension}`);
  }
}
