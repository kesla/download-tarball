/* eslint-disable import/no-extraneous-dependencies */

import download from 'download-tarball';

download({
  url: 'http://link-to-tarball/file.tar.gz',
  dir: '/dir/where/file/will/be/downloaded'
}).then(() => {
  console.log('file is now downloaded!');
}).catch(err => {
  console.log('oh crap the file could not be downloaded properly');
  console.log(err);
});

download({
  url: 'http://link-to-tarball/file.tar.gz',
  dir: '/dir/where/file/will/be/downloaded',
  // custom options that will be forwarded to got.stream(..., opts) can also be set
  gotOpts: {
    headers: {
      beep: 'boop'
    }
  }
}).then(() => {
  console.log('file is now downloaded!');
}).catch(err => {
  console.log('oh crap the file could not be downloaded properly');
  console.log(err);
});

download({
  // neat, tar files works as well!
  url: 'http://link-to-tarball/file.tar',
  dir: '/dir/where/file/will/be/downloaded'
}).then(() => {
  console.log('file is now downloaded!');
}).catch(err => {
  console.log('oh crap the file could not be downloaded properly');
  console.log(err);
});
