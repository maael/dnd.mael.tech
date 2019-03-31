import getConfig from 'next/config';
import * as createDebug from 'debug';

const {publicRuntimeConfig} = getConfig();

if (typeof window !== 'undefined') {
  localStorage.debug = publicRuntimeConfig.debug;
}

const appDebug = createDebug(publicRuntimeConfig.appName);

export default appDebug;
