import { GIGACHATScope } from './types';

export const config = {
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
  defaultScope: GIGACHATScope.GIGACHAT_API_PERS
};