import Promise from 'bluebird';
import got from 'got';
import pipe from 'pump';
import {extract} from 'tar-fs';
import gunzipMaybe from 'gunzip-maybe';

module.exports = Promise.promisify(({url, gotOpts, dir}, callback) => {
  pipe(
    got.stream(url, gotOpts),
    gunzipMaybe(),
    extract(dir),
    callback
  );
});
