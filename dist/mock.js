"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ergonomock = void 0;
var graphql_1 = require("graphql");
var random_1 = __importDefault(require("./utils/random"));
var getRandomElement_1 = __importDefault(require("./utils/getRandomElement"));
var forEachFieldInQuery_1 = __importDefault(require("./utils/forEachFieldInQuery"));
var defaultMockMap = new Map();
defaultMockMap.set("Int", function () { return random_1.default.integer(); });
defaultMockMap.set("Float", function () { return random_1.default.float(); });
defaultMockMap.set("String", function () { return random_1.default.words(); });
defaultMockMap.set("Boolean", function () { return random_1.default.boolean(); });
defaultMockMap.set("ID", function () { return "" + random_1.default.integer(10000000, 100000); });
function ergonomock(inputSchema, query, options) {
    if (options === void 0) { options = {}; }
    var mocks = options.mocks, seed = options.seed, _a = options.variables, variables = _a === void 0 ? {} : _a;
    var schema = inputSchema;
    // Guard rails for schema & query
    if (!graphql_1.isSchema(inputSchema)) {
        try {
            schema = graphql_1.buildASTSchema(inputSchema);
            if (!graphql_1.isSchema(schema)) {
                throw new Error("Ergonomock requires a valid GraphQL schema.");
            }
        }
        catch (err) {
            throw new Error("Ergonomock requires a valid GraphQL schema.");
        }
    }
    if (!query) {
        throw new Error("Ergonomock requires a GraphQL query, either as a string or DocumentNode.");
    }
    var document = typeof query === "string" ? graphql_1.parse(query) : query;
    var errors = graphql_1.validate(schema, document);
    if (errors.length) {
        throw errors[0];
    }
    random_1.default.seed(seed);
    var resolverOverrides = new Map();
    if (options.resolvers) {
        Object.entries(options.resolvers).forEach(function (_a) {
            var type = _a[0], resolver = _a[1];
            return resolverOverrides.set(type, resolver);
        });
    }
    var mockResolverFunction = function (type, fieldName) {
        // order of precendence for mocking:
        // 1. if the object passed in already has fieldName, just use that value
        // --> if it's a function, that becomes your resolver
        // --> if it's a value, the mock resolver will return that
        // 2. if the nullableType is a list, recurse
        // 3. if there's no mock defined, use the default mocks for this type
        return function (root, args, context, info) {
            // nullability doesn't matter for the purpose of mocking.
            var fieldType = graphql_1.getNullableType(type);
            if (root && fieldName && typeof root[fieldName] !== "undefined") {
                var mock = root[fieldName];
                if (typeof mock === "function") {
                    return mock(root, args, context, info);
                }
                return root[fieldName];
            }
            // Lists
            if (fieldType instanceof graphql_1.GraphQLList) {
                return random_1.default
                    .list()
                    .map(function (_) { return mockResolverFunction(fieldType.ofType)(root, args, context, info); });
            }
            // Unions and interfaces
            if (fieldType instanceof graphql_1.GraphQLUnionType || fieldType instanceof graphql_1.GraphQLInterfaceType) {
                var implementationType = void 0;
                var possibleTypes = schema.getPossibleTypes(fieldType);
                implementationType = getRandomElement_1.default(possibleTypes);
                return Object.assign({ __typename: implementationType }, mockResolverFunction(implementationType)(root, args, context, info));
            }
            if (resolverOverrides.has(fieldType.name)) {
                return resolverOverrides.get(fieldType.name)(root, args, context, info);
            }
            // Default mock for enums
            if (fieldType instanceof graphql_1.GraphQLEnumType) {
                return getRandomElement_1.default(fieldType.getValues()).value;
            }
            // Automock object types
            if (graphql_1.isObjectType(fieldType)) {
                return { __typename: fieldType.name };
            }
            // Mock default scalars
            if (defaultMockMap.has(fieldType.name)) {
                return defaultMockMap.get(fieldType.name)(root, args, context, info);
            }
        };
    };
    forEachFieldInQuery_1.default(schema, document, function (field, typeName, fieldName) {
        var _a, _b;
        assignResolveType(field.type); // assign the default .resolveType resolver.
        var mockResolver;
        // we have to handle the root mutation and root query types differently,
        // because no resolver is called at the root.
        var isOnQueryType = !!(schema.getQueryType() && ((_a = schema.getQueryType()) === null || _a === void 0 ? void 0 : _a.name) === typeName);
        var isOnMutationType = !!(schema.getMutationType() && ((_b = schema.getMutationType()) === null || _b === void 0 ? void 0 : _b.name) === typeName);
        if (isOnQueryType || isOnMutationType) {
            mockResolver = function (root, args, context, info) {
                return mockResolverFunction(field.type, fieldName)(mocks || {}, args, context, info);
            };
        }
        else {
            mockResolver = mockResolverFunction(field.type, fieldName);
        }
        field.resolve = mockResolver;
    });
    var resp = graphql_1.execute({
        schema: schema,
        document: document,
        rootValue: {},
        contextValue: {},
        variableValues: variables,
    });
    return resp;
}
exports.ergonomock = ergonomock;
function assignResolveType(type) {
    var fieldType = graphql_1.getNullableType(type);
    var namedFieldType = graphql_1.getNamedType(fieldType);
    if (namedFieldType instanceof graphql_1.GraphQLUnionType ||
        namedFieldType instanceof graphql_1.GraphQLInterfaceType) {
        // the default `resolveType` always returns null. We add a fallback
        // resolution that works with how unions and interface are mocked
        namedFieldType.resolveType = function (data, context, info) {
            return info.schema.getType(data.__typename);
        };
    }
}
//# sourceMappingURL=mock.js.map