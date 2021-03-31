#include <stdio.h>

int main(int argc, char **argv) {
  printf("%d\n", 1 + (1 + (int)(1.2 * (1 * 7 / 8)) << 1));
  return 0;
}
