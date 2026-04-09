import * as Redis from "redis";


export default class SpinalRedisMiddleware {
    private static _instance: SpinalRedisMiddleware;
    private _redisClient: Redis.RedisClientType | undefined;
    private _isEnabled: boolean = process.env.ENABLE_REDIS_CACHE == "1";



    private constructor() {
        console.log(`SpinalRedisMiddleware initialized. Caching is ${this.isEnabled() ? "enabled" : "disabled"}.`);
        if (this.isEnabled()) {
            const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";
            this._redisClient = Redis.createClient({ url: redisUrl });
        }
    }

    public async connect() {
        if (!this.isEnabled() || !this._redisClient) return;

        try {
            if (!this._redisClient?.isOpen) await this._redisClient.connect();
        } catch (error) {
            //console.error("Failed to connect to Redis:", error);
        }
    }

    public async disconnect() {
        if (!this.isEnabled() || !this._redisClient) return;
        try {
            if (this._redisClient?.isOpen) await this._redisClient.close();
        } catch (error) {
            // console.error("Failed to disconnect from Redis:", error);
        }
    }

    public isEnabled(): boolean {
        return this._isEnabled;
    }

    public static getInstance(): SpinalRedisMiddleware {
        if (!this._instance) this._instance = new SpinalRedisMiddleware();
        return this._instance;
    }

    public async set(key: string, value: any, options: Redis.SetOptions = { expiration: { type: 'EX', value: 3600 } }) {
        if (!this.isEnabled()) return;

        await this.connect(); // Ensure connection before setting value
        const redisValue = { value }
        return this._redisClient?.set(key, JSON.stringify(redisValue), options);
    }

    public async get(key: string) {
        if (!this.isEnabled()) return;

        await this.connect(); // Ensure connection before getting value
        const data = await this._redisClient?.get(key);

        const parsedData: { value: any } | null = data ? JSON.parse(data as string) : null;
        // this.disconnect(); // Disconnect after getting value
        return parsedData ? parsedData.value : null;
    }

    public async delete(key: string) {
        if (!this.isEnabled()) return;

        await this.connect(); // Ensure connection before deleting value
        return this._redisClient?.del(key);
    }

    public async exists(key: string) {
        if (!this.isEnabled()) return;

        await this.connect(); // Ensure connection before checking existence
        return this._redisClient?.exists(key);
    }

    public async flushCache() {
        if (!this.isEnabled()) return;

        await this.connect(); // Ensure connection before flushing cache
        return this._redisClient?.flushAll();

    }


}

export { SpinalRedisMiddleware };