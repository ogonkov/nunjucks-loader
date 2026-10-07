import 'nunjucks';

declare module 'nunjucks' {
    export interface ConfigureOptionsTags {
        blockStart: string;
        blockEnd: string;
        variableStart: string;
        variableEnd: string;
        commentStart: string;
        commentEnd: string;
    }


    export interface ConfigureOptions {
        tags?: Partial<ConfigureOptionsTags> | undefined;
    }

    export interface Extension {
        parse(parser: parser.Parser, nodes: any, lexer: any): any;
    }

    /** Internal base class */
    class Obj<T extends string> {
        typename: T;
    }

    export type NodeType =
        | nodes.Node
        | nodes.Root
        | nodes.NodeList
        | nodes.Value
        | nodes.Literal
        | nodes.Symbol
        | nodes.Group
        | nodes.Array
        | nodes.Pair
        | nodes.Dict
        | nodes.Output
        | nodes.Capture
        | nodes.TemplateData
        | nodes.If
        | nodes.IfAsync
        | nodes.InlineIf
        | nodes.For
        | nodes.AsyncEach
        | nodes.AsyncAll
        | nodes.Macro
        | nodes.Caller
        | nodes.Import
        | nodes.FromImport
        | nodes.FunCall
        | nodes.Filter
        | nodes.FilterAsync
        | nodes.KeywordArgs
        | nodes.Block
        | nodes.Super
        | nodes.Extends
        | nodes.Include
        | nodes.Set
        | nodes.Switch
        | nodes.Case
        | nodes.LookupVal
        | nodes.BinOp
        | nodes.In
        | nodes.Is
        | nodes.Or
        | nodes.And
        | nodes.Not
        | nodes.Add
        | nodes.Concat
        | nodes.Sub
        | nodes.Mul
        | nodes.Div
        | nodes.FloorDiv
        | nodes.Mod
        | nodes.Pow
        | nodes.Neg
        | nodes.Pos
        | nodes.Compare
        | nodes.CompareOperand
        | nodes.CallExtension
        | nodes.CallExtensionAsync;

    export type ExpressionNode =
        | nodes.Literal
        | nodes.Symbol
        | nodes.Group
        | nodes.Array
        | nodes.Dict
        | nodes.FunCall
        | nodes.LookupVal
        | nodes.Filter
        | nodes.InlineIf
        | nodes.In
        | nodes.Is
        | nodes.Or
        | nodes.And
        | nodes.Not
        | nodes.Compare
        | nodes.Concat
        | nodes.Add
        | nodes.Sub
        | nodes.Mul
        | nodes.Div
        | nodes.FloorDiv
        | nodes.Mod
        | nodes.Pow
        | nodes.Neg
        | nodes.Pos;

    export namespace nodes {
        export type LiteralValue = string | number | boolean | RegExp | null;

        export class Node<TypeName extends string = 'Node', T extends string = string> extends Obj<TypeName> {
            constructor(lineno?: number, colno?: number);

            lineno: number | undefined;
            colno: number | undefined;

            /** `results` is mutated if passed */
            findAll<T extends Node<any, any>>(type: new (...args: any[]) => T, results?: T[]): T[];

            iterFields(func: (value: this[T & keyof this], name: T) => void): void;
        }

        export class Value<TypeName extends string = 'Value', ValueType extends LiteralValue = LiteralValue> extends Node<TypeName, 'value'> {
            constructor(lineno?: number, colno?: number, value?: ValueType | null);

            value: ValueType | null;
        }

        export class NodeList<TypeName extends string = 'NodeList', Child extends NodeType = NodeType> extends Node<TypeName, 'children'> {
            constructor(lineno?: number, colno?: number, children?: Child[] | null);

            children: Child[];

            addChild<T extends Child>(node: T): void;
        }

        export class Root extends NodeList<'Root'> {}

        export class Literal<TypeName extends string = 'Literal', ValueType extends LiteralValue = LiteralValue> extends Value<TypeName, ValueType> {}
        export class Symbol extends Value<'Symbol', string> {}

        export class Group extends NodeList<'Group'> {}
        export class Array extends NodeList<'Array'> {}

        export class Pair extends Node<'Pair', 'key' | 'value'> {
            constructor(lineno?: number, colno?: number, key?: NodeType | null, value?: NodeType | null);

            key: NodeType | null;
            value: NodeType | null;
        }

