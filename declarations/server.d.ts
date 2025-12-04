import { type Application } from 'express';
import type { Server } from 'http';
export declare function initExpress(): Promise<import("express-serve-static-core").Express>;
export declare function initServer(app: Application): Server;
