import type MarkdownIt from 'markdown-it';
import type { Plugin } from 'previewed';

export default function markdownIt(
    markdownIt: MarkdownIt,
    { filetypes = ['md'] } = {}
) {
    const plugin: Plugin = (file, filePath) => {
        if (filetypes.every((filetype) => !filePath.endsWith(`.${filetype}`))) {
            return file;
        }
        return `
        <!DOCTYPE html>
        <html>
            <body>
                ${markdownIt.render(file)}
            </body>
        </html>
        `;
    };
    return plugin;
}
