import {join} from 'path';

// @ts-expect-error
import {pack} from 'tar-stream';
// @ts-expect-error
import tmp from 'tmp';

import fs from 'fs/promises';
// @ts-expect-error
import setupServer from 'http-test-server';

import download from '../dist/index.js';

test('downloadTarball()', async function () {
  const {baseUrl, shutdown} = await setupServer((req: any, res:any) => {
    expect(req.headers).toEqual(expect.objectContaining({custom: 'beep-boop'}));

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

  expect(d.then).toBeTruthy();

  await d;


  const actualContent = await fs.readFile(join(tmpDir, 'test.txt'), 'utf8');
  const expectedContent = 'this is the test file';
  expect(actualContent).toBe(expectedContent);
  await shutdown();
});
