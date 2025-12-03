"use strict";
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
exports.SpinalRelationLstPtr = void 0;
const spinal_core_connectorjs_1 = require("spinal-core-connectorjs");
const SpinalContext_1 = require("../Nodes/SpinalContext");
const SpinalNode_1 = require("../Nodes/SpinalNode");
const SpinalNodePointer_1 = require("../SpinalNodePointer");
const BaseSpinalRelation_1 = require("./BaseSpinalRelation");
const SpinalRelationFactory_1 = require("./SpinalRelationFactory");
/**
 * Relation where the children are in Lst of Ptr.
 * @extends BaseSpinalRelation
 * @property {Str} name
 * @property {Str} id
 * @property {SpinalNodePointer<SpinalNode<any>>} parent
 * @property {SpinalMap<Val>} contextIds
 * @property {Lst<SpinalNodePointer<SpinalNode<any>>>} children
 */
class SpinalRelationLstPtr extends BaseSpinalRelation_1.BaseSpinalRelation {
    /**
     * Constructor for the SpinalRelationLstPtr class.
     * @param {SpinalNode<any>} parent Parent of the relation
     * @param {string} name Name of the relation
     * @throws {TypeError} If the parent is not a node
     * @throws {TypeError} If the name is not a string
     * @memberof SpinalRelationLstPtr
     */
    constructor(parent, name) {
        super(parent, name);
        this._constructorName = 'SpinalRelationLstPtr';
        if (spinal_core_connectorjs_1.FileSystem._sig_server === false)
            return;
        this.add_attr({
            children: new spinal_core_connectorjs_1.Lst(),
        });
    }
    /**
     * Retrieves all the ids of the children of the relation and return them inside an array.
     * @returns {string[]} Array containing all the children ids of the relation
     * @memberof SpinalRelationLstPtr
     */
    getChildrenIds() {
        const res = [];
        for (let i = 0; i < this.children.length; i += 1) {
            res.push(this.children[i].getId().get());
        }
        return res;
    }
    /**
     * returns the number of children of the relation.
     * @returns {number}
     * @memberof SpinalRelationLstPtr
     */
    getNbChildren() {
        return this.children.length;
    }
    /**
     * Return all the children of the relation.
     * @returns {Promise<SpinalNode[]>} The children of the relation
     * @memberof SpinalRelationLstPtr
     */
    getChildren() {
        const promises = [];
        for (let i = 0; i < this.children.length; i += 1) {
            const ptr = this.children[i];
            promises.push(ptr.load());
        }
        return Promise.all(promises);
    }
    /**
     * Return all the children of the relation associated to a certain context.
     * @returns {Promise<SpinalNode<any>[]>} The children of the relation
     * @throws {TypeError} If the context is not a SpinalContext
     * @memberof SpinalRelationLstPtr
     */
    getChildrenInContext(context) {
        return __awaiter(this, void 0, void 0, function* () {
            const promises = [];
            if (!(context instanceof SpinalContext_1.SpinalContext)) {
                return Promise.reject(TypeError('context must be a SpinalContext'));
            }
            for (let i = 0; i < this.children.length; i += 1) {
                const ptr = this.children[i];
                promises.push(ptr.load());
            }
            const children = yield Promise.all(promises);
            return children.filter((child) => child.belongsToContext(context));
        });
    }
    /**
     * Returns the type of the relation.
     * @returns {string} Type of the relation
     * @memberof SpinalRelationLstPtr
     */
    getType() {
        return SpinalRelationFactory_1.SPINAL_RELATION_LST_PTR_TYPE;
    }
    /**
     * Adds a child to the relation.
     * @template T extends Model = Node Element Type
     * @param {(T|SpinalNode<T>)} node Node or model to add
     * @throws {TypeError} If the node is not a Model
     * @throws {Error} If the node is already a child of the relation
     * @returns {Promise<SpinalNode<T>>} Promise containing the node that was added
     * @memberof SpinalRelationLstPtr
     */
    addChild(node) {
        return __awaiter(this, void 0, void 0, function* () {
            let nodeCreate = node;
            if (!(node instanceof spinal_core_connectorjs_1.Model)) {
                throw new Error('Cannot add a child witch is not an instance of SpinalNode or Model.');
            }
            else if (!(node instanceof SpinalNode_1.SpinalNode)) {
                nodeCreate = new SpinalNode_1.SpinalNode(undefined, undefined, node);
            }
            if (this.getChildrenIds().indexOf(nodeCreate.getId().get()) !== -1) {
                throw new Error('Cannot add a child twice to the same relation.');
            }
            const tmpNodeCreate = nodeCreate;
            tmpNodeCreate._addParent(this);
            this.children.push(new SpinalNodePointer_1.SpinalNodePointer(tmpNodeCreate));
            return tmpNodeCreate;
        });
    }
    /**
     * Removes a child from the relation.
     * @param {SpinalNode<any>} node Child to remove
     * @returns {Promise<void>} An empty promise
     * @throws {Error} If the given node is not a child
     * @memberof SpinalRelationLstPtr
     */
    removeChild(node) {
        let found = false;
        for (let i = 0; i < this.children.length; i += 1) {
            if (this.children[i].getId() === node.getId()) {
                this.children.splice(i, 1);
                found = true;
                break;
            }
        }
        if (!found) {
            return Promise.reject(Error('The node is not a child'));
        }
        node._removeParent(this);
        return Promise.resolve();
    }
}
exports.SpinalRelationLstPtr = SpinalRelationLstPtr;
SpinalRelationLstPtr._constructorName = 'SpinalRelationLstPtr';
spinal_core_connectorjs_1.spinalCore.register_models(SpinalRelationLstPtr, 'SpinalRelationLstPtr');
exports.default = SpinalRelationLstPtr;
//# sourceMappingURL=SpinalRelationLstPtr.js.map