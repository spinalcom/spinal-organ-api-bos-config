"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpinalGraph = void 0;
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
const constants_1 = require("../constants");
const SpinalRelationFactory_1 = require("../Relations/SpinalRelationFactory");
const Utilities_1 = require("../Utilities");
const SpinalContext_1 = require("./SpinalContext");
const SpinalNode_1 = require("./SpinalNode");
/**
 * Starting node of a graph.
 * @extends SpinalNode
 */
class SpinalGraph extends SpinalNode_1.SpinalNode {
    /**
     * Constructor for the SpinalGraph class.
     * @param {String} [name="undefined"] Name of the graph, usually unused
     * @param {String} [type="SpinalGraph"] Type of the graph, usually unused
     * @param {SpinalNode | Model} [element] Element of the graph
     * @throws {TypeError} If the element is not a Model
     */
    constructor(name = 'undefined', type = 'SpinalGraph', element) {
        super(name, type, element);
        if (spinal_core_connectorjs_1.FileSystem._sig_server === false)
            return;
        this.info.id.set((0, Utilities_1.guid)());
    }
    /**
     * Adds a context to the graph.
     * @param {SpinalContext} context Context to be added
     * @returns {Promise<SpinalContext>} The added context
     * @throws {TypeError} If the context is not a context
     */
    addContext(context) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(context instanceof SpinalContext_1.SpinalContext)) {
                throw new TypeError('context must be a context');
            }
            return this.addChild(context, constants_1.HAS_CONTEXT_RELATION_NAME, SpinalRelationFactory_1.SPINAL_RELATION_TYPE);
        });
    }
    /**
     * Searches for a context using its name.
     * @param {String} name Name of the context
     * @returns {SpinalContext | undefined} The wanted context or undefined
     * @throws {TypeError} If name is not a string
     */
    getContext(name) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof name !== 'string') {
                throw TypeError('name must be string');
            }
            const children = yield this.getChildren([constants_1.HAS_CONTEXT_RELATION_NAME]);
            return children.find((child) => child.info.name.get() === name);
        });
    }
    /**
     * Empty override of the SpinalNode method.
     * @override
     * @returns {Promise<nothing>} An empty promise
     */
    removeFromGraph() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
}
exports.SpinalGraph = SpinalGraph;
spinal_core_connectorjs_1.spinalCore.register_models([SpinalGraph]);
exports.default = SpinalGraph;
//# sourceMappingURL=SpinalGraph.js.map