#ifndef EKSTR_H
#define EKSTR_H
#include <stdint.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
typedef struct {
  const char *buf;
  size_t length;
} string;
const string init_string_str(const char *buf, size_t length) {
  char *s = (char *)malloc(sizeof(char) * (length + 1));
  strncpy(s, buf, length + 1);
  s[length] = '\0';
  return (const string){.buf = s, .length = length};
}
const string init_string_string(const string str) {
  char *s = (char *)malloc((str.length + 1) * sizeof(char));
  strncpy(s, str.buf, str.length + 1);
  return (const string){.length = str.length, .buf = s};
}
const string init_string_char(char c) {
  char *s = (char *)malloc(2);
  s[0] = c;
  s[1] = '\0';
  return (const string){.length = 2, .buf = s};
}
const string init_string_int(long i) {
  char *s = (char *)malloc(30);
  snprintf(s, 30, "%ld", i);
  return (const string){.length = 30, .buf = s};
}
void string_print(const string s) { printf("%s\n", s.buf); }
const string concat_string_string(const string s1, const string s2) {
  const size_t length = s1.length + s2.length + 1;
  char *s = (char *)malloc(length);
  strncpy(s, s1.buf, s1.length);
  strncpy(s + s1.length, s2.buf, s2.length);
  s[length] = 0;
  return (const string){.length = length - 1, .buf = s};
}
const string concat_string_char(const string s1, const char c) {
  const size_t length = s1.length + 2;
  char *s = (char *)malloc(length);
  strncpy(s, s1.buf, s1.length);
  s[length - 2] = c;
  s[length - 1] = 0;
  return (const string){.length = length - 1, .buf = s};
}
const string concat_string_int(const string s1, const int i) {
  const size_t length = s1.length + 30;
  char *s = (char *)malloc(length);
  snprintf(s, length, "%s%d", s1.buf, i);
  return (const string){.length = strlen(s), .buf = s};
}
const string concat_string_float(const string s1, const float f) {
  const size_t length = s1.length + 30;
  char *s = (char *)malloc(length);
  snprintf(s, length, "%s%f", s1.buf, f);
  return (const string){.length = strlen(s), .buf = s};
}
const string concat_string_bool(const string s1, const bool b) {
  const size_t length = s1.length + (b ? 5 : 6);
  char *s = (char *)malloc(length);
  snprintf(s, length, "%s%s", s1.buf, b ? "true" : "false");
  return (const string){.length = length - 1, .buf = s};
}
const int parse_int(const string s1) { return atoi(s1.buf); }
const char *get_string_cstring(const string s) { return s.buf; }
void destroy_string(const string s) { free((void *)s.buf); }
#endif
