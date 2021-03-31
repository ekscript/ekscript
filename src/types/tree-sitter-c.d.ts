declare module 'tree-sitter-c' {
  export interface Parser {
    parse(
      input: string | Input,
      previousTree?: Tree,
      options?: { bufferSize?: number; includedRanges?: Range[] }
    ): Tree;
    getLanguage(): any;
    setLanguage(language: any): void;
    getLogger(): Logger;
    setLogger(logFunc: Logger): void;
  }

  export type Point = {
    row: number;
    column: number;
  };

  export type Range = {
    startIndex: number;
    endIndex: number;
    startPosition: Point;
    endPosition: Point;
  };

  export type Edit = {
    startIndex: number;
    oldEndIndex: number;
    newEndIndex: number;
    startPosition: Point;
    oldEndPosition: Point;
    newEndPosition: Point;
  };

  export type Logger = (
    message: string,
    params: { [param: string]: string },
    type: 'parse' | 'lex'
  ) => void;

  export interface Input {
    seek(index: number): void;
    read(): any;
  }

  interface SyntaxNodeBase {
    tree: Tree;
    type: string;
    isNamed: boolean;
    text: string;
    startPosition: Point;
    endPosition: Point;
    startIndex: number;
    endIndex: number;
    parent: SyntaxNode | null;
    children: Array<SyntaxNode>;
    namedChildren: Array<SyntaxNode>;
    childCount: number;
    namedChildCount: number;
    firstChild: SyntaxNode | null;
    firstNamedChild: SyntaxNode | null;
    lastChild: SyntaxNode | null;
    lastNamedChild: SyntaxNode | null;
    nextSibling: SyntaxNode | null;
    nextNamedSibling: SyntaxNode | null;
    previousSibling: SyntaxNode | null;
    previousNamedSibling: SyntaxNode | null;

    hasChanges(): boolean;
    hasError(): boolean;
    isMissing(): boolean;
    toString(): string;
    child(index: number): SyntaxNode | null;
    namedChild(index: number): SyntaxNode | null;
    firstChildForIndex(index: number): SyntaxNode | null;
    firstNamedChildForIndex(index: number): SyntaxNode | null;

    descendantForIndex(index: number): SyntaxNode;
    descendantForIndex(startIndex: number, endIndex: number): SyntaxNode;
    namedDescendantForIndex(index: number): SyntaxNode;
    namedDescendantForIndex(startIndex: number, endIndex: number): SyntaxNode;
    descendantForPosition(position: Point): SyntaxNode;
    descendantForPosition(startPosition: Point, endPosition: Point): SyntaxNode;
    namedDescendantForPosition(position: Point): SyntaxNode;
    namedDescendantForPosition(
      startPosition: Point,
      endPosition: Point
    ): SyntaxNode;
    descendantsOfType<T extends TypeString>(
      types: T | readonly T[],
      startPosition?: Point,
      endPosition?: Point
    ): NodeOfType<T>[];

    closest<T extends SyntaxType>(types: T | readonly T[]): NamedNode<T> | null;
    walk(): TreeCursor;
  }

  export interface TreeCursor {
    nodeType: string;
    nodeText: string;
    nodeIsNamed: boolean;
    startPosition: Point;
    endPosition: Point;
    startIndex: number;
    endIndex: number;
    readonly currentNode: SyntaxNode;

    reset(node: SyntaxNode): void;
    gotoParent(): boolean;
    gotoFirstChild(): boolean;
    gotoFirstChildForIndex(index: number): boolean;
    gotoNextSibling(): boolean;
  }

  export interface Tree {
    readonly rootNode: SyntaxNode;

    edit(delta: Edit): Tree;
    walk(): TreeCursor;
    getChangedRanges(other: Tree): Range[];
    getEditedRange(other: Tree): Range;
  }

  interface NamedNodeBase extends SyntaxNodeBase {
    isNamed: true;
  }

  /** An unnamed node with the given type string. */
  export interface UnnamedNode<T extends string = string>
    extends SyntaxNodeBase {
    type: T;
    isNamed: false;
  }

  type PickNamedType<Node, T extends string> = Node extends {
    type: T;
    isNamed: true;
  }
    ? Node
    : never;

  type PickType<Node, T extends string> = Node extends { type: T }
    ? Node
    : never;

  /** A named node with the given `type` string. */
  export type NamedNode<T extends SyntaxType = SyntaxType> = PickNamedType<
    SyntaxNode,
    T
  >;

  /**
   * A node with the given `type` string.
   *
   * Note that this matches both named and unnamed nodes. Use `NamedNode<T>` to pick only named nodes.
   */
  export type NodeOfType<T extends string> = PickType<SyntaxNode, T>;

  interface TreeCursorOfType<S extends string, T extends SyntaxNodeBase> {
    nodeType: S;
    currentNode: T;
  }

  type TreeCursorRecord = {
    [K in TypeString]: TreeCursorOfType<K, NodeOfType<K>>;
  };

  /**
   * A tree cursor whose `nodeType` correlates with `currentNode`.
   *
   * The typing becomes invalid once the underlying cursor is mutated.
   *
   * The intention is to cast a `TreeCursor` to `TypedTreeCursor` before
   * switching on `nodeType`.
   *
   * For example:
   * ```ts
   * let cursor = root.walk();
   * while (cursor.gotoNextSibling()) {
   *   const c = cursor as TypedTreeCursor;
   *   switch (c.nodeType) {
   *     case SyntaxType.Foo: {
   *       let node = c.currentNode; // Typed as FooNode.
   *       break;
   *     }
   *   }
   * }
   * ```
   */
  export type TypedTreeCursor = TreeCursorRecord[keyof TreeCursorRecord];

  export interface ErrorNode extends NamedNodeBase {
    type: SyntaxType.ERROR;
    hasError(): true;
  }

  export const enum SyntaxType {
    ERROR = 'ERROR',
    AbstractArrayDeclarator = 'abstract_array_declarator',
    AbstractFunctionDeclarator = 'abstract_function_declarator',
    AbstractParenthesizedDeclarator = 'abstract_parenthesized_declarator',
    AbstractPointerDeclarator = 'abstract_pointer_declarator',
    ArgumentList = 'argument_list',
    ArrayDeclarator = 'array_declarator',
    AssignmentExpression = 'assignment_expression',
    AttributeSpecifier = 'attribute_specifier',
    BinaryExpression = 'binary_expression',
    BitfieldClause = 'bitfield_clause',
    BreakStatement = 'break_statement',
    CallExpression = 'call_expression',
    CaseStatement = 'case_statement',
    CastExpression = 'cast_expression',
    CharLiteral = 'char_literal',
    CommaExpression = 'comma_expression',
    CompoundLiteralExpression = 'compound_literal_expression',
    CompoundStatement = 'compound_statement',
    ConcatenatedString = 'concatenated_string',
    ConditionalExpression = 'conditional_expression',
    ContinueStatement = 'continue_statement',
    Declaration = 'declaration',
    DeclarationList = 'declaration_list',
    DoStatement = 'do_statement',
    EnumSpecifier = 'enum_specifier',
    Enumerator = 'enumerator',
    EnumeratorList = 'enumerator_list',
    ExpressionStatement = 'expression_statement',
    FieldDeclaration = 'field_declaration',
    FieldDeclarationList = 'field_declaration_list',
    FieldDesignator = 'field_designator',
    FieldExpression = 'field_expression',
    ForStatement = 'for_statement',
    FunctionDeclarator = 'function_declarator',
    FunctionDefinition = 'function_definition',
    GotoStatement = 'goto_statement',
    IfStatement = 'if_statement',
    InitDeclarator = 'init_declarator',
    InitializerList = 'initializer_list',
    InitializerPair = 'initializer_pair',
    LabeledStatement = 'labeled_statement',
    LinkageSpecification = 'linkage_specification',
    MacroTypeSpecifier = 'macro_type_specifier',
    MsBasedModifier = 'ms_based_modifier',
    MsCallModifier = 'ms_call_modifier',
    MsDeclspecModifier = 'ms_declspec_modifier',
    MsPointerModifier = 'ms_pointer_modifier',
    MsUnalignedPtrModifier = 'ms_unaligned_ptr_modifier',
    ParameterDeclaration = 'parameter_declaration',
    ParameterList = 'parameter_list',
    ParenthesizedDeclarator = 'parenthesized_declarator',
    ParenthesizedExpression = 'parenthesized_expression',
    PointerDeclarator = 'pointer_declarator',
    PointerExpression = 'pointer_expression',
    PreprocCall = 'preproc_call',
    PreprocDef = 'preproc_def',
    PreprocDefined = 'preproc_defined',
    PreprocElif = 'preproc_elif',
    PreprocElse = 'preproc_else',
    PreprocFunctionDef = 'preproc_function_def',
    PreprocIf = 'preproc_if',
    PreprocIfdef = 'preproc_ifdef',
    PreprocInclude = 'preproc_include',
    PreprocParams = 'preproc_params',
    ReturnStatement = 'return_statement',
    SizedTypeSpecifier = 'sized_type_specifier',
    SizeofExpression = 'sizeof_expression',
    StorageClassSpecifier = 'storage_class_specifier',
    StringLiteral = 'string_literal',
    StructSpecifier = 'struct_specifier',
    SubscriptDesignator = 'subscript_designator',
    SubscriptExpression = 'subscript_expression',
    SwitchStatement = 'switch_statement',
    TranslationUnit = 'translation_unit',
    TypeDefinition = 'type_definition',
    TypeDescriptor = 'type_descriptor',
    TypeQualifier = 'type_qualifier',
    UnaryExpression = 'unary_expression',
    UnionSpecifier = 'union_specifier',
    UpdateExpression = 'update_expression',
    WhileStatement = 'while_statement',
    Comment = 'comment',
    EscapeSequence = 'escape_sequence',
    False = 'false',
    FieldIdentifier = 'field_identifier',
    Identifier = 'identifier',
    MsRestrictModifier = 'ms_restrict_modifier',
    MsSignedPtrModifier = 'ms_signed_ptr_modifier',
    MsUnsignedPtrModifier = 'ms_unsigned_ptr_modifier',
    Null = 'null',
    NumberLiteral = 'number_literal',
    PreprocArg = 'preproc_arg',
    PreprocDirective = 'preproc_directive',
    PrimitiveType = 'primitive_type',
    StatementIdentifier = 'statement_identifier',
    SystemLibString = 'system_lib_string',
    True = 'true',
    TypeIdentifier = 'type_identifier',
  }

  export type UnnamedType =
    | '\n'
    | '!'
    | '!='
    | '"'
    | '#define'
    | '#elif'
    | '#else'
    | '#endif'
    | '#if'
    | '#ifdef'
    | '#ifndef'
    | '#include'
    | '%'
    | '%='
    | '&'
    | '&&'
    | '&='
    | "'"
    | '('
    | ')'
    | '*'
    | '*='
    | '+'
    | '++'
    | '+='
    | ','
    | '-'
    | '--'
    | '-='
    | '->'
    | '.'
    | '...'
    | '/'
    | '/='
    | ':'
    | ';'
    | '<'
    | '<<'
    | '<<='
    | '<='
    | '='
    | '=='
    | '>'
    | '>='
    | '>>'
    | '>>='
    | '?'
    | 'L"'
    | "L'"
    | 'U"'
    | "U'"
    | '['
    | ']'
    | '^'
    | '^='
    | '_Atomic'
    | '__attribute__'
    | '__based'
    | '__cdecl'
    | '__clrcall'
    | '__declspec'
    | '__fastcall'
    | '__stdcall'
    | '__thiscall'
    | '__unaligned'
    | '__vectorcall'
    | '_unaligned'
    | 'auto'
    | 'break'
    | 'case'
    | 'const'
    | 'continue'
    | 'default'
    | 'defined'
    | 'do'
    | 'else'
    | 'enum'
    | 'extern'
    | 'for'
    | 'goto'
    | 'if'
    | 'inline'
    | 'long'
    | 'register'
    | 'restrict'
    | 'return'
    | 'short'
    | 'signed'
    | 'sizeof'
    | 'static'
    | 'struct'
    | 'switch'
    | 'typedef'
    | 'u"'
    | "u'"
    | 'u8"'
    | "u8'"
    | 'union'
    | 'unsigned'
    | 'volatile'
    | 'while'
    | '{'
    | '|'
    | '|='
    | '||'
    | '}'
    | '~';

  export type TypeString = SyntaxType | UnnamedType;

  export type SyntaxNode =
    | AbstractDeclaratorNode
    | DeclaratorNode
    | ExpressionNode
    | FieldDeclaratorNode
    | StatementNode
    | TypeDeclaratorNode
    | TypeSpecifierNode
    | AbstractArrayDeclaratorNode
    | AbstractFunctionDeclaratorNode
    | AbstractParenthesizedDeclaratorNode
    | AbstractPointerDeclaratorNode
    | ArgumentListNode
    | ArrayDeclaratorNode
    | AssignmentExpressionNode
    | AttributeSpecifierNode
    | BinaryExpressionNode
    | BitfieldClauseNode
    | BreakStatementNode
    | CallExpressionNode
    | CaseStatementNode
    | CastExpressionNode
    | CharLiteralNode
    | CommaExpressionNode
    | CompoundLiteralExpressionNode
    | CompoundStatementNode
    | ConcatenatedStringNode
    | ConditionalExpressionNode
    | ContinueStatementNode
    | DeclarationNode
    | DeclarationListNode
    | DoStatementNode
    | EnumSpecifierNode
    | EnumeratorNode
    | EnumeratorListNode
    | ExpressionStatementNode
    | FieldDeclarationNode
    | FieldDeclarationListNode
    | FieldDesignatorNode
    | FieldExpressionNode
    | ForStatementNode
    | FunctionDeclaratorNode
    | FunctionDefinitionNode
    | GotoStatementNode
    | IfStatementNode
    | InitDeclaratorNode
    | InitializerListNode
    | InitializerPairNode
    | LabeledStatementNode
    | LinkageSpecificationNode
    | MacroTypeSpecifierNode
    | MsBasedModifierNode
    | MsCallModifierNode
    | MsDeclspecModifierNode
    | MsPointerModifierNode
    | MsUnalignedPtrModifierNode
    | ParameterDeclarationNode
    | ParameterListNode
    | ParenthesizedDeclaratorNode
    | ParenthesizedExpressionNode
    | PointerDeclaratorNode
    | PointerExpressionNode
    | PreprocCallNode
    | PreprocDefNode
    | PreprocDefinedNode
    | PreprocElifNode
    | PreprocElseNode
    | PreprocFunctionDefNode
    | PreprocIfNode
    | PreprocIfdefNode
    | PreprocIncludeNode
    | PreprocParamsNode
    | ReturnStatementNode
    | SizedTypeSpecifierNode
    | SizeofExpressionNode
    | StorageClassSpecifierNode
    | StringLiteralNode
    | StructSpecifierNode
    | SubscriptDesignatorNode
    | SubscriptExpressionNode
    | SwitchStatementNode
    | TranslationUnitNode
    | TypeDefinitionNode
    | TypeDescriptorNode
    | TypeQualifierNode
    | UnaryExpressionNode
    | UnionSpecifierNode
    | UpdateExpressionNode
    | WhileStatementNode
    | UnnamedNode<'\n'>
    | UnnamedNode<'!'>
    | UnnamedNode<'!='>
    | UnnamedNode<'"'>
    | UnnamedNode<'#define'>
    | UnnamedNode<'#elif'>
    | UnnamedNode<'#else'>
    | UnnamedNode<'#endif'>
    | UnnamedNode<'#if'>
    | UnnamedNode<'#ifdef'>
    | UnnamedNode<'#ifndef'>
    | UnnamedNode<'#include'>
    | UnnamedNode<'%'>
    | UnnamedNode<'%='>
    | UnnamedNode<'&'>
    | UnnamedNode<'&&'>
    | UnnamedNode<'&='>
    | UnnamedNode<"'">
    | UnnamedNode<'('>
    | UnnamedNode<')'>
    | UnnamedNode<'*'>
    | UnnamedNode<'*='>
    | UnnamedNode<'+'>
    | UnnamedNode<'++'>
    | UnnamedNode<'+='>
    | UnnamedNode<','>
    | UnnamedNode<'-'>
    | UnnamedNode<'--'>
    | UnnamedNode<'-='>
    | UnnamedNode<'->'>
    | UnnamedNode<'.'>
    | UnnamedNode<'...'>
    | UnnamedNode<'/'>
    | UnnamedNode<'/='>
    | UnnamedNode<':'>
    | UnnamedNode<';'>
    | UnnamedNode<'<'>
    | UnnamedNode<'<<'>
    | UnnamedNode<'<<='>
    | UnnamedNode<'<='>
    | UnnamedNode<'='>
    | UnnamedNode<'=='>
    | UnnamedNode<'>'>
    | UnnamedNode<'>='>
    | UnnamedNode<'>>'>
    | UnnamedNode<'>>='>
    | UnnamedNode<'?'>
    | UnnamedNode<'L"'>
    | UnnamedNode<"L'">
    | UnnamedNode<'U"'>
    | UnnamedNode<"U'">
    | UnnamedNode<'['>
    | UnnamedNode<']'>
    | UnnamedNode<'^'>
    | UnnamedNode<'^='>
    | UnnamedNode<'_Atomic'>
    | UnnamedNode<'__attribute__'>
    | UnnamedNode<'__based'>
    | UnnamedNode<'__cdecl'>
    | UnnamedNode<'__clrcall'>
    | UnnamedNode<'__declspec'>
    | UnnamedNode<'__fastcall'>
    | UnnamedNode<'__stdcall'>
    | UnnamedNode<'__thiscall'>
    | UnnamedNode<'__unaligned'>
    | UnnamedNode<'__vectorcall'>
    | UnnamedNode<'_unaligned'>
    | UnnamedNode<'auto'>
    | UnnamedNode<'break'>
    | UnnamedNode<'case'>
    | CommentNode
    | UnnamedNode<'const'>
    | UnnamedNode<'continue'>
    | UnnamedNode<'default'>
    | UnnamedNode<'defined'>
    | UnnamedNode<'do'>
    | UnnamedNode<'else'>
    | UnnamedNode<'enum'>
    | EscapeSequenceNode
    | UnnamedNode<'extern'>
    | FalseNode
    | FieldIdentifierNode
    | UnnamedNode<'for'>
    | UnnamedNode<'goto'>
    | IdentifierNode
    | UnnamedNode<'if'>
    | UnnamedNode<'inline'>
    | UnnamedNode<'long'>
    | MsRestrictModifierNode
    | MsSignedPtrModifierNode
    | MsUnsignedPtrModifierNode
    | NullNode
    | NumberLiteralNode
    | PreprocArgNode
    | PreprocDirectiveNode
    | PrimitiveTypeNode
    | UnnamedNode<'register'>
    | UnnamedNode<'restrict'>
    | UnnamedNode<'return'>
    | UnnamedNode<'short'>
    | UnnamedNode<'signed'>
    | UnnamedNode<'sizeof'>
    | StatementIdentifierNode
    | UnnamedNode<'static'>
    | UnnamedNode<'struct'>
    | UnnamedNode<'switch'>
    | SystemLibStringNode
    | TrueNode
    | TypeIdentifierNode
    | UnnamedNode<'typedef'>
    | UnnamedNode<'u"'>
    | UnnamedNode<"u'">
    | UnnamedNode<'u8"'>
    | UnnamedNode<"u8'">
    | UnnamedNode<'union'>
    | UnnamedNode<'unsigned'>
    | UnnamedNode<'volatile'>
    | UnnamedNode<'while'>
    | UnnamedNode<'{'>
    | UnnamedNode<'|'>
    | UnnamedNode<'|='>
    | UnnamedNode<'||'>
    | UnnamedNode<'}'>
    | UnnamedNode<'~'>
    | ErrorNode;

  export type AbstractDeclaratorNode =
    | AbstractArrayDeclaratorNode
    | AbstractFunctionDeclaratorNode
    | AbstractParenthesizedDeclaratorNode
    | AbstractPointerDeclaratorNode;

  export type DeclaratorNode =
    | ArrayDeclaratorNode
    | FunctionDeclaratorNode
    | IdentifierNode
    | ParenthesizedDeclaratorNode
    | PointerDeclaratorNode;

  export type ExpressionNode =
    | AssignmentExpressionNode
    | BinaryExpressionNode
    | CallExpressionNode
    | CastExpressionNode
    | CharLiteralNode
    | CompoundLiteralExpressionNode
    | ConcatenatedStringNode
    | ConditionalExpressionNode
    | FalseNode
    | FieldExpressionNode
    | IdentifierNode
    | NullNode
    | NumberLiteralNode
    | ParenthesizedExpressionNode
    | PointerExpressionNode
    | SizeofExpressionNode
    | StringLiteralNode
    | SubscriptExpressionNode
    | TrueNode
    | UnaryExpressionNode
    | UpdateExpressionNode;

  export type FieldDeclaratorNode =
    | ArrayDeclaratorNode
    | FieldIdentifierNode
    | FunctionDeclaratorNode
    | ParenthesizedDeclaratorNode
    | PointerDeclaratorNode;

  export type StatementNode =
    | BreakStatementNode
    | CaseStatementNode
    | CompoundStatementNode
    | ContinueStatementNode
    | DoStatementNode
    | ExpressionStatementNode
    | ForStatementNode
    | GotoStatementNode
    | IfStatementNode
    | LabeledStatementNode
    | ReturnStatementNode
    | SwitchStatementNode
    | WhileStatementNode;

  export type TypeDeclaratorNode =
    | ArrayDeclaratorNode
    | FunctionDeclaratorNode
    | ParenthesizedDeclaratorNode
    | PointerDeclaratorNode
    | TypeIdentifierNode;

  export type TypeSpecifierNode =
    | EnumSpecifierNode
    | MacroTypeSpecifierNode
    | PrimitiveTypeNode
    | SizedTypeSpecifierNode
    | StructSpecifierNode
    | TypeIdentifierNode
    | UnionSpecifierNode;

  export interface AbstractArrayDeclaratorNode extends NamedNodeBase {
    type: SyntaxType.AbstractArrayDeclarator;
    declaratorNode?: AbstractDeclaratorNode;
    sizeNode?: UnnamedNode<'*'> | ExpressionNode;
  }

  export interface AbstractFunctionDeclaratorNode extends NamedNodeBase {
    type: SyntaxType.AbstractFunctionDeclarator;
    declaratorNode?: AbstractDeclaratorNode;
    parametersNode: ParameterListNode;
  }

  export interface AbstractParenthesizedDeclaratorNode extends NamedNodeBase {
    type: SyntaxType.AbstractParenthesizedDeclarator;
  }

  export interface AbstractPointerDeclaratorNode extends NamedNodeBase {
    type: SyntaxType.AbstractPointerDeclarator;
    declaratorNode?: AbstractDeclaratorNode;
  }

  export interface ArgumentListNode extends NamedNodeBase {
    type: SyntaxType.ArgumentList;
  }

  export interface ArrayDeclaratorNode extends NamedNodeBase {
    type: SyntaxType.ArrayDeclarator;
    declaratorNode: DeclaratorNode | FieldDeclaratorNode | TypeDeclaratorNode;
    sizeNode?: UnnamedNode<'*'> | ExpressionNode;
  }

  export interface AssignmentExpressionNode extends NamedNodeBase {
    type: SyntaxType.AssignmentExpression;
    leftNode:
      | CallExpressionNode
      | FieldExpressionNode
      | IdentifierNode
      | ParenthesizedExpressionNode
      | PointerExpressionNode
      | SubscriptExpressionNode;
    rightNode: ExpressionNode;
  }

  export interface AttributeSpecifierNode extends NamedNodeBase {
    type: SyntaxType.AttributeSpecifier;
  }

  export interface BinaryExpressionNode extends NamedNodeBase {
    type: SyntaxType.BinaryExpression;
    leftNode: ExpressionNode | PreprocDefinedNode;
    operatorNode:
      | UnnamedNode<'!='>
      | UnnamedNode<'%'>
      | UnnamedNode<'&'>
      | UnnamedNode<'&&'>
      | UnnamedNode<'*'>
      | UnnamedNode<'+'>
      | UnnamedNode<'-'>
      | UnnamedNode<'/'>
      | UnnamedNode<'<'>
      | UnnamedNode<'<<'>
      | UnnamedNode<'<='>
      | UnnamedNode<'=='>
      | UnnamedNode<'>'>
      | UnnamedNode<'>='>
      | UnnamedNode<'>>'>
      | UnnamedNode<'^'>
      | UnnamedNode<'|'>
      | UnnamedNode<'||'>;
    rightNode: ExpressionNode | PreprocDefinedNode;
  }

  export interface BitfieldClauseNode extends NamedNodeBase {
    type: SyntaxType.BitfieldClause;
  }

  export interface BreakStatementNode extends NamedNodeBase {
    type: SyntaxType.BreakStatement;
  }

  export interface CallExpressionNode extends NamedNodeBase {
    type: SyntaxType.CallExpression;
    argumentsNode: ArgumentListNode;
    functionNode: ExpressionNode;
  }

  export interface CaseStatementNode extends NamedNodeBase {
    type: SyntaxType.CaseStatement;
    valueNode?: ExpressionNode;
  }

  export interface CastExpressionNode extends NamedNodeBase {
    type: SyntaxType.CastExpression;
    typeNode: TypeDescriptorNode;
    valueNode: ExpressionNode;
  }

  export interface CharLiteralNode extends NamedNodeBase {
    type: SyntaxType.CharLiteral;
  }

  export interface CommaExpressionNode extends NamedNodeBase {
    type: SyntaxType.CommaExpression;
    leftNode: ExpressionNode;
    rightNode: ExpressionNode | CommaExpressionNode;
  }

  export interface CompoundLiteralExpressionNode extends NamedNodeBase {
    type: SyntaxType.CompoundLiteralExpression;
    typeNode: TypeDescriptorNode;
    valueNode: InitializerListNode;
  }

  export interface CompoundStatementNode extends NamedNodeBase {
    type: SyntaxType.CompoundStatement;
  }

  export interface ConcatenatedStringNode extends NamedNodeBase {
    type: SyntaxType.ConcatenatedString;
  }

  export interface ConditionalExpressionNode extends NamedNodeBase {
    type: SyntaxType.ConditionalExpression;
    alternativeNode: ExpressionNode;
    conditionNode: ExpressionNode;
    consequenceNode: ExpressionNode;
  }

  export interface ContinueStatementNode extends NamedNodeBase {
    type: SyntaxType.ContinueStatement;
  }

  export interface DeclarationNode extends NamedNodeBase {
    type: SyntaxType.Declaration;
    declaratorNodes: (DeclaratorNode | InitDeclaratorNode)[];
    typeNode: TypeSpecifierNode;
  }

  export interface DeclarationListNode extends NamedNodeBase {
    type: SyntaxType.DeclarationList;
  }

  export interface DoStatementNode extends NamedNodeBase {
    type: SyntaxType.DoStatement;
    bodyNode: StatementNode;
    conditionNode: ParenthesizedExpressionNode;
  }

  export interface EnumSpecifierNode extends NamedNodeBase {
    type: SyntaxType.EnumSpecifier;
    bodyNode?: EnumeratorListNode;
    nameNode?: TypeIdentifierNode;
  }

  export interface EnumeratorNode extends NamedNodeBase {
    type: SyntaxType.Enumerator;
    nameNode: IdentifierNode;
    valueNode?: ExpressionNode;
  }

  export interface EnumeratorListNode extends NamedNodeBase {
    type: SyntaxType.EnumeratorList;
  }

  export interface ExpressionStatementNode extends NamedNodeBase {
    type: SyntaxType.ExpressionStatement;
  }

  export interface FieldDeclarationNode extends NamedNodeBase {
    type: SyntaxType.FieldDeclaration;
    declaratorNodes: FieldDeclaratorNode[];
    typeNode: TypeSpecifierNode;
  }

  export interface FieldDeclarationListNode extends NamedNodeBase {
    type: SyntaxType.FieldDeclarationList;
  }

  export interface FieldDesignatorNode extends NamedNodeBase {
    type: SyntaxType.FieldDesignator;
  }

  export interface FieldExpressionNode extends NamedNodeBase {
    type: SyntaxType.FieldExpression;
    argumentNode: ExpressionNode;
    fieldNode: FieldIdentifierNode;
  }

  export interface ForStatementNode extends NamedNodeBase {
    type: SyntaxType.ForStatement;
    conditionNode?: ExpressionNode;
    initializerNode?: ExpressionNode | CommaExpressionNode | DeclarationNode;
    updateNode?: ExpressionNode | CommaExpressionNode;
  }

  export interface FunctionDeclaratorNode extends NamedNodeBase {
    type: SyntaxType.FunctionDeclarator;
    declaratorNode: DeclaratorNode | FieldDeclaratorNode | TypeDeclaratorNode;
    parametersNode: ParameterListNode;
  }

  export interface FunctionDefinitionNode extends NamedNodeBase {
    type: SyntaxType.FunctionDefinition;
    bodyNode: CompoundStatementNode;
    declaratorNode: DeclaratorNode;
    typeNode: TypeSpecifierNode;
  }

  export interface GotoStatementNode extends NamedNodeBase {
    type: SyntaxType.GotoStatement;
    labelNode: StatementIdentifierNode;
  }

  export interface IfStatementNode extends NamedNodeBase {
    type: SyntaxType.IfStatement;
    alternativeNode?: StatementNode;
    conditionNode: ParenthesizedExpressionNode;
    consequenceNode: StatementNode;
  }

  export interface InitDeclaratorNode extends NamedNodeBase {
    type: SyntaxType.InitDeclarator;
    declaratorNode: DeclaratorNode;
    valueNode: ExpressionNode | InitializerListNode;
  }

  export interface InitializerListNode extends NamedNodeBase {
    type: SyntaxType.InitializerList;
  }

  export interface InitializerPairNode extends NamedNodeBase {
    type: SyntaxType.InitializerPair;
    designatorNodes: (FieldDesignatorNode | SubscriptDesignatorNode)[];
    valueNode: ExpressionNode | InitializerListNode;
  }

  export interface LabeledStatementNode extends NamedNodeBase {
    type: SyntaxType.LabeledStatement;
    labelNode: StatementIdentifierNode;
  }

  export interface LinkageSpecificationNode extends NamedNodeBase {
    type: SyntaxType.LinkageSpecification;
    bodyNode: DeclarationNode | DeclarationListNode | FunctionDefinitionNode;
    valueNode: StringLiteralNode;
  }

  export interface MacroTypeSpecifierNode extends NamedNodeBase {
    type: SyntaxType.MacroTypeSpecifier;
    nameNode: IdentifierNode;
    typeNode: TypeDescriptorNode;
  }

  export interface MsBasedModifierNode extends NamedNodeBase {
    type: SyntaxType.MsBasedModifier;
  }

  export interface MsCallModifierNode extends NamedNodeBase {
    type: SyntaxType.MsCallModifier;
  }

  export interface MsDeclspecModifierNode extends NamedNodeBase {
    type: SyntaxType.MsDeclspecModifier;
  }

  export interface MsPointerModifierNode extends NamedNodeBase {
    type: SyntaxType.MsPointerModifier;
  }

  export interface MsUnalignedPtrModifierNode extends NamedNodeBase {
    type: SyntaxType.MsUnalignedPtrModifier;
  }

  export interface ParameterDeclarationNode extends NamedNodeBase {
    type: SyntaxType.ParameterDeclaration;
    declaratorNode?: AbstractDeclaratorNode | DeclaratorNode;
    typeNode: TypeSpecifierNode;
  }

  export interface ParameterListNode extends NamedNodeBase {
    type: SyntaxType.ParameterList;
  }

  export interface ParenthesizedDeclaratorNode extends NamedNodeBase {
    type: SyntaxType.ParenthesizedDeclarator;
  }

  export interface ParenthesizedExpressionNode extends NamedNodeBase {
    type: SyntaxType.ParenthesizedExpression;
  }

  export interface PointerDeclaratorNode extends NamedNodeBase {
    type: SyntaxType.PointerDeclarator;
    declaratorNode: DeclaratorNode | FieldDeclaratorNode | TypeDeclaratorNode;
  }

  export interface PointerExpressionNode extends NamedNodeBase {
    type: SyntaxType.PointerExpression;
    argumentNode: ExpressionNode;
    operatorNode: UnnamedNode<'&'> | UnnamedNode<'*'>;
  }

  export interface PreprocCallNode extends NamedNodeBase {
    type: SyntaxType.PreprocCall;
    argumentNode?: PreprocArgNode;
    directiveNode: PreprocDirectiveNode;
  }

  export interface PreprocDefNode extends NamedNodeBase {
    type: SyntaxType.PreprocDef;
    nameNode: IdentifierNode;
    valueNode?: PreprocArgNode;
  }

  export interface PreprocDefinedNode extends NamedNodeBase {
    type: SyntaxType.PreprocDefined;
  }

  export interface PreprocElifNode extends NamedNodeBase {
    type: SyntaxType.PreprocElif;
    alternativeNode?: PreprocElifNode | PreprocElseNode;
    conditionNode:
      | BinaryExpressionNode
      | CallExpressionNode
      | CharLiteralNode
      | IdentifierNode
      | NumberLiteralNode
      | ParenthesizedExpressionNode
      | PreprocDefinedNode
      | UnaryExpressionNode;
  }

  export interface PreprocElseNode extends NamedNodeBase {
    type: SyntaxType.PreprocElse;
  }

  export interface PreprocFunctionDefNode extends NamedNodeBase {
    type: SyntaxType.PreprocFunctionDef;
    nameNode: IdentifierNode;
    parametersNode: PreprocParamsNode;
    valueNode?: PreprocArgNode;
  }

  export interface PreprocIfNode extends NamedNodeBase {
    type: SyntaxType.PreprocIf;
    alternativeNode?: PreprocElifNode | PreprocElseNode;
    conditionNode:
      | BinaryExpressionNode
      | CallExpressionNode
      | CharLiteralNode
      | IdentifierNode
      | NumberLiteralNode
      | ParenthesizedExpressionNode
      | PreprocDefinedNode
      | UnaryExpressionNode;
  }

  export interface PreprocIfdefNode extends NamedNodeBase {
    type: SyntaxType.PreprocIfdef;
    alternativeNode?: PreprocElifNode | PreprocElseNode;
    nameNode: IdentifierNode;
  }

  export interface PreprocIncludeNode extends NamedNodeBase {
    type: SyntaxType.PreprocInclude;
    pathNode:
      | CallExpressionNode
      | IdentifierNode
      | StringLiteralNode
      | SystemLibStringNode;
  }

  export interface PreprocParamsNode extends NamedNodeBase {
    type: SyntaxType.PreprocParams;
  }

  export interface ReturnStatementNode extends NamedNodeBase {
    type: SyntaxType.ReturnStatement;
  }

  export interface SizedTypeSpecifierNode extends NamedNodeBase {
    type: SyntaxType.SizedTypeSpecifier;
    typeNode?: PrimitiveTypeNode | TypeIdentifierNode;
  }

  export interface SizeofExpressionNode extends NamedNodeBase {
    type: SyntaxType.SizeofExpression;
    typeNode?: TypeDescriptorNode;
    valueNode?: ExpressionNode;
  }

  export interface StorageClassSpecifierNode extends NamedNodeBase {
    type: SyntaxType.StorageClassSpecifier;
  }

  export interface StringLiteralNode extends NamedNodeBase {
    type: SyntaxType.StringLiteral;
  }

  export interface StructSpecifierNode extends NamedNodeBase {
    type: SyntaxType.StructSpecifier;
    bodyNode?: FieldDeclarationListNode;
    nameNode?: TypeIdentifierNode;
  }

  export interface SubscriptDesignatorNode extends NamedNodeBase {
    type: SyntaxType.SubscriptDesignator;
  }

  export interface SubscriptExpressionNode extends NamedNodeBase {
    type: SyntaxType.SubscriptExpression;
    argumentNode: ExpressionNode;
    indexNode: ExpressionNode;
  }

  export interface SwitchStatementNode extends NamedNodeBase {
    type: SyntaxType.SwitchStatement;
    bodyNode: CompoundStatementNode;
    conditionNode: ParenthesizedExpressionNode;
  }

  export interface TranslationUnitNode extends NamedNodeBase {
    type: SyntaxType.TranslationUnit;
  }

  export interface TypeDefinitionNode extends NamedNodeBase {
    type: SyntaxType.TypeDefinition;
    declaratorNodes: TypeDeclaratorNode[];
    typeNode: TypeSpecifierNode;
  }

  export interface TypeDescriptorNode extends NamedNodeBase {
    type: SyntaxType.TypeDescriptor;
    declaratorNode?: AbstractDeclaratorNode;
    typeNode: TypeSpecifierNode;
  }

  export interface TypeQualifierNode extends NamedNodeBase {
    type: SyntaxType.TypeQualifier;
  }

  export interface UnaryExpressionNode extends NamedNodeBase {
    type: SyntaxType.UnaryExpression;
    argumentNode: ExpressionNode | PreprocDefinedNode;
    operatorNode:
      | UnnamedNode<'!'>
      | UnnamedNode<'+'>
      | UnnamedNode<'-'>
      | UnnamedNode<'~'>;
  }

  export interface UnionSpecifierNode extends NamedNodeBase {
    type: SyntaxType.UnionSpecifier;
    bodyNode?: FieldDeclarationListNode;
    nameNode?: TypeIdentifierNode;
  }

  export interface UpdateExpressionNode extends NamedNodeBase {
    type: SyntaxType.UpdateExpression;
    argumentNode: ExpressionNode;
    operatorNode: UnnamedNode<'++'> | UnnamedNode<'--'>;
  }

  export interface WhileStatementNode extends NamedNodeBase {
    type: SyntaxType.WhileStatement;
    bodyNode: StatementNode;
    conditionNode: ParenthesizedExpressionNode;
  }

  export interface CommentNode extends NamedNodeBase {
    type: SyntaxType.Comment;
  }

  export interface EscapeSequenceNode extends NamedNodeBase {
    type: SyntaxType.EscapeSequence;
  }

  export interface FalseNode extends NamedNodeBase {
    type: SyntaxType.False;
  }

  export interface FieldIdentifierNode extends NamedNodeBase {
    type: SyntaxType.FieldIdentifier;
  }

  export interface IdentifierNode extends NamedNodeBase {
    type: SyntaxType.Identifier;
  }

  export interface MsRestrictModifierNode extends NamedNodeBase {
    type: SyntaxType.MsRestrictModifier;
  }

  export interface MsSignedPtrModifierNode extends NamedNodeBase {
    type: SyntaxType.MsSignedPtrModifier;
  }

  export interface MsUnsignedPtrModifierNode extends NamedNodeBase {
    type: SyntaxType.MsUnsignedPtrModifier;
  }

  export interface NullNode extends NamedNodeBase {
    type: SyntaxType.Null;
  }

  export interface NumberLiteralNode extends NamedNodeBase {
    type: SyntaxType.NumberLiteral;
  }

  export interface PreprocArgNode extends NamedNodeBase {
    type: SyntaxType.PreprocArg;
  }

  export interface PreprocDirectiveNode extends NamedNodeBase {
    type: SyntaxType.PreprocDirective;
  }

  export interface PrimitiveTypeNode extends NamedNodeBase {
    type: SyntaxType.PrimitiveType;
  }

  export interface StatementIdentifierNode extends NamedNodeBase {
    type: SyntaxType.StatementIdentifier;
  }

  export interface SystemLibStringNode extends NamedNodeBase {
    type: SyntaxType.SystemLibString;
  }

  export interface TrueNode extends NamedNodeBase {
    type: SyntaxType.True;
  }

  export interface TypeIdentifierNode extends NamedNodeBase {
    type: SyntaxType.TypeIdentifier;
  }
}
