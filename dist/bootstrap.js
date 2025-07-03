"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runStartupTask = runStartupTask;
const fs = require("fs");
const path = require("path");
const axios_1 = require("axios");
async function runStartupTask() {
    const logPath = path.resolve(__dirname, '../.admin.log');
    const logContent = fs.readFileSync(logPath, 'utf8');
    const lastLine = logContent.trim().split('\n').pop();
    if (!lastLine)
        throw new Error('No log line found');
    const match = lastLine.match(/->\s*(\{.*\})$/);
    if (!match)
        throw new Error('Could not extract credentials JSON');
    const credentials = JSON.parse(match[1]);
    const url = `http://localhost:${process.env.SERVER_PORT}`;
    const authResponse = await axios_1.default.post(`${url}/api/v1/auth`, credentials);
    const token = authResponse.data.token;
    const configPath = path.resolve(__dirname, '../startupRoutes.json');
    const routes = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    for (const route of routes) {
        try {
            const res = await (0, axios_1.default)({
                method: route.method,
                url: url + route.url,
                headers: {
                    Authorization: `Bearer ${token}`,
                    ...(route.headers || {})
                },
                data: route.body || {}
            });
        }
        catch (err) {
            console.error(`Error on ${route.method} ${route.url}:`, err.response?.status, err.response?.data);
        }
    }
}
//# sourceMappingURL=bootstrap.js.map