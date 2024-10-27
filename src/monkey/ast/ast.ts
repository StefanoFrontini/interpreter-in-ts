import * as Expression from "#root/src/monkey/ast/expression.ts";
import * as Program from "#root/src/monkey/ast/program.ts";
import * as Statement from "#root/src/monkey/ast/statement.ts";

export type t = Expression.t | Statement.t | Program.t;
