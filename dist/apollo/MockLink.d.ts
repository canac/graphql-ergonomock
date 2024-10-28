/// <reference types="zen-observable" />
import { ApolloLink, Operation, Observable, FetchResult } from "@apollo/client";
import { ErgonoMockShape, DefaultMockResolvers } from "../mock";
import { GraphQLSchema, ExecutionResult, DocumentNode } from "graphql";
declare type MockLinkOptions = {
    addTypename: Boolean;
    onCall?: MockLinkCallHandler;
    resolvers?: DefaultMockResolvers;
};
export declare type ApolloErgonoMockMap = Record<string, ErgonoMockShape | ((operation: Operation) => ErgonoMockShape | null)>;
declare type MockLinkCallArg = {
    operation: Operation;
    response: ExecutionResult;
};
export declare type MockLinkCallHandler = (spyObj: MockLinkCallArg) => void;
export default class MockLink extends ApolloLink {
    private schema;
    private mockMap;
    private options;
    constructor(schema: GraphQLSchema | DocumentNode, mockMap: ApolloErgonoMockMap, options?: MockLinkOptions);
    request(operation: Operation): Observable<FetchResult> | null;
}
export {};