        export class Dict<TypeName extends string = 'Dict', T extends NodeType = nodes.Pair> extends NodeList<TypeName, T> {}

        export class LookupVal extends Node<'LookupVal', 'target' | 'val'> {
            constructor(lineno?: number, colno?: number, target?: NodeType | null, val?: NodeType | null);

            target: NodeType | null;
            val: NodeType | null;
        }

        export class If<TypeName extends string = 'If'> extends Node<TypeName, 'cond' | 'body' | 'else_'> {
            constructor(lineno?: number, colno?: number, cond?: unknown, body?: unknown, else_?: unknown);

            cond: unknown;
            body: unknown;
            else_: unknown;
        }

        export class IfAsync extends If<'IfAsync'> {}

        export class InlineIf extends Node<'InlineIf', 'cond' | 'body' | 'else_'> {
            constructor(lineno?: number, colno?: number, cond?: NodeType | null, body?: NodeType | null, else_?: NodeType | null);

            cond: NodeType | null;
            body: NodeType | null;
            else_: NodeType | null;
        }

        export class For<TypeName extends string = 'For'> extends Node<TypeName, 'arr' | 'name' | 'body' | 'else_'> {
            constructor(lineno?: number, colno?: number, arr?: unknown, name?: unknown, body?: unknown, else_?: unknown);
            arr: unknown;
            name: unknown;
            body: unknown;
            else_: unknown;
        }

        export class AsyncEach extends For<'AsyncEach'> {}
        export class AsyncAll extends For<'AsyncAll'> {}

        export class Macro<TypeName extends string = 'Macro'> extends Node<TypeName, 'name' | 'args' | 'body'> {
            constructor(lineno?: number, colno?: number, name?: unknown, args?: unknown, body?: unknown);

            name: unknown;
            args: unknown;
            body: unknown;
        }

        export class Caller extends Macro<'Caller'> {}

        export class Import extends Node<'Import', 'template' | 'target' | 'withContext'> {
            constructor(lineno?: number, colno?: number, template?: unknown, target?: unknown, withContext?: unknown);

            template: unknown;
            target: unknown;
            withContext: unknown;
        }

        export class FromImport extends Node<'FromImport', 'template' | 'names'| 'withContext'> {
            constructor(lineno?: number, colno?: number, template?: unknown, names?: nodes.NodeList | null, withContext?: unknown);

            template: unknown;
            names: nodes.NodeList;
            withContext: unknown;
        }

        export class FunCall<TypeName extends string = 'FunCall', T extends string = 'name' | 'args'> extends Node<TypeName, T> {
            constructor(lineno?: number, colno?: number, name?: NodeType | null, args?: nodes.NodeList | null);

            name: NodeType | null;
            args: nodes.NodeList | null;
        }
        export class Filter<TypeName extends string = 'Filter', T extends string = 'name' | 'args'> extends FunCall<TypeName, T> {
            constructor(lineno?: number, colno?: number, name?: nodes.Symbol | null, args?: nodes.NodeList | null);

            name: nodes.Symbol | null;
            args: nodes.NodeList | null;
        }
        export class FilterAsync extends Filter<'FilterAsync', 'name' | 'args' | 'symbol'> {
            constructor(lineno?: number, colno?: number, name?: nodes.Symbol | null, args?: nodes.NodeList | null, symbol?: nodes.Symbol | null);

            name: nodes.Symbol | null;
            args: nodes.NodeList | null;
            symbol: nodes.Symbol | null;
        }

        export class KeywordArgs extends Dict<'KeywordArgs', nodes.Pair> {}

        export class Block extends Node<'Block', 'name' | 'body'> {
            constructor(lineno?: number, colno?: number, name?: unknown, body?: unknown);

            name: unknown;
            body: unknown;
        }

        export class Super extends Node<'Super', 'blockName' | 'symbol'> {
            constructor(lineno?: number, colno?: number, blockName?: unknown, symbol?: unknown);

            blockName: unknown;
            symbol: unknown;
        }

        export interface TemplateRef<TypeName extends string = 'TemplateRef'> extends Node<TypeName, 'template'> {
            template: unknown;
        }

        export interface Extends extends TemplateRef<'Extends'> {}
        export class Extends extends Node<'Extends', 'template'> {
            constructor(lineno?: number, colno?: number, template?: unknown);
        }

