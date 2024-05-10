import type { Plugin } from 'previewed';

export default function text({ filetypes = ['txt'] } = {}) {
    const plugin: Plugin = (file, filePath) => {
        for (const filetype of filetypes) {
            if (!filePath.endsWith(`.${filetype}`)) return file;
        }
        return Buffer.from(`
        <!DOCTYPE html>
        <html>
            <body>
                ${file
                    .toString()
                    .replaceAll('&', '&amp;')
                    .replaceAll('<', '&lt;')
                    .replaceAll('>', '&gt;')
                    .replaceAll('\n', '<br>')
                    .replaceAll(' ', '&nbsp;')}
            </body>
        </html>
        `);
    };
    return plugin;
}
