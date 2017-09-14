import LightLoader from './components/light-loader';
import LightTimer from './components/light-timer';

const canvasTools = {
  LightLoader,
  LightTimer
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
