import yaml from 'js-yaml';

const parseData = (data, extension) => {
  switch (extension) {
    case 'json':
      return JSON.parse(data);
    case 'yml':
      return yaml.load(data);
    default:
      throw new Error(`Unknown file extension - ${extension}`);
  }
};

export default parseData;
