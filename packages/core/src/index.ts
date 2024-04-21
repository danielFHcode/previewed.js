import express from 'express';
import fs from 'node:fs/promises';
import path from 'node:path';

export type Plugin = (
    file: Buffer,
    filePath: string,
    options: {
        host: string;
        port: number;
        dir: string;
    }
) => Buffer;

export default function init({
    dir,
    host = '127.0.0.1',
    port = 4000,
    plugins = [],
}: {
    dir: string;
    host?: string;
    port?: number;
    plugins?: Plugin[];
}) {
    const app = express();
    app.get('/**', async (req, res) => {
        try {
            const filePath = path.join(dir, req.url);
            const file = await fs.readFile(filePath);
            const processedFiles = plugins.reduce((file, plugin) => {
                return plugin(file, filePath, { host, port, dir });
            }, file);
            res.setHeader('Content-Disposition', 'inline');
            res.send(processedFiles);
        } catch {
            res.send(`No file at path ${req.url}`);
        }
    });
    app.listen(port, host, () =>
        console.log(`Started preview server on http://${host}:${port}`)
    );
}
