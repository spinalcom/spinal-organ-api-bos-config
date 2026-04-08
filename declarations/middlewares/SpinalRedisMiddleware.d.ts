import * as Redis from "redis";
export default class SpinalRedisMiddleware {
    private static _instance;
    private _redisClient;
    private _isEnabled;
    private constructor();
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    isEnabled(): boolean;
    static getInstance(): SpinalRedisMiddleware;
    set(key: string, value: any, options?: Redis.SetOptions): Promise<string | {}>;
    get(key: string): Promise<any>;
    delete(key: string): Promise<number>;
    exists(key: string): Promise<number>;
    flushCache(): Promise<string>;
}
export { SpinalRedisMiddleware };
