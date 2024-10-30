import _ from "underscore";
import { Quiz } from "./collection";
import U from "../utils";

type WildcardPattern = (string | number)[];

function *wildcardIterator(pattern: WildcardPattern, entries: string[]) {
  let state: number[] = Array(pattern.length).fill(0);
  const maxState: number[] = Array(pattern.length).fill(0);
  let varCount = pattern.reduce<number>((s, e) => s + +(e == 'x'), 0)
  for (let [ch, i] of U.withIndex(pattern)) {
    if (ch == 'x') {
      maxState[i] = varCount;
      varCount -= 1;
    } else {
      maxState[i] = 1;
    }
  }
  let vars = new Set(entries.keys());
  for (let ch of pattern) {
    vars.delete(ch as any);
  }
  while (true) {
    const varIndexes = Array.from(vars);
    let result: number[] = [];
    for (let [s, ch] of _.zip(state, pattern)) {
      if (ch == 'x') {
        result.push(varIndexes[s]);
        varIndexes.splice(s, 1);
      } else {
        result.push(ch as any);
      }
    }
    yield result.map((i) => entries[i]);
    for (let index = pattern.length - 1; index >= 0; index--) {
      state[index] += 1;
      if (state[index] < maxState[index]) {
        break;
      }
      if (index != 0) {
        state[index] = 0;
      }
    }
    if (state[0] >= maxState[0]) {
      break;
    }
  }
}

function *chainIterator<T>(matchers: Generator<T>[]) {
  for (const matcher of matchers) {
    for (const val of matcher) {
      yield val;
    }
  }
}

export function textMatches(quiz: Quiz, text: string) {
  const matcher = chainIterator(quiz.answers.map(
    (a) => wildcardIterator(a, quiz.entries)));
  let cnt = 0;
  for (const segments of matcher) {
    if (cnt > 99) { return false; }
    cnt += 1;
    const pattern = segments.join('');
    console.log({reg:pattern});
    if (_toRegex(pattern).test(text)) {
      return true;
    }
  }
  return false;
}

function _toRegex(pattern: string): RegExp {
  return new RegExp(Array.from(pattern).map((character) => {
    // TODO: escaping
    let alts = [character].concat(
      _.flatten<string[]>(
        _transcribe(character).map(
          (text) => {
            // miao -> m(i(a(o)?)?)?
            const arr = Array.from(text);
            return `${arr.join('(')}${Array(arr.length - 1).fill(")?").join('')}`;
          }), 1));
    return alts.length == 1 ? alts : `(${alts.join('|')})`
  }).join(''));
}

function _transcribe(character: string): string[] {
  // TODO: Support PinYin.
  return ["miao"];
}
