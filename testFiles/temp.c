#include<stdlib.h>
#include<ekarray.h>
#include<ekstr.h>
typedef struct _anon_array1 anon_array1;
typedef struct _anon_array2 anon_array2;
typedef struct _anon_array3 anon_array3;
typedef struct _anon_array6 anon_array6;
typedef struct _anon_array7 anon_array7;
struct _anon_array1 {
  size_t length;
  size_t capacity;
  int* value;
};
anon_array1 init_anon_array1(size_t length) {
  size_t capacity = length;
  if (length < 2) capacity = 2;
  int* value = (int*)malloc(sizeof(int) * capacity);
  return (anon_array1){length, capacity, value};
}
void push_anon_array1(anon_array1* arr, int value) {
  if (arr->length == arr->capacity) {
    arr->capacity *= 2;
    arr->value = (int*)realloc(arr->value, arr->capacity * sizeof(int));
  }
  arr->value[arr->length++] = value;
}
int get_anon_array1(anon_array1* arr, size_t i) {
  if (i >= arr->length) {
  // ERROR
  }
  return arr->value[i];
}
void set_anon_array1(anon_array1* arr, size_t i, int value) {
  if (i >= arr->length) {
  // ERROR
  }
  arr->value[i] = value;
}
void destroy_anon_array1(anon_array1* arr) {
  free((void*)arr->value);
  arr->value = NULL;
  arr->capacity = arr->length = 0;
}
struct _anon_array2 {
  size_t length;
  size_t capacity;
  anon_array1* value;
};
anon_array2 init_anon_array2(size_t length) {
  size_t capacity = length;
  if (length < 2) capacity = 2;
  anon_array1* value = (anon_array1*)malloc(sizeof(anon_array1) * capacity);
  return (anon_array2){length, capacity, value};
}
void push_anon_array2(anon_array2* arr, anon_array1 value) {
  if (arr->length == arr->capacity) {
    arr->capacity *= 2;
    arr->value = (anon_array1*)realloc(arr->value, arr->capacity * sizeof(anon_array1));
  }
  arr->value[arr->length++] = value;
}
anon_array1 get_anon_array2(anon_array2* arr, size_t i) {
  if (i >= arr->length) {
  // ERROR
  }
  return arr->value[i];
}
void set_anon_array2(anon_array2* arr, size_t i, anon_array1 value) {
  if (i >= arr->length) {
  // ERROR
  }
  arr->value[i] = value;
}
void destroy_anon_array2(anon_array2* arr) {
  free((void*)arr->value);
  arr->value = NULL;
  arr->capacity = arr->length = 0;
}
struct _anon_array3 {
  size_t length;
  size_t capacity;
  anon_array2* value;
};
anon_array3 init_anon_array3(size_t length) {
  size_t capacity = length;
  if (length < 2) capacity = 2;
  anon_array2* value = (anon_array2*)malloc(sizeof(anon_array2) * capacity);
  return (anon_array3){length, capacity, value};
}
void push_anon_array3(anon_array3* arr, anon_array2 value) {
  if (arr->length == arr->capacity) {
    arr->capacity *= 2;
    arr->value = (anon_array2*)realloc(arr->value, arr->capacity * sizeof(anon_array2));
  }
  arr->value[arr->length++] = value;
}
anon_array2 get_anon_array3(anon_array3* arr, size_t i) {
  if (i >= arr->length) {
  // ERROR
  }
  return arr->value[i];
}
void set_anon_array3(anon_array3* arr, size_t i, anon_array2 value) {
  if (i >= arr->length) {
  // ERROR
  }
  arr->value[i] = value;
}
void destroy_anon_array3(anon_array3* arr) {
  free((void*)arr->value);
  arr->value = NULL;
  arr->capacity = arr->length = 0;
}
struct _anon_array6 {
  size_t length;
  size_t capacity;
  string* value;
};
anon_array6 init_anon_array6(size_t length) {
  size_t capacity = length;
  if (length < 2) capacity = 2;
  string* value = (string*)malloc(sizeof(string) * capacity);
  return (anon_array6){length, capacity, value};
}
void push_anon_array6(anon_array6* arr, string value) {
  if (arr->length == arr->capacity) {
    arr->capacity *= 2;
    arr->value = (string*)realloc(arr->value, arr->capacity * sizeof(string));
  }
  arr->value[arr->length++] = value;
}
string get_anon_array6(anon_array6* arr, size_t i) {
  if (i >= arr->length) {
  // ERROR
  }
  return arr->value[i];
}
void set_anon_array6(anon_array6* arr, size_t i, string value) {
  if (i >= arr->length) {
  // ERROR
  }
  arr->value[i] = value;
}
void destroy_anon_array6(anon_array6* arr) {
  free((void*)arr->value);
  arr->value = NULL;
  arr->capacity = arr->length = 0;
}
struct _anon_array7 {
  size_t length;
  size_t capacity;
  anon_array6* value;
};
anon_array7 init_anon_array7(size_t length) {
  size_t capacity = length;
  if (length < 2) capacity = 2;
  anon_array6* value = (anon_array6*)malloc(sizeof(anon_array6) * capacity);
  return (anon_array7){length, capacity, value};
}
void push_anon_array7(anon_array7* arr, anon_array6 value) {
  if (arr->length == arr->capacity) {
    arr->capacity *= 2;
    arr->value = (anon_array6*)realloc(arr->value, arr->capacity * sizeof(anon_array6));
  }
  arr->value[arr->length++] = value;
}
anon_array6 get_anon_array7(anon_array7* arr, size_t i) {
  if (i >= arr->length) {
  // ERROR
  }
  return arr->value[i];
}
void set_anon_array7(anon_array7* arr, size_t i, anon_array6 value) {
  if (i >= arr->length) {
  // ERROR
  }
  arr->value[i] = value;
}
void destroy_anon_array7(anon_array7* arr) {
  free((void*)arr->value);
  arr->value = NULL;
  arr->capacity = arr->length = 0;
}
int main(int argc, char **argv) {
  anon_array1 temp0 = init_anon_array1 ( 2 ) ;
  temp0.val[0] = 1 ;
  temp0.val[1] = 2 ;
  anon_array1 arr1 = temp0 ;
  anon_array2 temp1 = init_anon_array2 ( 2 ) ;
  anon_array1 temp2 = init_anon_array1 ( 1 ) ;
  temp2.val[0] = 1 ;
  temp1.val[0] = temp2 ;
  temp1.val[1] = arr1 ;
  anon_array2 arr = temp1 ;
  anon_array3 temp3 = init_anon_array3 ( 1 ) ;
  temp3.val[0] = arr ;
  anon_array3 arr3 = temp3 ;
  anon_array7 temp4 = init_anon_array7 ( 2 ) ;
  string temp5 = init_string ( "hello", 5 ) ;
  temp4.val[0] = temp5 ;
  string temp6 = init_string ( "yo", 2 ) ;
  temp4.val[1] = temp6 ;
  anon_array7 arr2 = temp4 ;
  anon_array5 temp7 = init_anon_array5 ( 1 ) ;
  temp7.val[0] = arr2 ;
  anon_array5 arr4 = temp7 ;
  destroy_string ( temp5 ) ;
  destroy_string ( temp6 ) ;
  return 0;
}