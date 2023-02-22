import {Agent as HttpAgent} from 'http';
import {Agent as HttpsAgent} from 'https';
import got, { Options } from 'got';
import pipe from 'pump';
import {ExtractOptions, extract} from 'tar-fs';
import gunzipMaybe from 'gunzip-maybe';
import { Callback } from 'pump';

const agentOpts = {
  keepAlive: true,
  maxSockets: 20
};
const agent = {
  http: new HttpAgent(agentOpts),
  https: new HttpsAgent(agentOpts)
};

interface DownloadOptions {
  url: string;
  gotOpts?: Partial<Omit<Options, 'agent' | 'isStream'>>;
  extractOpts?: ExtractOptions;
  dir: string;
}

export default async function download({url, gotOpts, extractOpts, dir}: DownloadOptions) {
  return new Promise<void>((res, rej) => {
    const callback: Callback = (err): any => {err ? rej(err): res()};

    pipe(
      got.stream(url, Object.assign({agent}, gotOpts)),
      gunzipMaybe(),
      extract(dir, extractOpts),
      callback,
    );
  });
};
