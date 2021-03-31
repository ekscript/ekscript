#include<stdbool.h>
#include<ekstr.h>

int main(int argc, char **argv) {
  1 + ( 1 + 1 * ( 7 * 7 ) << 1 ) ;
  int a = 1 ;
  1 + 1 ;
  a + 1 ;
  int yo = 1 ;
  true ;
  false ;
  const string temp0 = init_string ( "hello world", 11 ) ;
  temp0 ;
  'a' ;
  ' ' ;
  const string temp1 = init_string( "hello1", 6 ) ;
  temp1 ;
  const string temp2 = init_string( "yot", 3 ) ;
  temp2 ;
  const string temp3 = init_string( "there", 5 ) ;
  concat_string_int( temp3, a) ;
  const string temp4 = init_string( "yoyo", 4 ) ;
  temp4 ;
  const string temp5 = init_string( "paren", 5 ) ;
  concat_string_int( temp5, (a)) ;
  const string temp6 = init_string( "parentrue", 9 ) ;
  temp6 ;
  int b = 1 + 1 ;
  const string temp7 = init_string( "hello1", 6 ) ;
  string c = temp7 ;
  const string temp8 = init_string( "hello", 5 ) ;
  string d = concat_string_int( temp8, a) ;
  if ( b == 2 ) {
    a = 2 ;
  } else {
    const string temp9 = init_string ( "yo", 2 ) ;
    if ( compare_string_char ( c , temp9 , 2 ) ) {
      b = 10 ;
    } else {
      const string temp10 = init_string ( "yo", 2 ) ;
      if ( compare_string_char ( d , temp10 , 2 ) ) {
        d = init_string ( "yo", 2 ) ;
      } else {
        a = 2 ;
      }
      destroy_string ( temp10 ) ;
    }
    destroy_string ( temp9 ) ;
  }
  destroy_string ( temp0 ) ;
  destroy_string ( temp1 ) ;
  destroy_string ( temp2 ) ;
  destroy_string ( temp3 ) ;
  destroy_string ( temp4 ) ;
  destroy_string ( temp5 ) ;
  destroy_string ( temp6 ) ;
  destroy_string ( temp7 ) ;
  destroy_string ( d ) ;
  destroy_string ( temp8 ) ;
  return 0;
}
