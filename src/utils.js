const spaceHolderChar = "\u2002";

function wtfLength(value) {
  return [...value].reduce((s, c) => {
      const ch = c.charCodeAt(0);
      return s + (ch == 0x200e ? 0 : ch > 255 ? 2 : 1);
    }, 0);
}

function wtfPad(text, maxSpaces) {
  return (
    text + spaceHolderChar.repeat(Math.max(maxSpaces - wtfLength(text), 0))
  );
}

export { wtfLength, wtfPad, spaceHolderChar };
