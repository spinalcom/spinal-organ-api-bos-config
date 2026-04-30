import { Controller, Post, Request, Route, Security, Tags } from 'tsoa';
import * as express from 'express';
import { exec } from 'child_process';
import { HTTP_CODES, SECURITY_NAME } from '../constant';
import { checkIfItIsAdmin } from '../security/authentication';

@Route('/api/v1')
@Tags('Server')
export class UpdateServerController extends Controller {
    constructor() {
        super();
    }

    @Security(SECURITY_NAME.bearerAuth)
    @Post('/update-server')
    public async updateServer(
        @Request() req: express.Request
    ): Promise<{ message: string; output?: string }> {
        try {
            const isAdmin = await checkIfItIsAdmin(req);
            if (!isAdmin) {
                this.setStatus(HTTP_CODES.UNAUTHORIZED);
                return { message: 'Only admins can trigger a server update' };
            }

            const output = await runCommand(
                'git pull && spinalcom-utils i && pm2 restart ecosystem.config.js'
            );

            this.setStatus(HTTP_CODES.OK);
            return { message: 'Server update triggered successfully', output };
        } catch (error: any) {
            this.setStatus(HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message || 'Update failed' };
        }
    }
}

function runCommand(cmd: string): Promise<string> {
    return new Promise((resolve, reject) => {
        exec(cmd, { cwd: __dirname + '/../..' }, (error, stdout, stderr) => {
            if (error) {
                reject(new Error(stderr || error.message));
                return;
            }
            resolve(stdout + (stderr ? '\n' + stderr : ''));
        });
    });
}
