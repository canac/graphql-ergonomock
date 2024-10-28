"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var client_1 = require("@apollo/client");
var mock_1 = require("../mock");
var fast_json_stable_stringify_1 = __importDefault(require("fast-json-stable-stringify"));
var MockLink = /** @class */ (function (_super) {
    __extends(MockLink, _super);
    function MockLink(schema, mockMap, options) {
        if (options === void 0) { options = { addTypename: true }; }
        var _this = _super.call(this) || this;
        _this.schema = schema;
        _this.mockMap = mockMap;
        _this.options = options;
        return _this;
    }
    MockLink.prototype.request = function (operation) {
        var _this = this;
        // Find mock by operation name
        // TODO: potentially merge multiple mocks with the same name.
        var mock;
        if (this.mockMap[operation.operationName]) {
            mock = this.mockMap[operation.operationName];
            //  If mock is a function, call it with variables.
            if (typeof mock === "function") {
                mock = mock(operation);
            }
        }
        var seed = fast_json_stable_stringify_1.default({
            query: operation.query,
            variables: operation.variables,
            operationName: operation.operationName,
        });
        // Call ergonomock() to get results
        var result = mock_1.ergonomock(this.schema, operation.query, {
            mocks: mock || {},
            seed: seed,
            variables: operation.variables,
            resolvers: this.options.resolvers,
        });
        // Return Observer to be compatible with apollo
        return new client_1.Observable(function (observer) {
            Promise.resolve(result).then(function (r) {
                if (r) {
                    observer.next(r);
                }
                // Call onCall with the right signature before calling observer.next(result)
                if (_this.options.onCall) {
                    _this.options.onCall({ operation: operation, response: r });
                }
                observer.complete();
            });
        });
    };
    return MockLink;
}(client_1.ApolloLink));
exports.default = MockLink;
//# sourceMappingURL=MockLink.js.map