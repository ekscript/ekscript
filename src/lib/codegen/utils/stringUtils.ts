/**
 * =============
 * Utils - I
 * =============
 * List of functions:
 * 1.
 *
 * */

import { genStruct } from '../constantFunctions';

export function genStringUtil() {
  return [
    genStruct('String', ['length', 'val'], ['int', 'const char *'], 'String'),
    `String initString(int len) {
  const char *val = (const char *)malloc(sizeof(char) * len);
  return (String){.len = len, .val = val};
}`,
    `void destroyString(const String str) { free((void *)str.val); }`,
  ].join('\n');
}

export function genStringConcatUtil(
  litType:
    | 'int'
    | 'float'
    | 'char'
    | 'string'
    | 'identifier'
    | 'char *'
    | string
) {
  litType = litType == 'string' ? 'char *' : litType;
  return [
    `const char *concat_string_lit_${litType}(const char *str, const size_t strLen, const ${litType} i) {
  char *newStr = (char *)malloc(sizeof(char) * (strLen + 51));
  snprintf(newStr, (strLen + 51), "%s%d", str, i);
  printf("%ld\\n", strlen(newStr));
  return newStr;
}`,
  ].join('\n');
}
