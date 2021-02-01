# ekscript

# Grammar

```
program         -> exportExpr? declaration* EOF ";"? ;
declaration     -> funDecl | varDecl | statement | classDecl | interfaceDecl | enumDecl | typeDecl;
classDecl       -> "abstract" | "class" IDENTIFIER ("extends" IDENTIFIER)? ("implements" IDENTIFIER*) "{" classMember* "}" ;
classMember     -> classModifiers? (arrowFunc | function | var)
interfaceDecl   -> "interface" IDENTIFIER "{"
funDecl         -> ("function" functionBody) | arrowFunc ;
function        -> IDENTIFIER (":" type )?  functionBody;
callbackFunc    -> "function" functionBody
functionBody    -> "(" parameters? ")" expression? semicolon ;
arrowFuncDecl   -> "const" arrowFunc;
arrowFunc       -> IDENTIFIER (":" type)? "=";
arrowFuncBody   -> ( IDENTIFIER | ((" parameters? ")") ) "=>" (expression | block) 
typeDecl        -> "type" IDENTIFIER "=" type ;
parameters      -> IDENTIFIER (":" type)? ("," IDENTIFIER (":" type)?)*;
statement       -> exprStmt | ifStmt | forStmt | printStmt | whileStmt | block | returnStmt | importStmt;
returnStmt      -> "return" expression? ";" ;
ifStmt          -> "if" "(" expression ")" statement ("else" statement)? ;
forStmt         -> "for" "(" (forOfStmt | forClassic | forInStmt) ")" statement ;
forOfStmt       -> (const | let) IDENTIFIER "of" IDENTIFIER ;
forOfStmt       -> (const | let) IDENTIFIER "in" IDENTIFIER ;
forClassic      -> (varDecl | exprStmt | ";") expression? ";" expression? ;
whileStmt       -> "while" "(" expression ")" statement ;
printStmt       -> "print" expression ";"
block           -> "{" declaration "}"
varDecl         -> "var" IDENTIFIER (":" type )? ("=" expression)? ";"
exprStmt        -> expression ";" ;
expression      -> assignment ;
assignment      -> (call ".")? IDENTIFIER "=" assignment | comma ;
comma           -> ternary "," ternary ;
ternary         -> logic_or ("?" ternary ":" ternary)? ;
logic_or        -> logic_and ( "||" logic_and )* ;
logic_and       -> equality ("&&" equality)* ;
equality        -> comparison (("!=" | "==") comparison)* ;
comparison      -> addition ((">" | ">=" | "<" | "<=") addition )* ;
addition        -> multiplication (("-" | "+" ) multiplication)* ;
unary           -> ("!" | "-") unary | primary ;
call            -> (async)? primary ("(" arguments? ")" | "." IDENTIFIER)* ;
arguments       -> expression ("," expression)* ;
primary         -> LIT_INT | LIT_FLOAT | IDENTIFIER | "false" | "true" | "nil" | "(" expression ")" | "super" "." IDENTIFIER | IDENTIFIER "as" type ;
type            -> IDENTIFIER | "{" typeObjectField* "}"  | type "[]" | typeTuple ; 
typeObjectField -> (IDENTIFIER | ("[" "key" ":" "string" "]") ) ":" type "," ;
typeTuple       -> "[" (type ","?) "," "]" ;
```

```ebnf
```

