/**
 * @enum {string} GIGACHATScope
 * Перечисление доступных значений scope для получения токена.
 */
export enum GIGACHATScope {
  GIGACHAT_API_PERS = 'GIGACHAT_API_PERS',
  GIGACHAT_API_B2B  = 'GIGACHAT_API_B2B',
  GIGACHAT_API_CORP = 'GIGACHAT_API_CORP'
}

/**
 * Возможные значения моделей (без учета -preview).
 */
export type GigaChatModel = 'GigaChat' | 'GigaChat-Pro' | 'GigaChat-Max';

/**
 * Общий интерфейс ответа при получении токена.
 */
export interface TokenResponse {
  access_token: string;
  expires_at: number; // UNIX time (через 30 минут)
}

/**
 * Параметры, которые пользователь может передать в GigachatClient
 * для переопределения базовых URL и настроек.
 */
export interface GigachatClientOptions {
  /**
   * Адрес для получения токена, по умолчанию из config.oauthUrl
   */
  oauthUrl?: string;

  /**
   * Базовый URL для запросов chat, files и пр., по умолчанию из config.baseUrl
   */
  baseUrl?: string;

  /**
   * Нужно ли автоматически обновлять токен, если он истёк?
   * По умолчанию true
   */
  autoRefreshToken?: boolean;

  /**
   * Управляет проверкой SSL-сертификатов.
   * По умолчанию `true` (SSL проверяется).
   * Если `false`, проверка SSL отключается (небезопасно).
   */
  verifySSL?: boolean;
}

/**
 * Заголовки, необходимые при вызове getModelAnswer (пример).
 */
export interface ChatHeaders {
  xClientId: string;
  xRequestId: string;
  xSessionId: string;
}

/**
 * Структура одного сообщения в массиве messages (getModelAnswer).
 */
export interface ChatMessage {
  role: string; // 'user' | 'system' | 'assistant' ...
  content?: string;
  name?: string;
  function_call?: Record<string, unknown>;
}

/**
 * Тело запроса, отправляемого в метод getModelAnswer.
 */
export interface ChatRequest {
  model: GigaChatModel | `${GigaChatModel}-preview`;
  messages: ChatMessage[];
  attachments?: string[];
  function_call?: Record<string, unknown>;
  functions?: Record<string, unknown>[];
  temperature?: number;
  top_p?: number;
  n?: number; // DEPRECATED
  stream?: boolean;
  max_tokens?: number;
  repetition_penalty?: number;
  update_interval?: number;
}

/**
 * Ответ модели на запрос /chat/completions
 */
export interface ChatResponse {
  choices: Array<{
    message: {
      role?: string;
      content?: string;
      function_call?: Record<string, unknown>;
    };
    index: number;
    finish_reason: 'stop' | 'length' | 'function_call' | 'blacklist' | 'error';
  }>;
  created: number;
  model: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  object: string;
}

/**
 * Ответ сервера при загрузке файла (POST /files).
 */
export interface UploadFileResponse {
  bytes: number;       // Размер файла в байтах
  created_at: number;  // UNIX timestamp
  filename: string;    // Название файла
  id: string;          // UUIDv4, идентификатор файла
  object: string;      // "file"
  purpose: string;     // "general" (как в спецификации)
  access_policy?: string; // public или private
}