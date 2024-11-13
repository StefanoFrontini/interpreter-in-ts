// import * as Ast from "#root/src/monkey/ast/ast.ts";
import * as BlockStatement from "#root/src/monkey/ast/blockStatement.ts";
import * as CallExpression from "#root/src/monkey/ast/callExpression.ts";
import * as Expression from "#root/src/monkey/ast/expression.ts";
import * as ExpressionStatement from "#root/src/monkey/ast/expressionStatement.ts";
import * as FunctionLiteral from "#root/src/monkey/ast/functionLiteral.ts";
import * as Identifier from "#root/src/monkey/ast/identifier.ts";
import * as IfExpression from "#root/src/monkey/ast/ifExpression.ts";
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
  [Token.LPAREN, CALL],
]);

export type t = {
  l: Lexer.t;
  curToken: Token.t;
  peekToken: Token.t;
  errors: string[];
  prefixParseFns: Map<Token.TokenType, (p: t) => Expression.t | null>;
  infixParseFns: Map<
    Token.TokenType,
    (p: t, left: Expression.t | null) => Expression.t
  >;
};

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
  fn: (p: t) => Expression.t | null
): void => {
  p.prefixParseFns.set(tokenType, fn);
};
const registerInfix = (
  p: t,
  tokenType: Token.TokenType,
  fn: (p: t, left: Expression.t | null) => Expression.t
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
    tag: "integerLiteral",
    token: p.curToken,
    value: Number(p.curToken.literal),
  };
  return lit;
};

const parseIdentifier = (p: t): Expression.t => {
  return {
    tag: "identifier",
    token: p.curToken,
    value: p.curToken.literal,
  };
};

const parsePrefixExpression = (p: t): Expression.t => {
  const expression = {
    tag: "prefixExpression",
    token: p.curToken,
    operator: p.curToken.literal,
  };

  nextToken(p);
  expression["right"] = parseExpression(p, PREFIX);
  return expression as PrefixExpression.t;
};

const parseInfixExpression = (
  p: t,
  left: Expression.t | null
): Expression.t => {
  const expression = {
    tag: "infixExpression",
    token: p.curToken,
    operator: p.curToken.literal,
    left: left,
  };
  const precedence = curPrecedence(p);
  nextToken(p);
  expression["right"] = parseExpression(p, precedence);
  return expression as Expression.t;
};

const parseBoolean = (p: t): Expression.t => {
  return {
    tag: "booleanExpression",
    token: p.curToken,
    value: curTokenIs(p, Token.TRUE),
  };
};

const parseGroupedExpression = (p: t): Expression.t | null => {
  nextToken(p);
  const exp = parseExpression(p, LOWEST);
  if (!expectedPeek(p, Token.RPAREN)) return null;
  return exp;
};

const parseBlockStatement = (p: t): BlockStatement.t => {
  const block = {
    tag: "blockStatement",
    token: p.curToken,
    statements: Array<Statement.t>(),
  };
  nextToken(p);
  while (!curTokenIs(p, Token.RBRACE) && !curTokenIs(p, Token.EOF)) {
    const stmt = parseStatement(p);
    if (stmt) {
      block["statements"].push(stmt);
    }
    nextToken(p);
  }
  return block as BlockStatement.t;
};

const parseIfExpression = (p: t): Expression.t | null => {
  const expression = {
    tag: "ifExpression",
    token: p.curToken,
  };
  if (!expectedPeek(p, Token.LPAREN)) return null;
  nextToken(p);
  expression["condition"] = parseExpression(p, LOWEST);
  if (!expectedPeek(p, Token.RPAREN)) return null;
  if (!expectedPeek(p, Token.LBRACE)) return null;
  expression["consequence"] = parseBlockStatement(p);
  if (peekTokenIs(p, Token.ELSE)) {
    nextToken(p);
    if (!expectedPeek(p, Token.LBRACE)) return null;
    expression["alternative"] = parseBlockStatement(p);
  }
  return expression as IfExpression.t;
};

const parseFunctionParameters = (p: t): Identifier.t[] | null => {
  const identifiers: Identifier.t[] = [];
  if (peekTokenIs(p, Token.RPAREN)) {
    nextToken(p);
    return identifiers;
  }
  nextToken(p);
  const ident: Identifier.t = {
    tag: "identifier",
    token: p.curToken,
    value: p.curToken.literal,
  };
  identifiers.push(ident);
  while (peekTokenIs(p, Token.COMMA)) {
    nextToken(p);
    nextToken(p);
    const identifier: Identifier.t = {
      tag: "identifier",
      token: p.curToken,
      value: p.curToken.literal,
    };
    identifiers.push(identifier);
  }
  if (!expectedPeek(p, Token.RPAREN)) return null;
  return identifiers;
};

const parseFunctionLiteral = (p: t): Expression.t | null => {
  const lit = {
    tag: "functionLiteral",
    token: p.curToken,
  };
  if (!expectedPeek(p, Token.LPAREN)) return null;
  lit["parameters"] = parseFunctionParameters(p);
  if (!expectedPeek(p, Token.LBRACE)) return null;
  lit["body"] = parseBlockStatement(p);
  return lit as FunctionLiteral.t;
};

const parseCallArguments = (p: t): Expression.t[] | null => {
  const args: Expression.t[] = [];
  if (peekTokenIs(p, Token.RPAREN)) {
    nextToken(p);
    return args;
  }
  nextToken(p);
  args.push(parseExpression(p, LOWEST) as Expression.t);
  while (peekTokenIs(p, Token.COMMA)) {
    nextToken(p);
    nextToken(p);
    args.push(parseExpression(p, LOWEST) as Expression.t);
  }
  if (!expectedPeek(p, Token.RPAREN)) return null;
  return args;
};

const parseCallExpression = (p: t, fn: Expression.t | null): Expression.t => {
  const expression = {
    tag: "callExpression",
    token: p.curToken,
    function: fn,
  };
  expression["arguments"] = parseCallArguments(p);
  return expression as CallExpression.t;
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
      (p: t, left: Expression.t | null) => Expression.t
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
  registerPrefix(p, Token.TRUE, parseBoolean);
  registerPrefix(p, Token.FALSE, parseBoolean);
  registerPrefix(p, Token.LPAREN, parseGroupedExpression);
  registerPrefix(p, Token.IF, parseIfExpression);
  registerPrefix(p, Token.FUNCTION, parseFunctionLiteral);
  registerInfix(p, Token.LPAREN, parseCallExpression);
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
  let stmt = {
    token: p.curToken,
    value: {
      token: p.curToken,
      value: p.curToken.literal,
    },
  };
  if (!expectedPeek(p, Token.IDENT)) {
    return null;
  }
  stmt["name"] = {
    token: p.curToken,
    value: p.curToken.literal,
  };
  if (!expectedPeek(p, Token.ASSIGN)) {
    return null;
  }
  while (!curTokenIs(p, Token.SEMICOLON)) {
    nextToken(p);
  }
  return stmt as LetStatement.t;
};

const parseReturnStatement = (p: t): ReturnStatement.t | null => {
  const stmt: ReturnStatement.t = {
    tag: "returnStatement",
    token: p.curToken,
    returnValue: {
      tag: "identifier",
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
  let stmt = {
    tag: "expressionStatement",
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