        export class Include extends Node<'Include', 'template' | 'ignoreMissing'> {
            constructor(lineno?: number, colno?: number, template?: unknown, ignoreMissing?: unknown);

            template: unknown;
            ignoreMissing: unknown;
        }

        export class Set extends Node<'Set', 'targets' | 'value'> {
            constructor(lineno?: number, colno?: number, targets?: unknown, value?: unknown);

            targets: unknown;
            value: unknown;
        }

        export class Switch extends Node<'Switch', 'expr' | 'cases' | 'default'> {
            constructor(lineno?: number, colno?: number, expr?: unknown, cases?: unknown, default_?: unknown);

            expr: unknown;
            cases: unknown;
            default: unknown;
        }

        export class Case extends Node<'Case', 'cond' | 'body'> {
            constructor(lineno?: number, colno?: number, cond?: unknown, body?: unknown);

            cond: unknown;
            body: unknown;
        }

        export class Output<T extends NodeType = NodeType> extends NodeList<'Output', T> {}

        export class Capture extends Node<'Capture', 'body'> {
            constructor(lineno?: number, colno?: number, body?: unknown);

            body: unknown;
        }

        export class TemplateData extends Literal<'TemplateData', string> {}

        export interface UnaryOp<TypeName extends string = 'UnaryOp', T extends NodeType = NodeType> extends Node<TypeName, 'target'> {
            target: T | null;
        }

        export class BinOp<TypeName extends string = 'BinOp', Left extends NodeType = NodeType, Right extends NodeType = NodeType> extends Node<TypeName, 'left' | 'right'> {
            constructor(lineno?: number, colno?: number, left?: Left | null, right?: Right | null);

            left: Left | null;
            right: Right | null;
        }

        export class In extends BinOp<'In'> {}
        export class Is extends BinOp<'Is'> {}
        export class Or extends BinOp<'Or'> {}
        export class And extends BinOp<'And'> {}
        export interface Not extends UnaryOp<'Not'> {}
        export class Not extends Node<'Not', 'target'> {
            constructor(lineno?: number, colno?: number, target?: NodeType | null);
        }
        export class Add extends BinOp<'Add'> {}
        export class Concat extends BinOp<'Concat'> {}
        export class Sub extends BinOp<'Sub'> {}
        export class Mul extends BinOp<'Mul'> {}
        export class Div extends BinOp<'Div'> {}
        export class FloorDiv extends BinOp<'FloorDiv'> {}
        export class Mod extends BinOp<'Mod'> {}
        export class Pow extends BinOp<'Pow'> {}
        export interface Neg extends UnaryOp<'Neg'> {}
        export class Neg extends Node<'Neg', 'target'> {
            constructor(lineno?: number, colno?: number, target?: NodeType | null);
        }
        export interface Pos extends UnaryOp<'Pos'> {}
        export class Pos extends Node<'Pos', 'target'> {
            constructor(lineno?: number, colno?: number, target?: NodeType | null);
        }

        export class Compare extends Node<'Compare', 'expr' | 'ops'> {
            constructor(lineno?: number, colno?: number, expr?: unknown, ops?: unknown);

            expr: unknown;
            ops: unknown;
        }

        export class CompareOperand extends Node<'CompareOperand', 'expr' | 'type'> {
            constructor(lineno?: number, colno?: number, expr?: unknown, type?: unknown);

            expr: unknown;
            type: unknown;
        }

        export class CallExtension<TypeName extends string = 'CallExtension', T = Record<string, unknown>, P extends keyof T = keyof T> extends Node<TypeName, 'extName' | 'prop' | 'args' | 'contentArgs'> {
            constructor(ext: T, prop: P, args?: nodes.NodeList | null, contentArgs?: unknown[] | null);

            extName: string | Extension;
            prop: P;
            args: NodeList;
            contentArgs: unknown[];
            autoescape: unknown;
        }

        export class CallExtensionAsync<T = Record<string, unknown>, P extends keyof T = keyof T> extends CallExtension<'CallExtensionAsync', T, P> {
            constructor(ext: T, prop: P, args?: nodes.NodeList | null, contentArgs?: unknown[] | null);
        }
    }

    export namespace parser {
        export function parse(src: string, extensions?: Extension[], opts?: TokenizerOptions): nodes.Root;

