const { describe, it } = require("mocha");
const { assert } = require('chai');

const db = require('./db');

const { spinalNomenclatureService } = require("../dist/index");
const {SpinalContext} = require('spinal-env-viewer-graph-service')



const contextName = "anotherContext";


describe("Context CRUD", function() {

   before(async function() {
      await db.init();
   })

   // after(function() {
   //    db.clear()
   // }) 

   describe("#create context",function() {
      it("create or create default context",async function() {
         const context = await spinalNomenclatureService.createOrGetContext();

         assert(context instanceof SpinalContext);
         assert(typeof context.info.isDefault !== "undefined");
         assert(context.getType().get() === `${spinalNomenclatureService.profileNodeType}GroupContext`);
         return;
      })

      it("create context with name", async function() {
         const context = await spinalNomenclatureService.createOrGetContext(contextName);

         assert(context instanceof SpinalContext);
         assert(typeof context.info.isDefault === "undefined");
         assert(context.getName().get() === contextName);
         assert(context.getType().get() === `${spinalNomenclatureService.profileNodeType}GroupContext`);
         return;
      })
   })

   describe("#get context", function() {
      it("get context with name", async function() {
         const context = await spinalNomenclatureService.getContexts(contextName);
         assert(context instanceof SpinalContext);
         assert(context.getName().get() === contextName);
         assert(context.getType().get() === `${spinalNomenclatureService.profileNodeType}GroupContext`);
         return;
      })

      it("try to get context which not exit", async function() {
         const context = await spinalNomenclatureService.getContexts("ContextNotExist");
         assert(typeof context === "undefined");
         return;
      })

      it("get all context", async function() {
         const contexts = await spinalNomenclatureService.getContexts();
         assert(contexts.every(el => el.getType().get() === `${spinalNomenclatureService.profileNodeType}GroupContext`));
         return;
      })
   })

   describe("#update context",function() {
      
      it("update context fail", function(done) {
         spinalNomenclatureService.getDefaultContext().then((result) => {
            const contextId = defaultContext.getId().get();
            spinalNomenclatureService.updateContext(contextId,"")
         }).then(() => {
            done(new Error("error"));
         }).catch(() => done())
      })

      it("update context", async function() {
         const defaultContext = await spinalNomenclatureService.getDefaultContext();
         const contextId = defaultContext.getId().get();
         const context = await spinalNomenclatureService.updateContext(contextId, "new context name");

         assert(context instanceof SpinalContext);
         assert(context.getName().get() === "new context name");
         assert(context.getType().get() === `${spinalNomenclatureService.profileNodeType}GroupContext`);
         return;
      })
   })

})