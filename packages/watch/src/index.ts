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
            fs.watch(dir, () => {
                socket.send('update');
            });
        });
    });

    const plugin: Plugin = (file, filePath, options) => {
        if (filetypes.every((filetype) => !filePath.endsWith(`.${filetype}`))) {
            return file;
        }
        dirs.add(options.dir);
        const dom = new JSDOM(file.toString());
        const script = dom.window.document.createElement('script');
        script.innerHTML = `
        new WebSocket('ws://${host}:${port}').addEventListener('message', async () => {
            document.body.style.opacity = '50%';
            const html = await fetch(location.href).then(response => response.text());
            const doc = new DOMParser().parseFromString(html, 'text/html');
            document.body.innerHTML = doc.body.innerHTML;
            document.body.style.opacity = '100%';
        })
        `;
        dom.window.document.body.appendChild(script);
        return Buffer.from(dom.serialize());
    };
    return plugin;
}
