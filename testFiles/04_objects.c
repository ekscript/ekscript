#include<ekstr.h>
#include<stdlib.h>
typedef struct _anon_array0 anon_array0;
typedef struct _anon_object1 anon_object1;
typedef struct _anon_object2 anon_object2;
typedef struct _anon_array6 anon_array6;







int main(int argc, char **argv) {
  anon_object2* temp0 = init_anon_object2 () ;
  anon_object1* temp1 = init_anon_object1 () ;
  const string temp2 = init_string ( "There", 5 ) ;
  temp1->yo = temp2 ;
  anon_array0 temp3 = init_anon_array0 ( 1 ) ;
  temp3.value[0] = 1 ;
  temp1->hi = temp3 ;
  temp0->hello = temp1 ;
  anon_object2* a = temp0 ;
  anon_object2* b = a ;
  anon_array6 temp4 = init_anon_array6 ( 2 ) ;
  temp4.value[0] = b ;
  anon_object2* temp5 = init_anon_object2 () ;
  anon_object1* temp6 = init_anon_object1 () ;
  const string temp7 = init_string ( "Himu", 4 ) ;
  temp6->yo = temp7 ;
  anon_array0 temp8 = init_anon_array0 ( 3 ) ;
  temp8.value[0] = 11 ;
  temp8.value[1] = 22 ;
  temp8.value[2] = 34 ;
  temp6->hi = temp8 ;
  temp5->hello = temp6 ;
  temp4.value[1] = temp5 ;
  anon_array6 c = temp4 ;
  destroy_string ( temp2 ) ;
  destroy_string ( temp7 ) ;
  return 0;
}
