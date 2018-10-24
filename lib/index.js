import {Agent as HttpAgent} from 'http';
import {Agent as HttpsAgent} from 'https';
import got from 'got';
import pipe from 'pump';
import {extract} from 'tar-fs';
import gunzipMaybe from 'gunzip-maybe';
import assign from 'object-assign';
import promisify from 'promisify-function';

const agentOpts = {
  keepAlive: true,
  maxSockets: 20
};
const agent = {
  http: new HttpAgent(agentOpts),
  https: new HttpsAgent(agentOpts)
};

module.exports = promisify(({url, gotOpts, extractOpts, dir}, callback) => {
  pipe(
    got.stream(url, assign({agent}, gotOpts)),
    gunzipMaybe(),
    extract(dir, extractOpts),
    callback
  );
});
