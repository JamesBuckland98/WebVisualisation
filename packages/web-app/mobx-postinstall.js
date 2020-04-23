// This file is necessary solely because Preact does not emit a few obscure React types that
// MobX uses. Since you cannot alias TS types, we already needed @types/react (just in order
// to compile, wasn't actually used), we figured we may as well just link to the correct types,
// rather than try to reimplement.

const fs = require('fs');

const opts = {
    encoding: 'utf8',
    lineEnding: '\n',
};

const mobxObserverPath = './node_modules/mobx-react-lite/dist/observer.d.ts';

const firstLine = () => {
    return new Promise((resolve, reject) => {
        const rs = fs.createReadStream(mobxObserverPath, { encoding: opts.encoding });
        let acc = '';
        let pos = 0;
        let index;
        rs.on('data', (chunk) => {
            index = chunk.indexOf(opts.lineEnding);
            acc += chunk;
            if (index === -1) {
                pos += chunk.length;
            } else {
                pos += index;
                rs.close();
            }
        })
            .on('close', () => resolve(acc.slice(acc.charCodeAt(0) === 0xfeff ? 1 : 0, pos)))
            .on('error', (err) => reject(err));
    });
};

const requiredFirstLine = "import React from 'react';";

firstLine().then((result) => {
    if (result !== requiredFirstLine) {
        const data = fs
            .readFileSync(mobxObserverPath)
            .toString()
            .split('\n');
        data.splice(0, 0, requiredFirstLine);
        const text = data.join('\n');

        fs.writeFile(mobxObserverPath, text, function(err) {
            if (err) return err;
        });
    }
});
