const { describe, it } = require("mocha");
const { assert } = require('chai');

const db = require('./db');

const { spinalNomenclatureService } = require("../dist/index");
const {SpinalNode} = require('spinal-env-viewer-graph-service')


const categoryName = "category name";

describe("Category CRUD", function() {

   before(async function() {
      await db.init();
   })

   // after(function() {
   //    db.clear()
   // }) 

   describe("#create category",function() {
      it("create category in default context", async function() {
         const category = await spinalNomenclatureService.createCategory(categoryName)
         assert(category instanceof SpinalNode);
         assert(category.getName().get() === categoryName);
         return;
      })
   })

   describe("#get category",  function() {
      it("get category with name",  async function() {
         const category = await spinalNomenclatureService.getCategories(categoryName);
         assert(category instanceof SpinalNode);
         assert(category.getName().get() === categoryName);
         return;
      })

      it("try to get category which not exit",  async function() {
         const category = await spinalNomenclatureService.getCategories("category not exist");
         assert(typeof category === "undefined");
         return;
      })

      it("get all categories",  async function() {
         const categories = await spinalNomenclatureService.getCategories();
         assert(Array.isArray(categories));
      })
   })

   describe("#update category",function() {
      
      it("update category", function() {
         
      })
   })

})