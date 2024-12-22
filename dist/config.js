"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
var types_1 = require("./types");
exports.config = {
    /**
     * URL для получения токена
     */
    oauthUrl: 'https://ngw.devices.sberbank.ru:9443/api/v2/oauth',
    /**
     * Базовый URL для остальных методов (chat, files, ...)
     */
    baseUrl: 'https://gigachat.devices.sberbank.ru/api/v1',
    /**
     * Значение scope по умолчанию
     */
    defaultScope: types_1.GIGACHATScope.GIGACHAT_API_PERS
};
