import { GraphQLField, GraphQLSchema, DocumentNode } from "graphql";
declare type IteratorFn = (fieldDef: GraphQLField<any, any>, parentType: string, fieldName: string) => void;
export default function forEachFieldInQuery(schema: GraphQLSchema, document: DocumentNode, fn: IteratorFn): void;
export {};
