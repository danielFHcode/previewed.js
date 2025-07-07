# previewed.js

A library for previewing files while working on them.

For example, you might use this library to open a local server that renders your markdown files while working on them, and updates when the files change.

## Installation

You can install using npm (or pnpm, or yarn, or bun, or whatever else):

```
npm install previewed
```

## Usage

You can set up a server using the `init` function - which is exported as a default export:

```js
import init from 'previewed';

init({
    dir: 'path/to/working/directory',
    host: 'ip.address.of.host' // defaults to 127.0.0.1
    port: PORT // defaults to 4000
    plugins: [pluginA(), pluginB()] // a list of plugins, no plugins by default
});
```

When no plugins are used, each in `dir` will get served directly as if it were html.

## Examples

### Markdown Preview

```bash
npm install previewed @previewed/plugin-markdown-it markdown-it @previewed/plugin-watch
```

index.js:

```js
import init from 'previewed';
import markdown from '@previewed/plugin-markdown.it';
import MarkdownIt from 'markdown-it';
import watch from '@previewed/plugin-watch';
import { resolve } from 'node:path';

init({
    dir: resolve('bin'),
    plugins: [markdown(new MarkdownIt()), watch({ filetypes: ['md'] })],
});
```

bin/index.md:

```md
# Hello World

This is a markdown file.
```

Now run:

```bash
node index.js
```

And you can see your markdown file at `http://127.0.0.1:4000/index.md` - which will update every time you save.

## Styled Text

```bash
npm install previewed @previewed/plugin-text @previewed/plugin-css @previewed/plugin-watch
```

index.js:

```js
import init from 'previewed';
import text from '@previewed/plugin-text';
import css from '@previewed/plugin-css';
import watch from '@previewed/plugin-watch';
import { resolve } from 'node:path';

init({
    dir: resolve('bin'),
    plugins: [
        text(),
        css(
            `
        * {
            font-family: sans-serif;
            color: red
        }
        `,
            {
                filetypes: ['txt'],
            }
        ),
        watch({ filetypes: ['txt'] }),
    ],
});
```

bin/index.txt:

```txt
HELLO this is a txt file :)
```

Now run:

```bash
node index.js
```

And you can see your text file, with a Sans Serif font and a red color, at `http://127.0.0.1:4000/index.md` - which will update every time you save.

## Plugin Development

A plugin is simply a function, that runs every time a file is rendered by the server, it takes in 3 arguments:

-   **file:** this is a `Buffer` contains the contents of the given file.
-   **filePath:** this is a `string` of the given file's path.
-   **options:** this is an `object` contains additional options specified in the options of the `init` function:
    -   **host:** the host of the running server.
    -   **port:** the port of the running server.
    -   **dir:** the directory of the rendered files.

And returns:

-   A `Buffer` containing the transformed contents of the file.

### Example Plugin

This plugin adds a specified prefix to any text file:

```js
export default function prefixer(prefix) {
    return (file, filePath) => {
        if (!filePath.endsWith('.txt')) return file;
        return Buffer.from(prefix + file.toString());
    };
}
```

usage:

```js
import init from 'previewed';
import text from '@previewed/plugin-text';
import prefixer from './plugin.js';

init({
    dir: 'bin',
    plugins: [prefixer('~this is a prefix~'), text()],
});
```

Now every `.txt` file you navigate to will have "~this is a prefix~" in the beginning.