        export class Parser {
            private tokens: Tokenizer;
            private peeked: Token | null;
            private breakOnBlocks: string[] | null;
            private dropLeadingWhitespace: boolean;
            private extensions: Extension[];

            constructor(tokens: Tokenizer);

            nextToken(withWhitespace?: boolean): Token | null;

            peekToken(): Token | null;

            pushToken(tok: Token): void;

            error(msg:string, lineno?: number, colno?: number): lib.TemplateError;

            fail(msg:string, lineno?: number, colno?: number): never;

            skip(type: TokenType): boolean;

            expect<T extends TokenType>(type: T): Token<T>;

            skipValue(type: TokenType, val: string): boolean;

            skipSymbol(val: string): boolean;

            advanceAfterBlockEnd(name?: string): Token;

            advanceAfterVariableEnd(): void;

            parseFor(): nodes.For | nodes.AsyncEach | nodes.AsyncAll;

            parseMacro(): nodes.Macro;

            parseCall(): nodes.Output;

            parseWithContext(): boolean | null;

            parseImport(): nodes.Import;

            parseFrom(): nodes.FromImport;

            parseBlock(): nodes.Block;

            parseExtends(): nodes.Extends;

            parseInclude(): nodes.Include;

            parseIf(): nodes.If | nodes.IfAsync;

            parseSet(): nodes.Set;

            parseSwitch(): nodes.Switch;

            parseStatement(): NodeType | null;

            parseRaw(tagName?: string): nodes.Output<nodes.TemplateData>;

            parsePostfix<T extends NodeType>(node: T): T | nodes.FunCall | nodes.LookupVal;

            parseExpression(): ExpressionNode;

            parseInlineIf(): ExpressionNode;

            parseOr(): ExpressionNode;
            parseAnd(): ExpressionNode;
            parseNot(): ExpressionNode;
            parseIn(): ExpressionNode;
            parseIs(): ExpressionNode;
            parseCompare(): ExpressionNode;
            parseConcat(): ExpressionNode;
            parseAdd(): ExpressionNode;
            parseSub(): ExpressionNode;
            parseMul(): ExpressionNode;
            parseDiv(): ExpressionNode;
            parseFloorDiv(): ExpressionNode;
            parseMod(): ExpressionNode;
            parsePow(): ExpressionNode;
            parseUnary(noFilters?: boolean): ExpressionNode;
            parsePrimary(noPostfix?: boolean): nodes.Literal | nodes.Symbol | nodes.Group | nodes.Array | nodes.Dict | nodes.FunCall | nodes.LookupVal;
            parseFilterName(): nodes.Symbol;
            parseFilterArgs(node: NodeType): NodeType[];
            parseFilter<T extends NodeType>(node: T): T | nodes.Filter;
            parseFilterStatement(): nodes.Output<nodes.Filter>;
            parseAggregate(): nodes.Group | nodes.Array | nodes.Dict | null;
            parseSignature(tolerant?: boolean, noParens?: boolean): nodes.NodeList | null;
            parseUntilBlocks(...blockName: string[]): nodes.NodeList;
            parseNodes(): NodeType[];
            parse(): nodes.NodeList;
            parseAsRoot(): nodes.Root;
        }
    }

    type TOKEN_STRING = 'string';
    type TOKEN_WHITESPACE = 'whitespace';
    type TOKEN_DATA = 'data';
    type TOKEN_BLOCK_START = 'block-start';
    type TOKEN_BLOCK_END = 'block-end';
    type TOKEN_VARIABLE_START = 'variable-start';
    type TOKEN_VARIABLE_END = 'variable-end';
    type TOKEN_COMMENT = 'comment';
    type TOKEN_LEFT_PAREN = 'left-paren';
    type TOKEN_RIGHT_PAREN = 'right-paren';
    type TOKEN_LEFT_BRACKET = 'left-bracket';
    type TOKEN_RIGHT_BRACKET = 'right-bracket';
    type TOKEN_LEFT_CURLY = 'left-curly';
    type TOKEN_RIGHT_CURLY = 'right-curly';
    type TOKEN_OPERATOR = 'operator';
    type TOKEN_COMMA = 'comma';
    type TOKEN_COLON = 'colon';
    type TOKEN_TILDE = 'tilde';
    type TOKEN_PIPE = 'pipe';
    type TOKEN_INT = 'int';
    type TOKEN_FLOAT = 'float';
    type TOKEN_BOOLEAN = 'boolean';
    type TOKEN_NONE = 'none';
    type TOKEN_SYMBOL = 'symbol';
    type TOKEN_SPECIAL = 'special';
    type TOKEN_REGEX = 'regex';

