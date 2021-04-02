#include<stdlib.h>
#include<ekstr.h>
typedef struct _anon_array1 anon_array1;
typedef struct _anon_array2 anon_array2;
typedef struct _anon_array3 anon_array3;
typedef struct _anon_array4 anon_array4;
typedef struct _anon_array5 anon_array5;





int main(int argc, char **argv) {
  anon_array1 temp0 = init_anon_array1 ( 2 ) ;
  temp0.value[0] = 1 ;
  temp0.value[1] = 2 ;
  anon_array1 arr1 = temp0 ;
  anon_array2 temp1 = init_anon_array2 ( 2 ) ;
  anon_array1 temp2 = init_anon_array1 ( 1 ) ;
  temp2.value[0] = 1 ;
  temp1.value[0] = temp2 ;
  temp1.value[1] = arr1 ;
  anon_array2 arr = temp1 ;
  anon_array3 temp3 = init_anon_array3 ( 1 ) ;
  temp3.value[0] = arr ;
  anon_array3 arr3 = temp3 ;
  anon_array4 temp4 = init_anon_array4 ( 2 ) ;
  const string temp5 = init_string ( "hello", 5 ) ;
  temp4.value[0] = temp5 ;
  const string temp6 = init_string ( "yo", 2 ) ;
  temp4.value[1] = temp6 ;
  anon_array4 arr2 = temp4 ;
  anon_array5 temp7 = init_anon_array5 ( 1 ) ;
  temp7.value[0] = arr2 ;
  anon_array5 arr4 = temp7 ;
  destroy_string ( temp5 ) ;
  destroy_string ( temp6 ) ;
  return 0;
}
