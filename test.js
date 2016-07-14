import {join} from 'path';

import {pack} from 'tar-stream';
import tmp from 'tmp';
import test from 'tapava';
import fs from 'then-fs';
import setupServer from 'http-test-server';

import download from './lib';

test('downloadTarball()', function * (t) {
  const {baseUrl, shutdown} = yield setupServer((req, res) => {
    t.match(req.headers, {custom: 'beep-boop'});

    // only testing tar here since we're using gunzip-maybe that handles gzip
    const packStream = pack();
    packStream.entry({name: 'test.txt'}, 'this is the test file');
    packStream.finalize();
    packStream.pipe(res);
  });

  const {name: tmpDir} = tmp.dirSync();

  const d = download({
    url: baseUrl,
    gotOpts: {
      headers: {
        custom: 'beep-boop'
      }
    },
    dir: tmpDir
  });

  t.truthy(d.then, 'answer is promise');

  yield d;
  const actualContent = yield fs.readFile(join(tmpDir, 'test.txt'), 'utf8');
  const expectedContent = 'this is the test file';
  t.is(actualContent, expectedContent);
  yield shutdown();
});