    export type TokenType =
        | TOKEN_STRING
        | TOKEN_WHITESPACE
        | TOKEN_DATA
        | TOKEN_BLOCK_START
        | TOKEN_BLOCK_END
        | TOKEN_VARIABLE_START
        | TOKEN_VARIABLE_END
        | TOKEN_COMMENT
        | TOKEN_LEFT_PAREN
        | TOKEN_RIGHT_PAREN
        | TOKEN_LEFT_BRACKET
        | TOKEN_RIGHT_BRACKET
        | TOKEN_LEFT_CURLY
        | TOKEN_RIGHT_CURLY
        | TOKEN_OPERATOR
        | TOKEN_COMMA
        | TOKEN_COLON
        | TOKEN_TILDE
        | TOKEN_PIPE
        | TOKEN_INT
        | TOKEN_FLOAT
        | TOKEN_BOOLEAN
        | TOKEN_NONE
        | TOKEN_SYMBOL
        | TOKEN_SPECIAL
        | TOKEN_REGEX;

    interface BaseToken {
        lineno: number;
        colno: number;
    }

    interface TokenRegex extends BaseToken {
        type: TOKEN_REGEX;
        value: {
            body: string;
            flags: string;
        }
    }

    /** Tokens with string as value */
    interface TokenString<T extends Exclude<TokenType, TOKEN_REGEX>> extends BaseToken {
        type: T;
        value: string;
    }

    type Token<T extends TokenType = TokenType> = T extends TOKEN_REGEX ? TokenRegex : TokenString<Exclude<T, TOKEN_REGEX>>;

    export interface TokenizerOptions {
        tags?: Partial<ConfigureOptionsTags>;
        trimBlocks?: boolean;
        lstripBlocks?: boolean;
    }

    export interface Tokenizer {
        isFinished(): boolean;
        nextToken(): Token | null;
        current(): string;
        /** returns what's left of the unparsed string */
        currentStr(): string;
        previous(): string;
        forwardN(n: number): void;
        forward(): void;
        backN(n: number): void;
        back(): void;
    }

    export namespace lexer {
        export function lex(src: string, opts?: TokenizerOptions): Tokenizer;

        export const TOKEN_STRING: TOKEN_STRING;
        export const TOKEN_WHITESPACE: TOKEN_WHITESPACE;
        export const TOKEN_DATA: TOKEN_DATA;
        export const TOKEN_BLOCK_START: TOKEN_BLOCK_START;
        export const TOKEN_BLOCK_END: TOKEN_BLOCK_END;
        export const TOKEN_VARIABLE_START: TOKEN_VARIABLE_START;
        export const TOKEN_VARIABLE_END: TOKEN_VARIABLE_END;
        export const TOKEN_COMMENT: TOKEN_COMMENT;
        export const TOKEN_LEFT_PAREN: TOKEN_LEFT_PAREN;
        export const TOKEN_RIGHT_PAREN: TOKEN_RIGHT_PAREN;
        export const TOKEN_LEFT_BRACKET: TOKEN_LEFT_BRACKET;
        export const TOKEN_RIGHT_BRACKET: TOKEN_RIGHT_BRACKET;
        export const TOKEN_LEFT_CURLY: TOKEN_LEFT_CURLY;
        export const TOKEN_RIGHT_CURLY: TOKEN_RIGHT_CURLY;
        export const TOKEN_OPERATOR: TOKEN_OPERATOR;
        export const TOKEN_COMMA: TOKEN_COMMA;
        export const TOKEN_COLON: TOKEN_COLON;
        export const TOKEN_TILDE: TOKEN_TILDE;
        export const TOKEN_PIPE: TOKEN_PIPE;
        export const TOKEN_INT: TOKEN_INT;
        export const TOKEN_FLOAT: TOKEN_FLOAT;
        export const TOKEN_BOOLEAN: TOKEN_BOOLEAN;
        export const TOKEN_NONE: TOKEN_NONE;
        export const TOKEN_SYMBOL: TOKEN_SYMBOL;
        export const TOKEN_SPECIAL: TOKEN_SPECIAL;
        export const TOKEN_REGEX: TOKEN_REGEX;
    }
}
