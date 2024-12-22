import { GIGACHATScope } from './types';
export declare const config: {
    /**
     * URL для получения токена
     */
    oauthUrl: string;
    /**
     * Базовый URL для остальных методов (chat, files, ...)
     */
    baseUrl: string;
    /**
     * Значение scope по умолчанию
     */
    defaultScope: GIGACHATScope;
};
