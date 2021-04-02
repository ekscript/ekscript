"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.newToken = exports.ExprKind = exports.StatementKind = exports.EkTokenType = void 0;
var EkTokenType;
(function (EkTokenType) {
    // --------- keywords ---------
    EkTokenType[EkTokenType["IMPORT"] = 0] = "IMPORT";
    EkTokenType[EkTokenType["FROM"] = 1] = "FROM";
    EkTokenType[EkTokenType["EXPORT"] = 2] = "EXPORT";
    EkTokenType[EkTokenType["DEFAULT"] = 3] = "DEFAULT";
    EkTokenType[EkTokenType["LET"] = 4] = "LET";
    EkTokenType[EkTokenType["CONST"] = 5] = "CONST";
    EkTokenType[EkTokenType["FUNCTION"] = 6] = "FUNCTION";
    EkTokenType[EkTokenType["RETURN"] = 7] = "RETURN";
    EkTokenType[EkTokenType["WHILE"] = 8] = "WHILE";
    EkTokenType[EkTokenType["BREAK"] = 9] = "BREAK";
    EkTokenType[EkTokenType["CONTINUE"] = 10] = "CONTINUE";
    EkTokenType[EkTokenType["FOR"] = 11] = "FOR";
    EkTokenType[EkTokenType["IF"] = 12] = "IF";
    EkTokenType[EkTokenType["ELSE"] = 13] = "ELSE";
    EkTokenType[EkTokenType["SWITCH"] = 14] = "SWITCH";
    EkTokenType[EkTokenType["CASE"] = 15] = "CASE";
    EkTokenType[EkTokenType["DECLARE"] = 16] = "DECLARE";
    EkTokenType[EkTokenType["IDENTIFIER"] = 17] = "IDENTIFIER";
    // -------- typing ----------
    EkTokenType[EkTokenType["TYPE"] = 18] = "TYPE";
    EkTokenType[EkTokenType["TYPEOF"] = 19] = "TYPEOF";
    EkTokenType[EkTokenType["AS"] = 20] = "AS";
    EkTokenType[EkTokenType["READONLY"] = 21] = "READONLY";
    EkTokenType[EkTokenType["ENUM"] = 22] = "ENUM";
    EkTokenType[EkTokenType["INTERFACE"] = 23] = "INTERFACE";
    EkTokenType[EkTokenType["CLASS"] = 24] = "CLASS";
    EkTokenType[EkTokenType["CONSTRUCTOR"] = 25] = "CONSTRUCTOR";
    EkTokenType[EkTokenType["IMPLEMENTS"] = 26] = "IMPLEMENTS";
    EkTokenType[EkTokenType["EXTENDS"] = 27] = "EXTENDS";
    EkTokenType[EkTokenType["PUBLIC"] = 28] = "PUBLIC";
    EkTokenType[EkTokenType["PRIVATE"] = 29] = "PRIVATE";
    EkTokenType[EkTokenType["PROTECTED"] = 30] = "PROTECTED";
    EkTokenType[EkTokenType["GET"] = 31] = "GET";
    EkTokenType[EkTokenType["SET"] = 32] = "SET";
    EkTokenType[EkTokenType["THIS"] = 33] = "THIS";
    EkTokenType[EkTokenType["NEW"] = 34] = "NEW";
    EkTokenType[EkTokenType["STATIC"] = 35] = "STATIC";
    EkTokenType[EkTokenType["ABSTRACT"] = 36] = "ABSTRACT";
    EkTokenType[EkTokenType["ASYNC"] = 37] = "ASYNC";
    EkTokenType[EkTokenType["AWAIT"] = 38] = "AWAIT";
    EkTokenType[EkTokenType["YIELD"] = 39] = "YIELD";
    EkTokenType[EkTokenType["THROW"] = 40] = "THROW";
    EkTokenType[EkTokenType["CATCH"] = 41] = "CATCH";
    // ------- primitive types - keywords --------
    EkTokenType[EkTokenType["TYPE_INT"] = 42] = "TYPE_INT";
    EkTokenType[EkTokenType["TYPE_CHAR"] = 43] = "TYPE_CHAR";
    EkTokenType[EkTokenType["TYPE_FLOAT"] = 44] = "TYPE_FLOAT";
    EkTokenType[EkTokenType["TYPE_BOOL"] = 45] = "TYPE_BOOL";
    EkTokenType[EkTokenType["TYPE_BIGINT"] = 46] = "TYPE_BIGINT";
    EkTokenType[EkTokenType["NULL"] = 47] = "NULL";
    EkTokenType[EkTokenType["TYPE_NUMBER"] = 48] = "TYPE_NUMBER";
    EkTokenType[EkTokenType["TYPE_STRING"] = 49] = "TYPE_STRING";
    EkTokenType[EkTokenType["VOID"] = 50] = "VOID";
    // Compound Types
    EkTokenType[EkTokenType["TYPE_ARRAY"] = 51] = "TYPE_ARRAY";
    EkTokenType[EkTokenType["TYPE_RECORD"] = 52] = "TYPE_RECORD";
    EkTokenType[EkTokenType["TYPE_PARTIAL"] = 53] = "TYPE_PARTIAL";
    // ------- SYMBOLS ---------
    EkTokenType[EkTokenType["RIGHT_PAREN"] = 54] = "RIGHT_PAREN";
    EkTokenType[EkTokenType["LEFT_PAREN"] = 55] = "LEFT_PAREN";
    EkTokenType[EkTokenType["RIGHT_CURLY"] = 56] = "RIGHT_CURLY";
    EkTokenType[EkTokenType["LEFT_CURLY"] = 57] = "LEFT_CURLY";
    EkTokenType[EkTokenType["RIGHT_SQUARE"] = 58] = "RIGHT_SQUARE";
    EkTokenType[EkTokenType["LEFT_SQUARE"] = 59] = "LEFT_SQUARE";
    EkTokenType[EkTokenType["COLON"] = 60] = "COLON";
    EkTokenType[EkTokenType["SEMICOLON"] = 61] = "SEMICOLON";
    EkTokenType[EkTokenType["DOT"] = 62] = "DOT";
    EkTokenType[EkTokenType["TRIPLE_DOT"] = 63] = "TRIPLE_DOT";
    EkTokenType[EkTokenType["COMMA"] = 64] = "COMMA";
    EkTokenType[EkTokenType["BANG"] = 65] = "BANG";
    EkTokenType[EkTokenType["BANG_EQUAL"] = 66] = "BANG_EQUAL";
    EkTokenType[EkTokenType["EQUAL"] = 67] = "EQUAL";
    EkTokenType[EkTokenType["EQUAL_EQUAL"] = 68] = "EQUAL_EQUAL";
    EkTokenType[EkTokenType["ARROW"] = 69] = "ARROW";
    EkTokenType[EkTokenType["GREATER"] = 70] = "GREATER";
    EkTokenType[EkTokenType["GREATER_GREATER"] = 71] = "GREATER_GREATER";
    EkTokenType[EkTokenType["GREATER_EQUAL"] = 72] = "GREATER_EQUAL";
    EkTokenType[EkTokenType["LESS"] = 73] = "LESS";
    EkTokenType[EkTokenType["LESS_LESS"] = 74] = "LESS_LESS";
    EkTokenType[EkTokenType["LESS_EQUAL"] = 75] = "LESS_EQUAL";
    EkTokenType[EkTokenType["STAR"] = 76] = "STAR";
    EkTokenType[EkTokenType["STAR_STAR"] = 77] = "STAR_STAR";
    EkTokenType[EkTokenType["STAR_EQUAL"] = 78] = "STAR_EQUAL";
    EkTokenType[EkTokenType["PLUS"] = 79] = "PLUS";
    EkTokenType[EkTokenType["INCREMENT"] = 80] = "INCREMENT";
    EkTokenType[EkTokenType["PLUS_EQUAL"] = 81] = "PLUS_EQUAL";
    EkTokenType[EkTokenType["MINUS"] = 82] = "MINUS";
    EkTokenType[EkTokenType["DECREMENT"] = 83] = "DECREMENT";
    EkTokenType[EkTokenType["MINUS_EQUAL"] = 84] = "MINUS_EQUAL";
    EkTokenType[EkTokenType["SLASH"] = 85] = "SLASH";
    EkTokenType[EkTokenType["SLASH_SLASH"] = 86] = "SLASH_SLASH";
    EkTokenType[EkTokenType["SLASH_EQUAL"] = 87] = "SLASH_EQUAL";
    EkTokenType[EkTokenType["QUESTION"] = 88] = "QUESTION";
    EkTokenType[EkTokenType["QUES_QUES"] = 89] = "QUES_QUES";
    EkTokenType[EkTokenType["QUES_DOT"] = 90] = "QUES_DOT";
    EkTokenType[EkTokenType["AND"] = 91] = "AND";
    EkTokenType[EkTokenType["AND_EQUAL"] = 92] = "AND_EQUAL";
    EkTokenType[EkTokenType["AND_AND"] = 93] = "AND_AND";
    EkTokenType[EkTokenType["OR"] = 94] = "OR";
    EkTokenType[EkTokenType["OR_EQUAL"] = 95] = "OR_EQUAL";
    EkTokenType[EkTokenType["OR_OR"] = 96] = "OR_OR";
    EkTokenType[EkTokenType["SINGLE_QUOTES"] = 97] = "SINGLE_QUOTES";
    EkTokenType[EkTokenType["DOUBLE_QUOTES"] = 98] = "DOUBLE_QUOTES";
    EkTokenType[EkTokenType["BACKTICK"] = 99] = "BACKTICK";
    EkTokenType[EkTokenType["DOLLAR"] = 100] = "DOLLAR";
    // --------- LITERALS -------
    EkTokenType[EkTokenType["LIT_INT"] = 101] = "LIT_INT";
    EkTokenType[EkTokenType["LIT_FLOAT"] = 102] = "LIT_FLOAT";
    EkTokenType[EkTokenType["LIT_CHAR"] = 103] = "LIT_CHAR";
    EkTokenType[EkTokenType["LIT_BOOL"] = 104] = "LIT_BOOL";
    EkTokenType[EkTokenType["LIT_BIGINT"] = 105] = "LIT_BIGINT";
    EkTokenType[EkTokenType["LIT_TRUE"] = 106] = "LIT_TRUE";
    EkTokenType[EkTokenType["LIT_FALSE"] = 107] = "LIT_FALSE";
    EkTokenType[EkTokenType["LIT_STRING"] = 108] = "LIT_STRING";
    EkTokenType[EkTokenType["EOF"] = 109] = "EOF";
    EkTokenType[EkTokenType["ERROR"] = 110] = "ERROR";
})(EkTokenType = exports.EkTokenType || (exports.EkTokenType = {}));
var StatementKind;
(function (StatementKind) {
    StatementKind[StatementKind["BLOCKSTMT"] = 0] = "BLOCKSTMT";
    StatementKind[StatementKind["EXPRSTMT"] = 1] = "EXPRSTMT";
    StatementKind[StatementKind["IFSTMT"] = 2] = "IFSTMT";
    StatementKind[StatementKind["WHILESTMT"] = 3] = "WHILESTMT";
    StatementKind[StatementKind["PRINTSTMT"] = 4] = "PRINTSTMT";
    StatementKind[StatementKind["VARSTMT"] = 5] = "VARSTMT";
    StatementKind[StatementKind["FUNCSTMT"] = 6] = "FUNCSTMT";
    StatementKind[StatementKind["RETURNSTMT"] = 7] = "RETURNSTMT";
})(StatementKind = exports.StatementKind || (exports.StatementKind = {}));
var ExprKind;
(function (ExprKind) {
    ExprKind[ExprKind["TERNARYEXPR"] = 0] = "TERNARYEXPR";
    ExprKind[ExprKind["BINARYEXPR"] = 1] = "BINARYEXPR";
    ExprKind[ExprKind["GROUPINGEXPR"] = 2] = "GROUPINGEXPR";
    ExprKind[ExprKind["NILEXPR"] = 3] = "NILEXPR";
    ExprKind[ExprKind["CALLEXPR"] = 4] = "CALLEXPR";
    ExprKind[ExprKind["LITERALEXPR"] = 5] = "LITERALEXPR";
    ExprKind[ExprKind["UNARYEXPR"] = 6] = "UNARYEXPR";
    ExprKind[ExprKind["ASSIGNEXPR"] = 7] = "ASSIGNEXPR";
    ExprKind[ExprKind["VAREXPR"] = 8] = "VAREXPR";
    ExprKind[ExprKind["LOGICALEXPR"] = 9] = "LOGICALEXPR";
})(ExprKind = exports.ExprKind || (exports.ExprKind = {}));
const newToken = ({ tokenType, lexeme, literal = null, line, posStart, }) => ({
    tokenType,
    lexeme,
    literal,
    line,
    posStart,
});
exports.newToken = newToken;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9rZW4uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvbGliL3BhcnNlci90b2tlbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFHQSxJQUFZLFdBMkhYO0FBM0hELFdBQVksV0FBVztJQUNyQiwrQkFBK0I7SUFDL0IsaURBQU0sQ0FBQTtJQUNOLDZDQUFJLENBQUE7SUFDSixpREFBTSxDQUFBO0lBQ04sbURBQU8sQ0FBQTtJQUNQLDJDQUFHLENBQUE7SUFDSCwrQ0FBSyxDQUFBO0lBQ0wscURBQVEsQ0FBQTtJQUNSLGlEQUFNLENBQUE7SUFDTiwrQ0FBSyxDQUFBO0lBQ0wsK0NBQUssQ0FBQTtJQUNMLHNEQUFRLENBQUE7SUFDUiw0Q0FBRyxDQUFBO0lBQ0gsMENBQUUsQ0FBQTtJQUNGLDhDQUFJLENBQUE7SUFDSixrREFBTSxDQUFBO0lBQ04sOENBQUksQ0FBQTtJQUNKLG9EQUFPLENBQUE7SUFFUCwwREFBVSxDQUFBO0lBRVYsNkJBQTZCO0lBQzdCLDhDQUFJLENBQUE7SUFDSixrREFBTSxDQUFBO0lBQ04sMENBQUUsQ0FBQTtJQUNGLHNEQUFRLENBQUE7SUFDUiw4Q0FBSSxDQUFBO0lBQ0osd0RBQVMsQ0FBQTtJQUNULGdEQUFLLENBQUE7SUFDTCw0REFBVyxDQUFBO0lBQ1gsMERBQVUsQ0FBQTtJQUNWLG9EQUFPLENBQUE7SUFDUCxrREFBTSxDQUFBO0lBQ04sb0RBQU8sQ0FBQTtJQUNQLHdEQUFTLENBQUE7SUFDVCw0Q0FBRyxDQUFBO0lBQ0gsNENBQUcsQ0FBQTtJQUNILDhDQUFJLENBQUE7SUFDSiw0Q0FBRyxDQUFBO0lBQ0gsa0RBQU0sQ0FBQTtJQUNOLHNEQUFRLENBQUE7SUFDUixnREFBSyxDQUFBO0lBQ0wsZ0RBQUssQ0FBQTtJQUNMLGdEQUFLLENBQUE7SUFDTCxnREFBSyxDQUFBO0lBQ0wsZ0RBQUssQ0FBQTtJQUVMLDhDQUE4QztJQUM5QyxzREFBUSxDQUFBO0lBQ1Isd0RBQVMsQ0FBQTtJ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