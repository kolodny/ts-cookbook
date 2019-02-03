import { readFileSync, writeFileSync, mkdirSync } from 'fs';

const fileContents = readFileSync(__dirname + '/../README.md').toString();
const blocks = fileContents.match(/```ts.*?```/gs)!.map(block => {
  return block
    .split('\n')
    .slice(1, -1)
    .join('\n');
});

const dir = __dirname + '/snippets/';

mkdirSync(dir);
writeFileSync(dir + 'tsconfig.json', readFileSync(__dirname + '/tsconfig.json'));
writeFileSync(dir + 'tslint.json', readFileSync(__dirname + '/tslint.json'));
writeFileSync(
  dir + 'index.d.ts',
  `// TypeScript Version: 3.0

export {};
`,
);

const importsMatcher = /^\s*import.*?';/msg;
const importsMatcherWithNewlines = /^\s*import.*?';\n\n/msg;
for (let [index, snippet] of blocks.entries()) {
  snippet = snippet.replace(/from 'ts-cookbook';/g, `from '../../types';`);
  const imports = snippet.match(importsMatcher) || [];
  const lines = [
    '(() => {',
    snippet
      .replace(importsMatcherWithNewlines, '')
      .replace(/\/\/ Error: .*/g, '// $ExpectError')
      .replace(/\/\/ Type:/g, '// $ExpectType'),
    '})();'
  ];
  if (imports.length) {
    if (lines[1].slice(0, 2) === '\n\n') lines[1] = lines[1].replace(/\n\n/, '\n');
    lines.unshift(...[...imports])
  }
  const sanitized = lines.join('\n');
  writeFileSync(dir + index + '.ts', sanitized + '\n');
}
