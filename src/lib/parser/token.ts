import { int } from '../../global.d';
import { Literal, Token } from '../../types/parser';

export enum EkTokenType {
  // --------- keywords ---------
  IMPORT, // import
  FROM, // from
  EXPORT, // export
  DEFAULT, // default
  LET, // let
  CONST, // const
  FUNCTION, // function
  RETURN, // return
  WHILE, // while
  BREAK, // break
  CONTINUE, // continue
  FOR, // for
  IF, // if
  ELSE, // else
  SWITCH, // switch
  CASE, // case
  DECLARE, // declare

  IDENTIFIER, // any identifier

  // -------- typing ----------
  TYPE, // type
  TYPEOF, // typeof
  AS, // as
  READONLY, // readonly
  ENUM, // enum
  INTERFACE, // interface
  CLASS, // class
  CONSTRUCTOR, // constructor
  IMPLEMENTS, // implements
  EXTENDS, // extends
  PUBLIC, // public
  PRIVATE, // private
  PROTECTED, // protected
  GET, // get
  SET, // set
  THIS, // this
  NEW, // new
  STATIC, // static
  ABSTRACT, // abstract
  ASYNC, // async
  AWAIT, // await
  YIELD, // yield
  THROW, // throw
  CATCH, // catch

  // ------- primitive types - keywords --------
  TYPE_INT, // int, i32
  TYPE_CHAR, // char
  TYPE_FLOAT, // float, f64
  TYPE_BOOL,
  TYPE_BIGINT, // bigint
  NULL, // null
  TYPE_NUMBER, // number
  TYPE_STRING, // string
  VOID, // void
  // Compound Types
  TYPE_ARRAY, // Array<>
  TYPE_RECORD, // Record<>
  TYPE_PARTIAL, // Partial<>

  // ------- SYMBOLS ---------
  RIGHT_PAREN, // )
  LEFT_PAREN, // (
  RIGHT_CURLY, // }
  LEFT_CURLY, // {
  RIGHT_SQUARE, // ]
  LEFT_SQUARE, // [
  COLON, // :
  SEMICOLON, // ;
  DOT, // .
  TRIPLE_DOT, // ...
  COMMA, // ,
  BANG, // !
  BANG_EQUAL, // !=
  EQUAL, // =
  EQUAL_EQUAL, // ==
  ARROW, // =>
  GREATER, // >
  GREATER_GREATER, // >>
  GREATER_EQUAL, // >=
  LESS, // <
  LESS_LESS, // <<
  LESS_EQUAL, // <=
  STAR, // *
  STAR_STAR, // **
  STAR_EQUAL, // *=
  PLUS, // +
  INCREMENT, // ++
  PLUS_EQUAL, // +=
  MINUS, // -
  DECREMENT, // --
  MINUS_EQUAL, // -=
  SLASH, // /
  SLASH_SLASH, // //
  SLASH_EQUAL, // /=
  QUESTION, // ?
  QUES_QUES, // ??
  QUES_DOT, // ?.
  AND, // &
  AND_EQUAL, // &=
  AND_AND, // &&
  OR, // |
  OR_EQUAL, // |=
  OR_OR, // ||
  SINGLE_QUOTES, // '
  DOUBLE_QUOTES, // "
  BACKTICK, // `
  DOLLAR, // $

  // --------- LITERALS -------
  LIT_INT, // 1, 0, -1
  LIT_FLOAT, // -1.0, -0.11e-11
  LIT_CHAR, // 'a', 'b', '1'
  LIT_BOOL, // true, false
  LIT_BIGINT, // 100n
  LIT_TRUE, // true
  LIT_FALSE, // false
  LIT_STRING, // "This is a string"
  EOF,
  ERROR,
}

export enum StatementKind {
  BLOCKSTMT,
  EXPRSTMT,
  IFSTMT,
  WHILESTMT,
  PRINTSTMT,
  VARSTMT,
  FUNCSTMT,
  RETURNSTMT,
}

export enum ExprKind {
  TERNARYEXPR,
  BINARYEXPR,
  GROUPINGEXPR,
  NILEXPR,
  CALLEXPR,
  LITERALEXPR,
  UNARYEXPR,
  ASSIGNEXPR,
  VAREXPR,
  LOGICALEXPR,
}

export const newToken = ({
  tokenType,
  lexeme,
  literal = null,
  line,
  posStart,
}: {
  tokenType: EkTokenType;
  lexeme: string;
  literal: Literal;
  line: int;
  posStart: int;
}): Token => ({
  tokenType,
  lexeme,
  literal,
  line,
  posStart,
});
