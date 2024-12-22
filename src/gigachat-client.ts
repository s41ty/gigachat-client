import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import FormData from 'form-data';
import { v4 as uuidv4 } from 'uuid';
import * as https from 'https'; // нужен для настройки rejectUnauthorized

import { config } from './config';
import {
  GIGACHATScope,
  GigachatClientOptions,
  TokenResponse,
  ChatHeaders,
  ChatRequest,
  ChatResponse,
  UploadFileResponse
} from './types';

/**
 * Основной класс для взаимодействия с GigaChat API.
 */
export class GigachatClient {
  private authorizationKey: string;

  private oauthUrl: string; // https://ngw.devices.sberbank.ru:9443/api/v2/oauth
  private baseUrl: string;  // https://gigachat.devices.sberbank.ru/api/v1
  private autoRefreshToken: boolean;
  private verifySSL: boolean;
  private tokenData?: TokenResponse; // текущий токен + время истечения

  /**
   * @param authorizationKey Base64-кодированная строка "client_id:client_secret"
   * @param options Опции: urls, autoRefreshToken, verifySSL и т.д.
   */
  constructor(authorizationKey: string, options?: GigachatClientOptions) {
    this.authorizationKey = authorizationKey;
    this.oauthUrl = options?.oauthUrl ?? config.oauthUrl;
    this.baseUrl = options?.baseUrl ?? config.baseUrl;
    this.autoRefreshToken = options?.autoRefreshToken ?? true;
    this.verifySSL = options?.verifySSL ?? true;
  }

  /**
   * Получить токен (POST /api/v2/oauth)
   * @param scope - GIGACHAT_API_PERS | GIGACHAT_API_B2B | GIGACHAT_API_CORP
   */
  public async getToken(scope: GIGACHATScope = config.defaultScope): Promise<TokenResponse> {
    try {
      const rqUID = uuidv4();

      const response = await axios.post<TokenResponse>(
        this.oauthUrl,
        new URLSearchParams({ scope }).toString(),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Accept: 'application/json',
            RqUID: rqUID,
            Authorization: `Bearer ${this.authorizationKey}`
          },
          httpsAgent: !this.verifySSL
            ? new https.Agent({ rejectUnauthorized: false })
            : undefined
        }
      );

      this.tokenData = response.data;
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Проверяет, не истёк ли токен. Если истёк — перезапрашивает (при autoRefreshToken=true).
   */
  private async ensureValidToken(): Promise<void> {
    if (!this.autoRefreshToken) return;

    // Если токена нет — запросим с дефолтным scope
    if (!this.tokenData) {
      await this.getToken();
      return;
    }

    const nowSec = Math.floor(Date.now() / 1000);
    if (this.tokenData.expires_at <= nowSec) {
      // истёк
      await this.getToken();
    }
  }

  /**
   * Общий метод для выполнения любого запроса, требующего Bearer-токен.
   * Если при первом запросе получим 401, и autoRefreshToken=true,
   * мы один раз обновляем токен и повторяем запрос.
   */
  private async requestWithToken<T>(
    config: AxiosRequestConfig,
    retryCount = 0
  ): Promise<T> {
    // Следим, чтобы токен был валиден
    await this.ensureValidToken();

    // Добавляем заголовок Authorization: Bearer <access_token>
    const headers = config.headers ?? {};
    headers['Authorization'] = `Bearer ${this.tokenData?.access_token ?? ''}`;

    // Если verifySSL=false, отключаем проверку SSL
    const httpsAgent = !this.verifySSL
      ? new https.Agent({ rejectUnauthorized: false })
      : undefined;

    try {
      const response = await axios.request<T>({
        ...config,
        headers,
        httpsAgent
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;

        // Если 401 и мы ещё не делали повторный запрос:
        if (status === 401 && retryCount < 1 && this.autoRefreshToken) {
          // возможно, токен всё же протух
          await this.getToken();
          return this.requestWithToken<T>(config, retryCount + 1);
        }

        // Иначе обрабатываем коды
        switch (status) {
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
      }
      // Если это не axios-ошибка или код ответа не перечислен выше — пробрасываем
      throw error;
    }
  }

  /**
   * Запрос к модели (chat/completions):
   * POST https://gigachat.devices.sberbank.ru/api/v1/chat/completions
   *
   * @param headers - заголовки (X-Client-ID, X-Request-ID, X-Session-ID)
   * @param body - данные запроса: model, messages, attachments и т.д.
   */
  public async getModelAnswer(headers: ChatHeaders, body: ChatRequest): Promise<ChatResponse> {
    const url = `${this.baseUrl}/chat/completions`;
    const reqConfig: AxiosRequestConfig = {
      method: 'POST',
      url,
      data: body,
      headers: {
        'X-Client-ID': headers.xClientId,
        'X-Request-ID': headers.xRequestId,
        'X-Session-ID': headers.xSessionId,
        'Content-Type': 'application/json'
      }
    };

    return this.requestWithToken<ChatResponse>(reqConfig);
  }

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
  public async uploadFile(
    fileData: Buffer,
    filename: string,
    contentType: string,
    purpose = 'general',
    accessPolicy: 'public' | 'private' = 'private'
  ): Promise<UploadFileResponse> {
    // Формируем form-data
    const form = new FormData();
    form.append('file', fileData, { filename, contentType });
    form.append('purpose', purpose);
    form.append('access_policy', accessPolicy);

    const url = `${this.baseUrl}/files`;
    const reqConfig: AxiosRequestConfig = {
      method: 'POST',
      url,
      data: form,
      headers: {
        ...form.getHeaders() // включает boundary
      }
    };

    return this.requestWithToken<UploadFileResponse>(reqConfig);
  }
}