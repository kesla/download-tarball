import got from 'got';
import pipe from 'pump';
import {extract} from 'tar-fs';
import gunzipMaybe from 'gunzip-maybe';
import httpHttpsAgent from 'http-https-agent';
import assign from 'object-assign';
import promisify from 'promisify-function';

const getAgent = httpHttpsAgent({
  keepAlive: true,
  maxSockets: 20
});

module.exports = promisify(({url, gotOpts, extractOpts, dir}, callback) => {
  pipe(
    got.stream(url, assign({agent: getAgent(url)}, gotOpts)),
    gunzipMaybe(),
    extract(dir, extractOpts),
    callback
  );
});
