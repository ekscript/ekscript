#include<stdbool.h>
#include<ekstr.h>

int main(int argc, char **argv) {
  int a = 10 ;
  {
    int i = 0 ;
    bool b = true ;
    for ( ; i < 10 ; i = i + 1 ) {
      i = i + 1 ;
      a = a + 2 ;
    }
  }
  while ( a < 4 ) {
    a = a - 1 ;
  }
  int i = 0 ;
  {
    int i = 0 ;
    const string temp0 = init_string ( "hello", 5 ) ;
    string j = temp0 ;
    for ( ; i < 10 , a < 20 ; i = i + 1 ) {
    }
    destroy_string ( temp0 ) ;
  }
  switch ( a ) {
    case 1 : break ;
    case 2 : break ;
    case 3 :
    case 4 : {
      a = a + 1 ;
      {
        for ( ; i < 10 ; i = i + 1 ) {
          i = i + 2 ;
        }
      }
      break ;
    }
    default : ;
  }
  return 0;
}
