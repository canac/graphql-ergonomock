"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockLink = exports.ErgonoMockedProvider = exports.ergonomock = void 0;
var mock_1 = require("./mock");
Object.defineProperty(exports, "ergonomock", { enumerable: true, get: function () { return mock_1.ergonomock; } });
var ErgonoMockedProvider_1 = require("./apollo/ErgonoMockedProvider");
Object.defineProperty(exports, "ErgonoMockedProvider", { enumerable: true, get: function () { return __importDefault(ErgonoMockedProvider_1).default; } });
var MockLink_1 = require("./apollo/MockLink");
Object.defineProperty(exports, "MockLink", { enumerable: true, get: function () { return __importDefault(MockLink_1).default; } });
//# sourceMappingURL=index.js.map