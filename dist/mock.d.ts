import { GraphQLSchema, GraphQLFieldResolver, DocumentNode } from "graphql";
declare type ErgonoMockLeaf = string | boolean | number | null | Error | GraphQLFieldResolver<any, any>;
export declare type ErgonoMockShape = {
    [k: string]: ErgonoMockShape | ErgonoMockLeaf | Array<ErgonoMockShape | ErgonoMockLeaf>;
};
export declare type DefaultMockResolvers = {
    [k: string]: GraphQLFieldResolver<any, any>;
};
export declare type ErgonomockOptions = {
    mocks?: ErgonoMockShape;
    seed?: string;
    variables?: Record<string, any>;
    resolvers?: DefaultMockResolvers;
};
export declare function ergonomock(inputSchema: GraphQLSchema | DocumentNode, query: string | DocumentNode, options?: ErgonomockOptions): import("graphql/jsutils/PromiseOrValue").PromiseOrValue<import("graphql").ExecutionResult>;
export {};
