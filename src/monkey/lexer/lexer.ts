import * as Token from "#root/src/monkey/token/token.ts";
export type t = {
  input: string;
  position: number;
  readPosition: number;
  ch: string;
};

export const EOF_CHAR = "\0";

export const init = (input: string): t => {
  const l = { input, position: 0, readPosition: 0, ch: "" };
  readChar(l);
  return l;
};

const readChar = (l: t): void => {
  if (l.readPosition >= l.input.length) {
    l.ch = EOF_CHAR;
    // l.ch = "";
  } else {
    l.ch = l.input[l.readPosition];
  }
  l.position = l.readPosition;
  l.readPosition += 1;
};

const peekChar = (l: t): string => {
  if (l.readPosition >= l.input.length) {
    return EOF_CHAR;
  } else {
    return l.input[l.readPosition];
  }
};

const readIdentifier = (l: t): string => {
  const position = l.position;
  while (isLetter(l.ch)) {
    readChar(l);
  }
  return l.input.slice(position, l.position);
};

const isLetter = (ch: string): boolean => {
  return ("a" <= ch && ch <= "z") || ("A" <= ch && ch <= "Z") || ch === "_";
};

const skipWhitespace = (l: t): void => {
  while (l.ch === " " || l.ch === "\t" || l.ch === "\n" || l.ch === "\r") {
    readChar(l);
  }
};

const readNumber = (l: t): string => {
  const position = l.position;
  while (isDigit(l.ch)) {
    readChar(l);
  }
  return l.input.slice(position, l.position);
};

const isDigit = (ch: string): boolean => {
  return "0" <= ch && ch <= "9";
};

const newToken = (t: Token.TokenType, l: string): Token.t => ({
  type: t,
  literal: l,
});

const readString = (l: t): string => {
  const position = l.position + 1;
  do {
    readChar(l);
  } while (l.ch !== '"' && l.ch !== EOF_CHAR);

  return l.input.slice(position, l.position);
};

export const nextToken = (l: t): Token.t => {
  let tok = newToken(Token.EOF, "");
  skipWhitespace(l);
  switch (l.ch) {
    case "=":
      if (peekChar(l) === "=") {
        const ch = l.ch;
        readChar(l);
        const literal = ch + l.ch;
        tok = newToken(Token.EQ, literal);
      } else {
        tok = newToken(Token.ASSIGN, l.ch);
      }
      break;
    case ";":
      tok = newToken(Token.SEMICOLON, l.ch);
      break;
    case "(":
      tok = newToken(Token.LPAREN, l.ch);
      break;
    case ")":
      tok = newToken(Token.RPAREN, l.ch);
      break;
    case ",":
      tok = newToken(Token.COMMA, l.ch);
      break;
    case "+":
      tok = newToken(Token.PLUS, l.ch);
      break;
    case "-":
      tok = newToken(Token.MINUS, l.ch);
      break;
    case "/":
      tok = newToken(Token.SLASH, l.ch);
      break;
    case "*":
      tok = newToken(Token.ASTERISK, l.ch);
      break;
    case "<":
      tok = newToken(Token.LT, l.ch);
      break;
    case ">":
      tok = newToken(Token.GT, l.ch);
      break;
    case "!":
      if (peekChar(l) === "=") {
        const ch = l.ch;
        readChar(l);
        const literal = ch + l.ch;
        tok = newToken(Token.NOT_EQ, literal);
      } else {
        tok = newToken(Token.BANG, l.ch);
      }
      break;
    case "=":
      tok = newToken(Token.EQ, l.ch);
      break;
    case "!=":
      tok = newToken(Token.NOT_EQ, l.ch);
      break;
    case "{":
      tok = newToken(Token.LBRACE, l.ch);
      break;
    case "}":
      tok = newToken(Token.RBRACE, l.ch);
      break;
    case '"':
      tok.type = Token.STRING;
      tok.literal = readString(l);
      break;
    case EOF_CHAR:
      tok = newToken(Token.EOF, l.ch);
      break;
    default:
      if (isLetter(l.ch)) {
        tok.literal = readIdentifier(l);
        tok.type = Token.lookupIdent(tok.literal);
        return tok;
      } else if (isDigit(l.ch)) {
        tok.type = Token.INT;
        tok.literal = readNumber(l);
        return tok;
      } else {
        tok = newToken(Token.ILLEGAL, l.ch);
      }
      break;
  }
  readChar(l);
  return tok;
};
