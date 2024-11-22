export type TokenType =
  | "ILLEGAL"
  | "EOF"
  | "IDENT"
  | "INT"
  | "="
  | "+"
  | "-"
  | "!"
  | "*"
  | "/"
  | "<"
  | ">"
  | "=="
  | "!="
  | ","
  | ";"
  | "("
  | ")"
  | "{"
  | "}"
  | "FUNCTION"
  | "LET"
  | "TRUE"
  | "FALSE"
  | "IF"
  | "ELSE"
  | "RETURN"
  | "STRING";

export type t = {
  type: TokenType;
  literal: string;
};
export const ILLEGAL = "ILLEGAL",
  EOF = "EOF",
  // Identifiers + literals
  IDENT = "IDENT", // add, foobar, x, y, ...
  INT = "INT", // 1343456
  // Operators
  ASSIGN = "=",
  PLUS = "+",
  MINUS = "-",
  BANG = "!",
  ASTERISK = "*",
  SLASH = "/",
  LT = "<",
  GT = ">",
  EQ = "==",
  NOT_EQ = "!=",
  // Delimiters
  COMMA = ",",
  SEMICOLON = ";",
  LPAREN = "(",
  RPAREN = ")",
  LBRACE = "{",
  RBRACE = "}",
  // Keywords
  FUNCTION = "FUNCTION",
  LET = "LET",
  TRUE = "TRUE",
  FALSE = "FALSE",
  IF = "IF",
  ELSE = "ELSE",
  RETURN = "RETURN",
  STRING = "STRING";

const keywords = new Map<string, TokenType>([
  ["fn", FUNCTION],
  ["let", LET],
  ["true", TRUE],
  ["false", FALSE],
  ["if", IF],
  ["else", ELSE],
  ["return", RETURN],
]);

export const lookupIdent = (ident: string): TokenType =>
  keywords.get(ident) ?? IDENT;
