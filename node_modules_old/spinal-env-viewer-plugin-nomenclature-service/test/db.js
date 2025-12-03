const { SpinalGraphService } = require("spinal-env-viewer-graph-service");
const { spinalCore } = require("spinal-core-connectorjs_type");



module.exports = {
   getGraph() {
      return SpinalGraphService.getGraph();
   },
   clear() {
      process.exit(0);
   },

   init() {
      const graph = this.getGraph();

      if(typeof graph !== "undefined") return Promise.resolve(graph);

      const config = process.env;
      const url = `http://${config.USER_ID}:${config.USER_PASSWORD}@${config.HUB_IP}:${config.HUB_PORT}/`;
      const connect = spinalCore.connect(url);

      return new Promise((resolve, reject) => {
         spinalCore.load(connect,config.DIGITAL_TWIN_PATH, (_graph) => {
            SpinalGraphService.setGraph(_graph);
            resolve(_graph);
         })
      }, (err) => reject(err));
   }
}