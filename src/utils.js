import _ from 'underscore';

const spaceHolderChar = "\u2002";

export default class U {
  static get spaceHolderChar() { 
    return spaceHolderChar;
  }

  static wtfLength(value) {
    return [...value].reduce((s, c) => {
        const ch = c.charCodeAt(0);
        return s + (ch == 0x200e ? 0 : ch > 255 ? 2 : 1);
      }, 0);
  }

  static wtfPad(text, maxSpaces) {
    return (
      text + spaceHolderChar.repeat(Math.max(maxSpaces - U.wtfLength(text), 0))
    );
  }

  static shrink(arr, expectedLength) {
    if (arr.length > (expectedLength << 2)) {
      return arr.slice(0, expectedLength << 1);
    } else { 
      return arr;
    }
  }

  static mutateWithCopy(arr, index, value) {
    const newArr = [...arr];
    newArr[index] = value;
    return newArr;
  }

  static withIndex(arr) {
    return _.zip(arr, Array.from(arr.keys()));
  }
}
