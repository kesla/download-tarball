import Promise from 'bluebird';
import got from 'got';
import eos from 'end-of-stream';
import {extract} from 'tar-fs';
import gunzipMaybe from 'gunzip-maybe';

module.exports = ({url, gotOpts, dir}) =>
  Promise.promisify(callback => {
    eos(
      got
        .stream(url, gotOpts)
        .pipe(gunzipMaybe())
        .pipe(extract(dir)),
      callback
    );
  });
