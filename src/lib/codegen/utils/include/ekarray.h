#include <stdlib.h>
typedef struct {
  size_t length;
  size_t capacity;
  int *value;
} int_array;
int_array init_int_array(size_t length) {
  size_t capacity = length;
  if (length < 2)
    capacity = 2;
  int *value = (int *)malloc(sizeof(int) * capacity);
  return (int_array){length, capacity, value};
}
void push_int_array(int_array *arr, int value) {
  if (arr->length == arr->capacity) {
    arr->capacity *= 2;
    arr->value = (int *)realloc(arr->value, arr->capacity * sizeof(int));
  }
  arr->value[arr->length++] = value;
}
int get_int_array(int_array *arr, size_t i) {
  if (i >= arr->length) {
    // ERROR
  }
  return arr->value[i];
}
void set_int_array(int_array *arr, size_t i, int value) {
  if (i >= arr->length) {
    // ERROR
  }
  arr->value[i] = value;
}
void destroy_int_array(int_array *arr) {
  free((void *)arr->value);
  arr->value = NULL;
  arr->capacity = arr->length = 0;
}
