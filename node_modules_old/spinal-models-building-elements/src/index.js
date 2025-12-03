const spinalCore = require("spinal-core-connectorjs");
const globalType = typeof window === "undefined" ? global : window;



import AbstractElement from './AbstractElement';
import BIMElement from './BIMElement';

export {
  AbstractElement,
  BIMElement
}