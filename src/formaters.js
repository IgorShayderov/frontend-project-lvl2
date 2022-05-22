function stylish(diff) {
  return Object.keys(diff).reduce((result, diffKey) => {
    const {
      isExistsInFirstFile,
      isExistsInSecondFile,
      areValuesEqual,
      firstFileValue,
      secondFileValue,
    } = diff[diffKey];
    const noEndingBraceStr = result.slice(0, result.length - 1);

    if (isExistsInFirstFile && isExistsInSecondFile) {
      if (areValuesEqual) {
        return `${noEndingBraceStr}   ${diffKey}: ${firstFileValue}\n}`;
      }

      return `${noEndingBraceStr} + ${diffKey}: ${firstFileValue}\n`
      + ` - ${diffKey}: ${secondFileValue}\n}`;
    }

    if (isExistsInFirstFile && !isExistsInSecondFile) {
      return `${noEndingBraceStr} + ${diffKey}: ${firstFileValue}\n}`;
    }

    return `${noEndingBraceStr} - ${diffKey}: ${secondFileValue}\n}`;
  }, '{\n}');
}

export function formatDiff(diff, formatterName = 'stylish') {
  switch (formatterName) {
    case 'stylish':
      return stylish(diff);
    default:
      throw new Error(`Unknown formatter name - ${formatterName}`);
  }
}
