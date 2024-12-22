import { GIGACHATScope, GigachatClientOptions, TokenResponse, ChatHeaders, ChatRequest, ChatResponse, UploadFileResponse } from './types';
/**
 * Основной класс для взаимодействия с GigaChat API.
 */
export declare class GigachatClient {
    private authorizationKey;
    private oauthUrl;
    private baseUrl;
    private autoRefreshToken;
    private verifySSL;
    private tokenData?;
    /**
     * @param authorizationKey Base64-кодированная строка "client_id:client_secret"
     * @param options Опции: urls, autoRefreshToken, verifySSL и т.д.
     */
    constructor(authorizationKey: string, options?: GigachatClientOptions);
    /**
     * Получить токен (POST /api/v2/oauth)
     * @param scope - GIGACHAT_API_PERS | GIGACHAT_API_B2B | GIGACHAT_API_CORP
     */
    getToken(scope?: GIGACHATScope): Promise<TokenResponse>;
    /**
     * Проверяет, не истёк ли токен. Если истёк — перезапрашивает (при autoRefreshToken=true).
     */
    private ensureValidToken;
    /**
     * Общий метод для выполнения любого запроса, требующего Bearer-токен.
     * Если при первом запросе получим 401, и autoRefreshToken=true,
     * мы один раз обновляем токен и повторяем запрос.
     */
    private requestWithToken;
    /**
     * Запрос к модели (chat/completions):
     * POST https://gigachat.devices.sberbank.ru/api/v1/chat/completions
     *
     * @param headers - заголовки (X-Client-ID, X-Request-ID, X-Session-ID)
     * @param body - данные запроса: model, messages, attachments и т.д.
     */
    getModelAnswer(headers: ChatHeaders, body: ChatRequest): Promise<ChatResponse>;
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
    uploadFile(fileData: Buffer, filename: string, contentType: string, purpose?: string, accessPolicy?: 'public' | 'private'): Promise<UploadFileResponse>;
}
