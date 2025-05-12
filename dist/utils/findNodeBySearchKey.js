"use strict";
/*
 * Copyright 2025 SpinalCom - www.spinalcom.com
 *
 * This file is part of SpinalCore.
 *
 * Please read all of the following terms and conditions
 * of the Software license Agreement ("Agreement")
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchByNameOrId = exports.searchById = exports.searchByName = void 0;
exports.isNodeMatchSearchKey = isNodeMatchSearchKey;
exports.findNodeBySearchKey = findNodeBySearchKey;
const idKey = 'id';
const nameKey = 'name';
exports.searchByName = [nameKey];
exports.searchById = [idKey];
exports.searchByNameOrId = [idKey, nameKey];
function isNodeMatchSearchKey(searchKeys, searchValue, node) {
    for (const key of searchKeys) {
        if (node.info[key]?.get().toLowerCase() === searchValue.toLowerCase()) {
            return true;
        }
    }
    return false;
}
function findNodeBySearchKey(nodes, searchKeys, searchValue) {
    for (const node of nodes) {
        if (isNodeMatchSearchKey(searchKeys, searchValue, node)) {
            return node;
        }
    }
}
//# sourceMappingURL=findNodeBySearchKey.js.map