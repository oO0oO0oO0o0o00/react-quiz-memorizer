import _ from 'underscore';

const spaceHolderChar = "\u2002";

export default class U {
  static get spaceHolderChar() { 
    return spaceHolderChar;
  }

  static wtfLength(value: string) {
    return [...value].reduce((s, c) => {
        const ch = c.charCodeAt(0);
        return s + (ch == 0x200e ? 0 : ch > 255 ? 2 : 1);
      }, 0);
  }

  static wtfPad(text: string, maxSpaces: number) {
    return (
      text + spaceHolderChar.repeat(Math.max(maxSpaces - U.wtfLength(text), 0))
    );
  }

  static shrink(arr: any[], expectedLength: number) {
    if (arr.length > (expectedLength << 2)) {
      return arr.slice(0, expectedLength << 1);
    } else { 
      return arr;
    }
  }

  static mutateWithCopy<T>(arr: T[], index: number, value: T): T[] {
    const newArr = [...arr];
    newArr[index] = value;
    return newArr;
  }

  static withIndex<T>(arr: T[]): [T, number][] {
    return _.zip(arr, Array.from(arr.keys()));
  }
  
  static timeout(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  static apply<T, R>(on: T | null, fn: (p: T) => R) : R | null {
    if (!on) { return null; }
    return fn(on);
  }

  static apply_void<T>(on: T | null, fn: (p: T) => any) {
    if (on) { fn(on); }
  }

  static repeat<T>(arr: T[], repeats: number): T[] {
    return Array.from({ length: repeats }, () => arr).flat();
  }
}
