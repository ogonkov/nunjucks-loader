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

    export namespace nodes {
        export class Node<TypeName = 'Node', T extends string = string> extends Obj<TypeName> {
            constructor(lineno?: number, colno?: number);

            lineno: number | undefined;
            colno: number | undefined;

            /** `results` is mutated if passed */
            findAll<T extends (typeof Node | typeof CallExtension)>(type: T, results?: T[]): T[];

            iterFields(func: (value: this[T], name: T) => void);
        }

        export class Value<TypeName = 'Value'> extends Node<TypeName, 'value'> {
            constructor(lineno?: number, colno?: number, value: string);

            value: string;
        }

        export class NodeList<TypeName = 'NodeList', Child extends NodeType = NodeType> extends Node<TypeName, 'children'> {
            constructor(lineno?: number, colno?: number, children?: Child[]);

            children: Child[];

            addChild<T extends Child>(node: T): void;
        }

        export class Root extends NodeList<'Root'> {};

        export class Literal<TypeName = 'Literal'> extends Value<TypeName> {}
        export class Symbol extends Value<'Symbol'> {}

        export class Group extends NodeList<'Group'> {}
        export class Array extends NodeList<'Array'> {}

        export class Pair extends Node<'Pair', 'key' | 'value'> {
            constructor(lineno?: number, colno?: number, key?: nodes.Literal, value?: nodes.InlineIf);

            key: nodes.Literal;
            value: nodes.InlineIf;
        }

        export class Dict<TypeName = 'Dict', T extends NodeType = nodes.Pair> extends NodeList<TypeName, T> {}

        export class LookupVal extends Node<'LookupVal', 'target' | 'val'> {
            constructor(lineno?: number, colno?: number, target, val: nodes.Literal);

            target: unknown;
            val: nodes.Literal;
        }

        export class If<TypeName = 'If'> extends Node<TypeName, 'cond' | 'body' | 'else_'> {
            cond: unknown;
            body: unknown;
            else_: unknown;
        }

        export class IfAsync extends If<'IfAsync'> {}

        export class InlineIf extends Node<'InlineIf', 'cond' | 'body' | 'else_'> {
            constructor(lineno?: number, colno?: number, cond?: nodes.Or, body?: nodes.Or, else_?: nodes.Or | null);

            cond: nodes.Or | null;
            body: nodes.Or | null;
            else_: nodes.Or | null;
        }

        export class For<TypeName = 'For'> extends Node<TypeName, 'arr' | 'name' | 'body' | 'else_'> {
            constructor(lineno: number, colno: number, arr?: unknown, name?: unknown, body?: unknown, else_?: unknown);
            arr: unknown | undefined;
            name: unknown | undefined;
            body: unknown | undefined;
            else_: unknown | undefined;
        }

        export class AsyncEach extends For<'AsyncEach'> {}
        export class AsyncAll extends For<'AsyncAll'> {}

        export class Macro<TypeName = 'Macro'> extends Node<TypeName, 'name' | 'args' | 'body'> {}

        export class Caller extends Macro<'Caller'> {}

        export class Import extends Node<'Import', 'template' | 'target' | 'withContext'> {
            template: unknown;
            target: unknown;
            withContext: unknown;
        }

        export class FromImport extends Node<'FromImport', 'template' | 'names'| 'withContext'> {
            template: unknown;
            names: unknown;
            withContext: unknown;
        }

        export class FunCall<TypeName = 'FunCall', T = 'name' | 'args'> extends Node<TypeName, T> {
            constructor(lineno?: number, colno?: number, name?: nodes.Literal | nodes.Symbol, args?: nodes.NodeList | null);

            name: nodes.Literal | nodes.Symbol;
            args: nodes.NodeList | null;
        }
        export class Filter<TypeName = 'Filter', T = 'name' | 'args'> extends FunCall<TypeName, T> {
            constructor(lineno?: number, colno?: number, name: nodes.Symbol, args: nodes.NodeList);

            name: nodes.Literal | nodes.Symbol;
            args: nodes.NodeList;
        }
        export class FilterAsync extends FunCall<'FilterAsync', 'name' | 'args' | 'symbol'> {
            constructor(lineno?: number, colno?: number, name: nodes.Symbol, args: nodes.NodeList, symbol);

            name: nodes.Literal | nodes.Symbol;
            args: nodes.NodeList;
            symbol: nodes.Symbol;
        }

        export class KeywordArgs extends Dict<'KeywordArgs', nodes.Pair> {}

        export class Block extends Node<'Block', 'name' | 'body'> {
            name: unknown;
            body: unknown;
        }

        export class Super extends Node<'Super', 'blockName' | 'symbol'> {
            blockName: unknown;
            symbol: unknown;
        }

        export class TemplateRef<TypeName = 'TemplateRef'> extends Node<TypeName, 'template'> {
            template: unknown;
        }

        export class Extends extends TemplateRef<'Extends'> {}

        export class Include extends Node<'Include', 'template' | 'ignoreMissing'> {
            template: unknown;
            ignoreMissing: unknown;
        }

        export class Set extends Node<'Set', 'targets' | 'value'> {
            targets: unknown;
            value: unknown;
        }

        export class Switch extends Node<'Switch', 'expr' | 'cases' | 'default'> {
            expr: unknown;
            cases: unknown;
            default: unknown;
        }

        export class Case extends Node<'Case', 'cond' | 'body'> {
            cond: unknown;
            body: unknown;
        }

        export class Output<T extends NodeType = NodeType> extends NodeList<'Output', T> {}

        export class Capture extends Node<'Capture', 'body'> {
            body: unknown;
        }

        export class TemplateData extends Literal<'TemplateData'> {}

        export class UnaryOp<TypeName = 'UnaryOp', T extends NodeType = NodeType> extends Node<TypeName, 'target'> {
            constructor(lineno?: number, colno?: number, target?: T);

            target: T;
        }

        export class BinOp<TypeName = 'BinOp', Left extends NodeType = NodeType, Right extends NodeType = NodeType> extends Node<TypeName, 'left' | 'right'> {
            constructor(lineno?: number, colno?: number, left: Left, rigth: Right);

            left: Left;
            right: Right;
        }

        export class In extends BinOp<'In'> {}
        export class Is extends BinOp<'Is'> {}
        export class Or extends BinOp<'Or', nodes.And, nodes.And> {}
        export class And extends BinOp<'And', nodes.In | nodes.Not, nodes.In | nodes.Not> {}
        export class Not extends UnaryOp<'Not'> {}
        export class Add extends BinOp<'Add'> {}
        export class Concat extends BinOp<'Concat'> {}
        export class Sub extends BinOp<'Sub'> {}
        export class Mul extends BinOp<'Mul'> {}
        export class Div extends BinOp<'Div'> {}
        export class FloorDiv extends BinOp<'FloorDiv'> {}
        export class Mod extends BinOp<'Mod'> {}
        export class Pow extends BinOp<'Pow'> {}
        export class Neg extends UnaryOp<'Neg'> {}
        export class Pos extends UnaryOp<'Pos'> {}

        export class Compare extends Node<'Compare', 'expr' | 'ops'> {
            expr: unknown;
            ops: unknown;
        }

        export class CompareOperand extends Node<'CompareOperand', 'expr' | 'type'> {
            expr: unknown;
            type: unknown;
        }

        export class CallExtension<TypeName = 'CallExtension'> extends Node<TypeName, 'extName' | 'prop' | 'args' | 'contentArgs'> {
            constructor<T, P extends keyof T>(ext: T, prop: P, args?: nodes.NodeList, contentArgs?: unknown[]);

            extName: string | Extension;
            prop: P;
            args: NodeList;
            contentArgs: unknown[];
            autoescape: unknown;
        }

        export class CallExtensionAsync<T = unknown, P extends keyof T = string> extends CallExtension<'CallExtensionAsync'> {
            constructor(ext: T, prop: P, args?: nodes.NodeList, contentArgs?: unknown[]);
        }
    }

    export namespace parser {
        export function parse(src: string, extensions?: Extension[], opts?: TokenizerOptions): unknown;

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

            advanceAfterBlockEnd(name: string): Token;

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

            parseRaw(tagName: string): nodes.Output<nodes.TemplateData>;

            parsePostfix(node: NodeType): nodes.FunCall | nodes.LookupVal;

            parseExpression(): nodes.InlineIf;

            parseInlineIf(): nodes.InlineIf;

            parseOr(): nodes.Or;
            parseAnd(): nodes.And;
            parseNot(): nodes.In | nodes.Not;
            parseIn(): nodes.In | nodes.Not;
            parseIs(): nodes.Is | nodes.Not;
            parseCompare(): nodes.Compare | nodes.Concat;
            parseConcat(): nodes.Concat;
            parseAdd(): nodes.Add;
            parseSub(): nodes.Sub;
            parseMul(): nodes.Mul;
            parseDiv(): nodes.Div;
            parseFloorDiv(): nodes.FloorDiv;
            parseMod(): nodes.Mod;
            parsePow(): nodes.Pow;
            parseUnary(noFilters?: boolean): nodes.Neg | nodes.Pos | nodes.Literal | nodes.Symbol | nodes.Group | nodes.Array | nodes.Dict | nodes.FunCall | nodes.LookupVal | unknown;
            parsePrimary(noPostfix?: boolean): nodes.Literal | nodes.Symbol | nodes.Group | nodes.Array | nodes.Dict | nodes.FunCall | nodes.LookupVal;
            parseFilterName(): nodes.Symbol;
            parseFilterArgs(node: NodeType): NodeType[];
            parseFilter(node): nodes.Filter;
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
    interface TokenString<T extends TOKEN_WHITESPACE | TOKEN_BLOCK_END | TOKEN_VARIABLE_END | TOKEN_STRING | TOKEN_LEFT_PAREN | TOKEN_RIGHT_PAREN | TOKEN_LEFT_BRACKET | TOKEN_RIGHT_BRACKET | TOKEN_LEFT_CURLY | TOKEN_RIGHT_CURLY | TOKEN_COMMA | TOKEN_COLON | TOKEN_TILDE | TOKEN_PIPE | TOKEN_OPERATOR | TOKEN_FLOAT | TOKEN_INT | TOKEN_BOOLEAN | TOKEN_NONE | TOKEN_SYMBOL | TOKEN_BLOCK_START | TOKEN_VARIABLE_START | TOKEN_COMMENT | TOKEN_DATA> extends BaseToken {
        type: T;
        value: string;
    }

    type Token<T extends TokenType = TokenType> = T extends TOKEN_REGEX ? TokenRegex : TokenString<T>;

    export interface TokenizerOptions {
        tags?: Partial<ConfigureOptionsTags>;
        trimBlocks?: boolean;
        lstripBlocks?: boolean;
    }

    export class Tokenizer {
        constructor(src: string, opts?: TokenizerOptions);

        private str: string;
        private index: number;
        private len: number;
        private lineno: number;
        private colno: number;
        private in_code: boolean;
        private tags: ConfigureOptionsTags;
        private trimBlocks: boolean;
        private lstripBlocks: boolean;
        private _parseString(delimiter: string): string;
        private _extractMatching(breakOnMatch: boolean, charString: string): string | null;
        private _extract(): string | null;
        private _extractString(str: string): string | null;
        private _extractUntil(charString: string): string | null;
        private _matches(str: string): boolean | null;
        private _extractRegex(regex: RegExp): RegExpMatchArray | null;

        isFinished(): boolean;
        nextToken(): Token | null;
        curent(): string;
        /** returns what's left of the unparsed string */
        currentStr(): string;
        previous(): string;
        forwardN(n: number): void;
        forward(): void;
        backN(n: number): void;
        back(): void;
    }

    export namespace lexer {
        export function lex(src: string, opts: TokenizerOptions): Tokenizer;

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
