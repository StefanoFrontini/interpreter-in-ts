// import * as Ast from "#root/src/monkey/ast/ast.ts";
import * as Expression from "#root/src/monkey/ast/expression.ts";
import * as ExpressionStatement from "#root/src/monkey/ast/expressionStatement.ts";
import * as IntegerLiteral from "#root/src/monkey/ast/integerLiteral.ts";
import * as LetStatement from "#root/src/monkey/ast/letStatement.ts";
import * as PrefixExpression from "#root/src/monkey/ast/prefixExpression.ts";
import * as Program from "#root/src/monkey/ast/program.ts";
import * as ReturnStatement from "#root/src/monkey/ast/returnStatement.ts";
import * as Statement from "#root/src/monkey/ast/statement.ts";
import * as Lexer from "#root/src/monkey/lexer/lexer.ts";
import * as Token from "#root/src/monkey/token/token.ts";

const LOWEST = 1,
  EQUALS = 2,
  LESSGREATER = 3,
  SUM = 4,
  PRODUCT = 5,
  PREFIX = 6,
  CALL = 7;

const precedences = new Map<Token.TokenType, number>([
  [Token.EQ, EQUALS],
  [Token.NOT_EQ, EQUALS],
  [Token.LT, LESSGREATER],
  [Token.GT, LESSGREATER],
  [Token.PLUS, SUM],
  [Token.MINUS, SUM],
  [Token.SLASH, PRODUCT],
  [Token.ASTERISK, PRODUCT],
]);

export interface t {
  l: Lexer.t;
  curToken: Token.t;
  peekToken: Token.t;
  errors: string[];
  prefixParseFns: Map<Token.TokenType, (p: t) => Expression.t>;
  infixParseFns: Map<
    Token.TokenType,
    (p: t, left: Expression.t) => Expression.t
  >;
}

const peekPrecedence = (p: t): number => {
  if (!p.peekToken) return LOWEST;
  return precedences.get(p.peekToken.type) ?? LOWEST;
};

const curPrecedence = (p: t): number => {
  if (!p.curToken) return LOWEST;
  return precedences.get(p.curToken.type) ?? LOWEST;
};

const registerPrefix = (
  p: t,
  tokenType: Token.TokenType,
  fn: (p: t) => Expression.t
): void => {
  p.prefixParseFns.set(tokenType, fn);
};
const registerInfix = (
  p: t,
  tokenType: Token.TokenType,
  fn: (p: t, left: Expression.t) => Expression.t
): void => {
  p.infixParseFns.set(tokenType, fn);
};
const errors = (p: t): string[] => p.errors;

export const peekError = (p: t, tokenType: Token.TokenType): void => {
  const msg = `expected next token to be ${tokenType}, got ${p.peekToken.type} instead`;
  p.errors.push(msg);
};

const parseIntegerLiteral = (p: t): Expression.t => {
  const lit: IntegerLiteral.t = {
    token: p.curToken,
    value: Number(p.curToken.literal),
  };
  return lit;
};

const parseIdentifier = (p: t): Expression.t => {
  return {
    token: p.curToken,
    value: p.curToken.literal,
  };
};

const parsePrefixExpression = (p: t): Expression.t => {
  const expression = {
    _tag: "PrefixExpression",
    token: p.curToken,
    operator: p.curToken.literal,
  };

  nextToken(p);
  expression["right"] = parseExpression(p, PREFIX);
  return expression as PrefixExpression.t;
};

const parseInfixExpression = (p: t, left: Expression.t): Expression.t => {
  const expression = {
    _tag: "InfixExpression",
    token: p.curToken,
    operator: p.curToken.literal,
    left: left,
  };
  const precedence = curPrecedence(p);
  nextToken(p);
  expression["right"] = parseExpression(p, precedence);
  return expression as Expression.t;
};

