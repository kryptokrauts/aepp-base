import Vue from 'vue';
import './lib/setGlobalPolyfills';
import './lib/initEnv';
import store from './store';

Vue.config.productionTip = false;

window.store = store;

if (process.env.RUNNING_IN_POPUP) import(/* webpackChunkName: "popup" */ './popup');
else if (!process.env.RUNNING_IN_FRAME) import(/* webpackChunkName: "ui" */ './ui');
