// import { DICT1 } from "../src/api/dict1-pinyin";
// https://github.com/zh-lx/pinyin-pro/blob/main/lib/data/dict1-pinyin.ts

// Thanks gpt
// const tones = new Map(Object.entries({
//     "ā": "a",
//     "á": "a",
//     "ǎ": "a",
//     "à": "a",
//     "ē": "e",
//     "é": "e",
//     "ě": "e",
//     "è": "e",
//     "ī": "i",
//     "í": "i",
//     "ǐ": "i",
//     "ì": "i",
//     "ō": "o",
//     "ó": "o",
//     "ǒ": "o",
//     "ò": "o",
//     "ū": "u",
//     "ú": "u",
//     "ǔ": "u",
//     "ù": "u",
//     "ü": "v",
//     "ǖ": "v",
//     "ǘ": "v",
//     "ǚ": "v",
//     "ǜ": "v",
// }));

// let res = "// Generated. Do not modify.\n\nexport const PinYins: Map<string, string[]> = new Map(Object.entries({\n";
// for (let [ch, py] of Object.entries(DICT1)) {
//     const alts = Array.from(new Set(Array
//         .from(py).map(l => tones.get(l) ?? l)
//         .join('').split(' ')));
//     res += `  ${ch}: ${JSON.stringify(alts)},\n`
// }
// res += "}));"


// {/* <Space h="md" /> */}
// {/* <textarea>{res}</textarea> */}
