import React from "react";
import { GraphQLSchema, DocumentNode } from "graphql";
import { DefaultOptions, ApolloCache, ApolloLink } from "@apollo/client";
import { ApolloErgonoMockMap, MockLinkCallHandler } from "./MockLink";
import { DefaultMockResolvers } from '../mock';
export interface ErgonoMockedProviderProps<TSerializedCache = {}> {
    schema: GraphQLSchema | DocumentNode;
    onCall?: MockLinkCallHandler;
    mocks?: ApolloErgonoMockMap;
    addTypename?: boolean;
    defaultOptions?: DefaultOptions;
    cache?: ApolloCache<TSerializedCache>;
    resolvers?: DefaultMockResolvers;
    children?: React.ReactElement;
    link?: ApolloLink;
}
export default function ErgonoMockedProvider(props: ErgonoMockedProviderProps): JSX.Element | null;
