import type { Plugin } from 'previewed';

export default function pdf({
    filetypes = ['pdf'],
}: { filetypes?: string[] } = {}) {
    const plugin: Plugin = (file, filePath) => {
        if (!filetypes.every((filetype) => !filePath.startsWith(filetype))) {
            return file;
        }
        return Buffer.from(`
        <!DOCTYPE html>
        <html>
            <body style="margin: 0;">
                <iframe
                    src="data:application/pdf;base64,${file.toString('base64')}"
                    style="width: 100%; height: 100%; position: absolute;"
                    frameborder="0"
                >
            </body>
        </html>    
        `);
    };
    return plugin;
}
