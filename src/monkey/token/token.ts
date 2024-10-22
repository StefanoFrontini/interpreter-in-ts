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
  | "RETURN";

export type Token = {
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
  RETURN = "RETURN";
