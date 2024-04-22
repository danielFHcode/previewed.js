import { JSDOM } from 'jsdom';
import type { Plugin } from 'previewed';

export default function css(css: string, { filetypes = ['html'] } = {}) {
    const plugin: Plugin = (file, filePath) => {
        if (filetypes.every((filetype) => !filePath.endsWith(`.${filetype}`))) {
            return file;
        }
        const jsdom = new JSDOM(file);
        const style = jsdom.window.document.createElement('style');
        style.innerHTML = css;
        jsdom.window.document.head.appendChild(style);
        return jsdom.serialize();
    };
    return plugin;
}
