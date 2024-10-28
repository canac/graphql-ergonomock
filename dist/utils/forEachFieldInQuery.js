"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var graphql_1 = require("graphql");
var execute_1 = require("graphql/execution/execute");
function forEachFieldInQuery(schema, document, fn) {
    var _a;
    var typeInfo = new graphql_1.TypeInfo(schema);
    graphql_1.visit(document, graphql_1.visitWithTypeInfo(typeInfo, (_a = {},
        _a[graphql_1.Kind.FIELD] = function (node) {
            var fieldName = node.name.value;
            if (fieldName === "__typename") {
                return;
            }
            var parentType = typeInfo.getParentType();
            // const fieldType = typeInfo.getType(); // the return type of this field.
            if (graphql_1.isAbstractType(parentType)) {
                var possibleTypes = schema.getPossibleTypes(parentType);
                possibleTypes.forEach(function (t) {
                    var fieldDef = execute_1.getFieldDef(schema, t, fieldName);
                    if (fieldDef) {
                        fn(fieldDef, t.name, fieldName);
                    }
                });
            }
            if (graphql_1.isObjectType(parentType)) {
                var parentFields = parentType.getFields();
                var fieldDef = parentFields[node.name.value]; // the schame field definition
                fn(fieldDef, parentType.name, fieldName);
            }
        },
        _a)));
}
exports.default = forEachFieldInQuery;
//# sourceMappingURL=forEachFieldInQuery.js.map