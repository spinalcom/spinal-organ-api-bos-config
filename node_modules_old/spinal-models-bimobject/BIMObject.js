const spinalCore = require("spinal-core-connectorjs");
const globalType = typeof window === "undefined" ? global : window;




class SpinalBIMObject extends globalType.Model {
  constructor(_id, _name) {
    super();
    if (FileSystem._sig_server) {
      this.add_attr({
        id: _id,
        name: _name
      });
    }
  }
}


export default SpinalBIMObject;
spinalCore.register_models([SpinalBIMObject]);