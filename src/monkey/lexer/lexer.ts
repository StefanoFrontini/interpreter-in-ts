import * as token from "#root/src/monkey/token/token.ts";
type Lexer = {
  input: string;
  position: number;
  readPosition: number;
  ch: string;
};

export const init = (input: string): Lexer => {
  const l = { input, position: 0, readPosition: 0, ch: "" };
  readChar(l);
  return l;
};

const readChar = (l: Lexer): void => {
  if (l.readPosition >= l.input.length) {
    l.ch = "";
  } else {
    l.ch = l.input[l.readPosition];
  }
  l.position = l.readPosition;
  l.readPosition += 1;
};

export const nextToken = (l: Lexer): token.Token => {
  let tok: token.Token;
  switch (l.ch) {
    case "=":
      tok = newToken(token.ASSIGN, l.ch);
      break;
    case ";":
      tok = newToken(token.SEMICOLON, l.ch);
      break;
    case "(":
      tok = newToken(token.LPAREN, l.ch);
      break;
    case ")":
      tok = newToken(token.RPAREN, l.ch);
      break;
    case ",":
      tok = newToken(token.COMMA, l.ch);
      break;
    case "+":
      tok = newToken(token.PLUS, l.ch);
      break;
    case "{":
      tok = newToken(token.LBRACE, l.ch);
      break;
    case "}":
      tok = newToken(token.RBRACE, l.ch);
      break;
    case "":
      tok = newToken(token.EOF, l.ch);
      // tok.literal = "";
      // tok.type = token.EOF;
      break;
    default:
      tok = newToken(token.ILLEGAL, l.ch);
      break;
  }
  readChar(l);
  return tok;
};

const newToken = (t: token.TokenType, l: string): token.Token => {
  return {
    type: t,
    literal: l,
  };
};
