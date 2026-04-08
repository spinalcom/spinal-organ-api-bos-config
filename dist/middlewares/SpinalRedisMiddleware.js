"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpinalRedisMiddleware = void 0;
const Redis = require("redis");
class SpinalRedisMiddleware {
    static _instance;
    _redisClient;
    _isEnabled = process.env.ENABLE_REDIS_CACHE === "1";
    constructor() {
        if (this._isEnabled) {
            const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";
            this._redisClient = Redis.createClient({ url: redisUrl });
        }
    }
    async connect() {
        if (!this._isEnabled || !this._redisClient)
            return;
        try {
            if (!this._redisClient?.isOpen)
                await this._redisClient.connect();
        }
        catch (error) {
            //console.error("Failed to connect to Redis:", error);
        }
    }
    async disconnect() {
        if (!this._isEnabled || !this._redisClient)
            return;
        try {
            if (this._redisClient?.isOpen)
                await this._redisClient.close();
        }
        catch (error) {
            // console.error("Failed to disconnect from Redis:", error);
        }
    }
    isEnabled() {
        return this._isEnabled;
    }
    static getInstance() {
        if (!this._instance)
            this._instance = new SpinalRedisMiddleware();
        return this._instance;
    }
    async set(key, value, options = { expiration: { type: 'EX', value: 3600 } }) {
        if (!this._isEnabled)
            return;
        await this.connect(); // Ensure connection before setting value
        const redisValue = { value };
        return this._redisClient?.set(key, JSON.stringify(redisValue), options).finally(() => this.disconnect());
    }
    async get(key) {
        if (!this._isEnabled)
            return;
        await this.connect(); // Ensure connection before getting value
        const data = await this._redisClient?.get(key);
        const parsedData = data ? JSON.parse(data) : null;
        this.disconnect(); // Disconnect after getting value
        return parsedData ? parsedData.value : null;
    }
    async delete(key) {
        if (!this._isEnabled)
            return;
        await this.connect(); // Ensure connection before deleting value
        return this._redisClient?.del(key).finally(() => this.disconnect());
    }
    async exists(key) {
        if (!this._isEnabled)
            return;
        await this.connect(); // Ensure connection before checking existence
        return this._redisClient?.exists(key).finally(() => this.disconnect());
    }
    async flushCache() {
        if (!this._isEnabled)
            return;
        await this.connect(); // Ensure connection before flushing cache
        return this._redisClient?.flushAll().finally(() => this.disconnect());
    }
}
exports.default = SpinalRedisMiddleware;
exports.SpinalRedisMiddleware = SpinalRedisMiddleware;
//# sourceMappingURL=SpinalRedisMiddleware.js.map