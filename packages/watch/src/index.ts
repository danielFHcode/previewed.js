import { JSDOM } from 'jsdom';
import { WebSocketServer } from 'ws';
import fs from 'node:fs';
import { Plugin } from 'previewed';

export default function watch({
    host = '127.0.0.1',
    port = 4001,
    filetypes = ['html'],
}: {
    host?: string;
    port?: number;
    filetypes?: string[];
} = {}) {
    const server = new WebSocketServer({ host, port });
    const dirs = new Set<string>();
    server.on('connection', (socket) => {
        dirs.forEach((dir) => {
            fs.watch(dir, { recursive: true }, () => {
                socket.send('update');
            });
        });
    });

    const plugin: Plugin = (file, filePath, options) => {
        if (filetypes.every((filetype) => !filePath.endsWith(`.${filetype}`))) {
            return file;
        }
        dirs.add(options.dir);
        const dom = new JSDOM(file);
        const script = dom.window.document.createElement('script');
        script.innerHTML = `new WebSocket('ws://${host}:${port}').addEventListener('message', () => location.reload())`;
        dom.window.document.body.appendChild(script);
        return dom.serialize();
    };
    return plugin;
}
