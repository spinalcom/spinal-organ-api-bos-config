"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpinalContext = void 0;
/*
 * Copyright 2018 SpinalCom - www.spinalcom.com
 *
 * This file is part of SpinalCore.
 *
 * Please read all of the following terms and conditions
 * of the Free Software license Agreement ("Agreement")
 * carefully.
 *
 * This Agreement is a legally binding contract between
 * the Licensee (as defined below) and SpinalCom that
 * sets forth the terms and conditions that govern your
 * use of the Program. By installing and/or using the
 * Program, you agree to abide by all the terms and
 * conditions stated or referenced herein.
 *
 * If you do not agree to abide by these terms and
 * conditions, do not demonstrate your acceptance and do
 * not install or use the Program.
 * You should have received a copy of the license along
 * with this file. If not, see
 * <http://resources.spinalcom.com/licenses.pdf>.
 */
const spinal_core_connectorjs_1 = require("spinal-core-connectorjs");
const SpinalRelationFactory_1 = require("../Relations/SpinalRelationFactory");
const Utilities_1 = require("../Utilities");
const SpinalNode_1 = require("./SpinalNode");
/**
 * A SpinalContext is the statring node of a part of the graph.
 * @class SpinalContext
 * @extends {SpinalNode<T>}
 * @template T
 */
class SpinalContext extends SpinalNode_1.SpinalNode {
    /**
     * Constructor for the SpinalContext class.
     * @param {String} [name="undefined"] Name of the context
     * @param {String} [type="SpinalContext"] Type of the context, usually unused
     * @param {SpinalNode | Model} [element] Element of the context
     * @throws {TypeError} If the element is not a Model
     */
    constructor(name = 'undefined', type = 'SpinalContext', element) {
        super(name, type, element);
        if (spinal_core_connectorjs_1.FileSystem._sig_server === false)
            return;
        this.info.id.set((0, Utilities_1.guid)());
    }
    /**
     * Adds a child with a SpinalRelationLstPtrType.
     * @override
     * @param {SpinalNode | Model} child Node to add as child
     * @param {String} relationName Name of the relation
     * @param {String} [_relationType=SPINAL_RELATION_PTR_LST_TYPE]
     * This parameter is here only to properly override the parent method
     * @returns {Promise<SpinalNode>} The child node in a promise
     * @throws {TypeError} If the child is not a model
     * @throws {TypeError} If the relation name is not a string
     */
    addChild(child, relationName, _relationType = SpinalRelationFactory_1.SPINAL_RELATION_PTR_LST_TYPE) {
        return super.addChild(child, relationName, SpinalRelationFactory_1.SPINAL_RELATION_PTR_LST_TYPE);
    }
    /**
     * Adds a child with a SpinalRelationLstPtrType and notices
     * the context if a new relation was created.
     * @override
     * @param {SpinalNode | Model} child Node to add as child
     * @param {String} relationName Name of the relation
     * @param {String} [relationType=SPINAL_RELATION_PTR_LST_TYPE]
     * This parameter is here only to properly override the parent method
     * @param {SpinalContext} context Context to update, usually unused
     * @returns {Promise<SpinalNode>} The child node in a promise
     */
    addChildInContext(child, relationName, _relationType = SpinalRelationFactory_1.SPINAL_RELATION_PTR_LST_TYPE, context = this) {
        return super.addChildInContext(child, relationName, SpinalRelationFactory_1.SPINAL_RELATION_PTR_LST_TYPE, context);
    }
    /**
     * Return the children of the node that are registered in the context
     * @override
     * @param {SpinalContext} [context=this] Context to use for the search, this by default
     * @returns {Promise<Array<SpinalNode>>} The children that were found
     */
    getChildrenInContext(context = this) {
        return super.getChildrenInContext(context);
    }
}
exports.SpinalContext = SpinalContext;
spinal_core_connectorjs_1.spinalCore.register_models([SpinalContext]);
exports.default = SpinalContext;
//# sourceMappingURL=SpinalContext.js.map