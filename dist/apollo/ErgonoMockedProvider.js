"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importDefault(require("react"));
var client_1 = require("@apollo/client");
var MockLink_1 = __importDefault(require("./MockLink"));
function ErgonoMockedProvider(props) {
    var mocks = props.mocks, _a = props.addTypename, addTypename = _a === void 0 ? true : _a, onCall = props.onCall, link = props.link, cache = props.cache, resolvers = props.resolvers, defaultOptions = props.defaultOptions, schema = props.schema;
    var _b = react_1.default.useState(), client = _b[0], setClient = _b[1];
    react_1.default.useEffect(function () {
        var c = new client_1.ApolloClient({
            cache: cache || new client_1.InMemoryCache({ addTypename: addTypename }),
            defaultOptions: defaultOptions,
            link: link || new MockLink_1.default(schema, mocks || {}, { addTypename: addTypename, onCall: onCall, resolvers: resolvers }),
        });
        setClient(c);
        return function () { return client && client.stop(); };
    }, [mocks, addTypename, link, cache, defaultOptions]);
    if (!client) {
        return null;
    }
    return react_1.default.createElement(client_1.ApolloProvider, { client: client }, props.children);
}
exports.default = ErgonoMockedProvider;
//# sourceMappingURL=ErgonoMockedProvider.js.map