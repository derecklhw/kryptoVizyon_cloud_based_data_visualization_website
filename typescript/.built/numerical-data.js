"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNumericalData = void 0;
var axios_1 = __importDefault(require("axios"));
var dotenv_1 = __importDefault(require("dotenv"));
var uuid_1 = require("uuid");
dotenv_1.default.config();
var crypto_compare_api_key = process.env.CRYPTO_COMPARE_API_KEY;
var QUERY_LIMIT = 499;
/*
* This function retrieves historical data for a given cryptocurrency symbol
* @param {string} symbol - The symbol of the cryptocurrency to retrieve data for
* @returns {Promise<WriteRequest[]>} - An array of WriteRequest objects
*/
var getNumericalData = function (symbol) { return __awaiter(void 0, void 0, void 0, function () {
    var apiUrl, response, data, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                apiUrl = "https://min-api.cryptocompare.com/data/v2/histohour?fsym=".concat(symbol, "&tsym=USD&limit=").concat(QUERY_LIMIT, "&api_key=").concat(crypto_compare_api_key);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, axios_1.default.get(apiUrl)];
            case 2:
                response = _a.sent();
                data = response.data.Data;
                // If there is no data, return an empty array
                if (!data.Data || data.Data.length === 0)
                    return [2 /*return*/, []];
                // Preprocess and return the data
                return [2 /*return*/, preprocess(data.Data, symbol)];
            case 3:
                error_1 = _a.sent();
                throw new Error('Failed to fetch numerical data');
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.getNumericalData = getNumericalData;
/*
* This function preprocesses the data retrieved from the API
* @param {CryptoData[]} historicalData - The data retrieved from the API
* @param {string} symbol - The symbol of the cryptocurrency
* @returns {WriteRequest[]} - An array of WriteRequest objects
*/
var preprocess = function (historicalData, symbol) {
    return historicalData.map(function (data) {
        return {
            PutRequest: {
                Item: {
                    'id': { S: (0, uuid_1.v4)() },
                    'timestamp': { N: data.time.toString() },
                    'symbol': { S: symbol },
                    'open': { N: data.open.toString() },
                    'high': { N: data.high.toString() },
                    'low': { N: data.low.toString() },
                    'close': { N: data.close.toString() }
                }
            }
        };
    });
};
//# sourceMappingURL=numerical-data.js.map