export const init = (l: Lexer.t): t => {
  const p: t = {
    l: l,
    curToken: Lexer.nextToken(l),
    peekToken: Lexer.nextToken(l),
    errors: [],
    prefixParseFns: new Map<Token.TokenType, (p: t) => Expression.t>(),
    infixParseFns: new Map<
      Token.TokenType,
      (p: t, left: Expression.t) => Expression.t
    >(),
  };
  registerPrefix(p, Token.IDENT, parseIdentifier);
  registerPrefix(p, Token.INT, parseIntegerLiteral);
  registerPrefix(p, Token.BANG, parsePrefixExpression);
  registerPrefix(p, Token.MINUS, parsePrefixExpression);
  registerInfix(p, Token.PLUS, parseInfixExpression);
  registerInfix(p, Token.MINUS, parseInfixExpression);
  registerInfix(p, Token.SLASH, parseInfixExpression);
  registerInfix(p, Token.ASTERISK, parseInfixExpression);
  registerInfix(p, Token.EQ, parseInfixExpression);
  registerInfix(p, Token.NOT_EQ, parseInfixExpression);
  registerInfix(p, Token.LT, parseInfixExpression);
  registerInfix(p, Token.GT, parseInfixExpression);
  return p;
};

export const nextToken = (p: t): void => {
  p.curToken = p.peekToken;
  p.peekToken = Lexer.nextToken(p.l);
};

const curTokenIs = (p: t, tokenType: Token.TokenType): boolean => {
  return p.curToken.type === tokenType;
};

const peekTokenIs = (p: t, tokenType: Token.TokenType): boolean => {
  return p.peekToken.type === tokenType;
};

const expectedPeek = (p: t, tokenType: Token.TokenType): boolean => {
  if (peekTokenIs(p, tokenType)) {
    nextToken(p);
    return true;
  } else {
    peekError(p, tokenType);
    return false;
  }
};

const parseLetStatement = (p: t): LetStatement.t | null => {
  let stmt: LetStatement.t = {
    token: p.curToken,
    name: {
      token: p.curToken,
      value: p.curToken.literal,
    },
    value: {
      token: p.curToken,
      value: p.curToken.literal,
    },
  };
  if (!expectedPeek(p, Token.IDENT)) {
    return null;
  }
  stmt.name = {
    token: p.curToken,
    value: p.curToken.literal,
  };
  if (!expectedPeek(p, Token.ASSIGN)) {
    return null;
  }
  while (!curTokenIs(p, Token.SEMICOLON)) {
    nextToken(p);
  }
  return stmt;
};

const parseReturnStatement = (p: t): ReturnStatement.t | null => {
  const stmt: ReturnStatement.t = {
    token: p.curToken,
    returnValue: {
      token: p.curToken,
      value: p.curToken.literal,
    },
  };
  nextToken(p);
  while (!curTokenIs(p, Token.SEMICOLON)) {
    nextToken(p);
  }
  return stmt;
};

const noPrefixParseFnError = (p: t, t: Token.TokenType): void => {
  const msg = `no prefix parse function for ${t} found`;
  p.errors.push(msg);
};

const parseExpression = (p: t, precedence: number): Expression.t | null => {
  const prefix = p.prefixParseFns.get(p.curToken.type);
  if (!prefix) {
    noPrefixParseFnError(p, p.curToken.type);
    return null;
  }
  let leftExp = prefix(p);

  while (!peekTokenIs(p, Token.SEMICOLON) && precedence < peekPrecedence(p)) {
    const infix = p.infixParseFns.get(p.peekToken.type);
    if (!infix) {
      return leftExp;
    }
    nextToken(p);
    leftExp = infix(p, leftExp);
  }
  return leftExp;
};

const parseExpressionStatement = (p: t): ExpressionStatement.t => {
  const stmt = {
    token: p.curToken,
    expression: parseExpression(p, LOWEST),
  };
  if (peekTokenIs(p, Token.SEMICOLON)) {
    nextToken(p);
  }
  return stmt as ExpressionStatement.t;
};

const parseStatement = (p: t): Statement.t | null => {
  switch (p.curToken.type) {
    case Token.LET:
      return parseLetStatement(p);
    case Token.RETURN:
      return parseReturnStatement(p);
    default:
      return parseExpressionStatement(p);
  }
};

export const parseProgram = (p: t): Program.t => {
  const program: Program.t = {
    statements: [],
  };
  while (p.curToken.type !== Token.EOF) {
    const stmt = parseStatement(p);
    if (stmt) {
      program.statements.push(stmt);
    }
    nextToken(p);
  }
  return program;
};
