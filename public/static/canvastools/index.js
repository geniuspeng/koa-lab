import LightLoader from './components/light-loader';

const canvasTools = {
  LightLoader
};

const install = function() {
  Object.keys(canvasTools).forEach((key) => {
    Vue.component(key, canvasTools[key]);
  });
};

// auto install
if (typeof window !== 'undefined' && window.Vue) {
    install(window.Vue);
}

export default Object.assign(canvasTools, {install});
