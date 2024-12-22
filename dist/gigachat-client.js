"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
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
exports.GigachatClient = void 0;
var axios_1 = __importDefault(require("axios"));
var form_data_1 = __importDefault(require("form-data"));
var uuid_1 = require("uuid");
var https = __importStar(require("https")); // нужен для настройки rejectUnauthorized
var config_1 = require("./config");
/**
 * Основной класс для взаимодействия с GigaChat API.
 */
var GigachatClient = /** @class */ (function () {
    /**
     * @param authorizationKey Base64-кодированная строка "client_id:client_secret"
     * @param options Опции: urls, autoRefreshToken, verifySSL и т.д.
     */
    function GigachatClient(authorizationKey, options) {
        var _a, _b, _c, _d;
        this.authorizationKey = authorizationKey;
        this.oauthUrl = (_a = options === null || options === void 0 ? void 0 : options.oauthUrl) !== null && _a !== void 0 ? _a : config_1.config.oauthUrl;
        this.baseUrl = (_b = options === null || options === void 0 ? void 0 : options.baseUrl) !== null && _b !== void 0 ? _b : config_1.config.baseUrl;
        this.autoRefreshToken = (_c = options === null || options === void 0 ? void 0 : options.autoRefreshToken) !== null && _c !== void 0 ? _c : true;
        this.verifySSL = (_d = options === null || options === void 0 ? void 0 : options.verifySSL) !== null && _d !== void 0 ? _d : true;
    }
    /**
     * Получить токен (POST /api/v2/oauth)
     * @param scope - GIGACHAT_API_PERS | GIGACHAT_API_B2B | GIGACHAT_API_CORP
     */
    GigachatClient.prototype.getToken = function () {
        return __awaiter(this, arguments, void 0, function (scope) {
            var rqUID, response, error_1;
            if (scope === void 0) { scope = config_1.config.defaultScope; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        rqUID = (0, uuid_1.v4)();
                        return [4 /*yield*/, axios_1.default.post(this.oauthUrl, new URLSearchParams({ scope: scope }).toString(), {
                                headers: {
                                    'Content-Type': 'application/x-www-form-urlencoded',
                                    Accept: 'application/json',
                                    RqUID: rqUID,
                                    Authorization: "Bearer ".concat(this.authorizationKey)
                                },
                                httpsAgent: !this.verifySSL
                                    ? new https.Agent({ rejectUnauthorized: false })
                                    : undefined
                            })];
                    case 1:
                        response = _a.sent();
                        this.tokenData = response.data;
                        return [2 /*return*/, response.data];
                    case 2:
                        error_1 = _a.sent();
                        throw error_1;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Проверяет, не истёк ли токен. Если истёк — перезапрашивает (при autoRefreshToken=true).
     */
    GigachatClient.prototype.ensureValidToken = function () {
        return __awaiter(this, void 0, void 0, function () {
            var nowSec;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.autoRefreshToken)
                            return [2 /*return*/];
                        if (!!this.tokenData) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.getToken()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                    case 2:
                        nowSec = Math.floor(Date.now() / 1000);
                        if (!(this.tokenData.expires_at <= nowSec)) return [3 /*break*/, 4];
                        // истёк
                        return [4 /*yield*/, this.getToken()];
                    case 3:
                        // истёк
                        _a.sent();
                        _a.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Общий метод для выполнения любого запроса, требующего Bearer-токен.
     * Если при первом запросе получим 401, и autoRefreshToken=true,
     * мы один раз обновляем токен и повторяем запрос.
     */
    GigachatClient.prototype.requestWithToken = function (config_2) {
        return __awaiter(this, arguments, void 0, function (config, retryCount) {
            var headers, httpsAgent, response, error_2, status_1;
            var _a, _b, _c, _d;
            if (retryCount === void 0) { retryCount = 0; }
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0: 
                    // Следим, чтобы токен был валиден
                    return [4 /*yield*/, this.ensureValidToken()];
                    case 1:
                        // Следим, чтобы токен был валиден
                        _e.sent();
                        headers = (_a = config.headers) !== null && _a !== void 0 ? _a : {};
                        headers['Authorization'] = "Bearer ".concat((_c = (_b = this.tokenData) === null || _b === void 0 ? void 0 : _b.access_token) !== null && _c !== void 0 ? _c : '');
                        httpsAgent = !this.verifySSL
                            ? new https.Agent({ rejectUnauthorized: false })
                            : undefined;
                        _e.label = 2;
                    case 2:
                        _e.trys.push([2, 4, , 8]);
                        return [4 /*yield*/, axios_1.default.request(__assign(__assign({}, config), { headers: headers, httpsAgent: httpsAgent }))];
                    case 3:
                        response = _e.sent();
                        return [2 /*return*/, response.data];
                    case 4:
                        error_2 = _e.sent();
                        if (!axios_1.default.isAxiosError(error_2)) return [3 /*break*/, 7];
                        status_1 = (_d = error_2.response) === null || _d === void 0 ? void 0 : _d.status;
                        if (!(status_1 === 401 && retryCount < 1 && this.autoRefreshToken)) return [3 /*break*/, 6];
                        // возможно, токен всё же протух
                        return [4 /*yield*/, this.getToken()];
                    case 5:
                        // возможно, токен всё же протух
                        _e.sent();
                        return [2 /*return*/, this.requestWithToken(config, retryCount + 1)];
                    case 6:
                        // Иначе обрабатываем коды
                        switch (status_1) {
                            case 400:
                                throw new Error('400 Bad Request: Некорректный формат запроса');
                            case 404:
                                throw new Error('404 Not Found: Возможно, указан неверный идентификатор или URL');
                            case 422:
                                throw new Error('422 Unprocessable Entity: Ошибка валидации полей');
                            case 429:
                                throw new Error('429 Too Many Requests: Лимит запросов превышен');
                            case 500:
                                throw new Error('500 Internal Server Error: Внутренняя ошибка сервера');
                            // Можно обрабатывать и другие коды по необходимости
                        }
                        _e.label = 7;
                    case 7: 
                    // Если это не axios-ошибка или код ответа не перечислен выше — пробрасываем
                    throw error_2;
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Запрос к модели (chat/completions):
     * POST https://gigachat.devices.sberbank.ru/api/v1/chat/completions
     *
     * @param headers - заголовки (X-Client-ID, X-Request-ID, X-Session-ID)
     * @param body - данные запроса: model, messages, attachments и т.д.
     */
    GigachatClient.prototype.getModelAnswer = function (headers, body) {
        return __awaiter(this, void 0, void 0, function () {
            var url, reqConfig;
            return __generator(this, function (_a) {
                url = "".concat(this.baseUrl, "/chat/completions");
                reqConfig = {
                    method: 'POST',
                    url: url,
                    data: body,
                    headers: {
                        'X-Client-ID': headers.xClientId,
                        'X-Request-ID': headers.xRequestId,
                        'X-Session-ID': headers.xSessionId,
                        'Content-Type': 'application/json'
                    }
                };
                return [2 /*return*/, this.requestWithToken(reqConfig)];
            });
        });
    };
    /**
     * Загрузить файл (текстовый или изображение) в хранилище GigaChat.
     * POST https://gigachat.devices.sberbank.ru/api/v1/files
     *
     * @param fileData - содержимое файла (Buffer, Stream и т.д.)
     * @param filename - имя файла (например, "mydocument.pdf")
     * @param contentType - MIME-тип (например, "application/pdf")
     * @param purpose - назначение (по умолчанию "general")
     * @param accessPolicy - "private" (по умолчанию) или "public"
     * @returns UploadFileResponse - данные о загруженном файле (id, bytes, etc.)
     *
     * @example
     * ```ts
     * const fileBuffer = fs.readFileSync('mydoc.pdf');
     * const response = await client.uploadFile(fileBuffer, 'mydoc.pdf', 'application/pdf');
     * console.log('Uploaded file ID:', response.id);
     * ```
     */
    GigachatClient.prototype.uploadFile = function (fileData_1, filename_1, contentType_1) {
        return __awaiter(this, arguments, void 0, function (fileData, filename, contentType, purpose, accessPolicy) {
            var form, url, reqConfig;
            if (purpose === void 0) { purpose = 'general'; }
            if (accessPolicy === void 0) { accessPolicy = 'private'; }
            return __generator(this, function (_a) {
                form = new form_data_1.default();
                form.append('file', fileData, { filename: filename, contentType: contentType });
                form.append('purpose', purpose);
                form.append('access_policy', accessPolicy);
                url = "".concat(this.baseUrl, "/files");
                reqConfig = {
                    method: 'POST',
                    url: url,
                    data: form,
                    headers: __assign({}, form.getHeaders() // включает boundary
                    )
                };
                return [2 /*return*/, this.requestWithToken(reqConfig)];
            });
        });
    };
    return GigachatClient;
}());
exports.GigachatClient = GigachatClient;
