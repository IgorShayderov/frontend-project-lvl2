export function stylish(diff) {
  return Object.keys(diff).reduce((result, diffKey) => {
    const {
      type,
      firstValue,
      secondValue,
      children,
    } = diff[diffKey];

    const noEndingBraceStr = result.slice(0, result.length - 1);

    // if (isExistsInFirstFile && isExistsInSecondFile) {
    //   if (areValuesEqual) {
    //     return `${noEndingBraceStr}   ${diffKey}: ${firstValue}\n}`;
    //   }

    //   return `${noEndingBraceStr} + ${diffKey}: ${firstValue}\n`
    //   + ` - ${diffKey}: ${secondValue}\n}`;
    // }

    // if (isExistsInFirstFile && !isExistsInSecondFile) {
    //   return `${noEndingBraceStr} + ${diffKey}: ${firstValue}\n}`;
    // }
    function hz() {
      switch (type) {
        case 'only-in-first':
          return `- ${diffKey}: ${firstValue}\n`;
        case 'only-in-second':
          return `+ ${diffKey}: ${secondValue}\n`;
        case 'nested':
          return stylish(children);
        case 'both-equal':
          return `  ${diffKey}: ${firstValue}\n`;
        case 'changed':
          return `- ${diffKey}: ${firstValue}\n`
               + `+ ${diffKey}: ${secondValue}\n`;
        default:
          throw new Error(`Unknown type ${type}`);
      }
    }

    const newStr = hz();

    return `${noEndingBraceStr}${newStr}}`;
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
