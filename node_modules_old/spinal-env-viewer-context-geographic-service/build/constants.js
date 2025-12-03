"use strict";
/*
 * Copyright 2023 SpinalCom - www.spinalcom.com
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.REFERENCE_ROOM_RELATION = exports.ROOM_REFERENCE_CONTEXT = exports.ZONE_REFERENCE_CONTEXT = exports.FLOOR_REFERENCE_CONTEXT = exports.BUILDING_REFERENCE_CONTEXT = exports.SITE_REFERENCE_CONTEXT = exports.REFERENCE_RELATION = exports.REFERENCE_TYPE = exports.MAP_RELATION_TYPE = exports.MAP_TYPE_RELATION = exports.GEOGRAPHIC_RELATIONS_ORDER = exports.EQUIPMENT_RELATION = exports.GEOGRAPHIC_RELATIONS = exports.ROOM_RELATION = exports.ZONE_RELATION = exports.FLOOR_RELATION = exports.BUILDING_RELATION = exports.SITE_RELATION = exports.GEOGRAPHIC_TYPES_ORDER = exports.EQUIPMENT_TYPE = exports.GEOGRAPHIC_TYPES = exports.ROOM_TYPE = exports.ZONE_TYPE = exports.FLOOR_TYPE = exports.BUILDING_TYPE = exports.SITE_TYPE = exports.CONTEXT_TYPE = void 0;
const CONTEXT_TYPE = 'geographicContext';
exports.CONTEXT_TYPE = CONTEXT_TYPE;
const SITE_TYPE = 'geographicSite';
exports.SITE_TYPE = SITE_TYPE;
const BUILDING_TYPE = 'geographicBuilding';
exports.BUILDING_TYPE = BUILDING_TYPE;
const FLOOR_TYPE = 'geographicFloor';
exports.FLOOR_TYPE = FLOOR_TYPE;
const ZONE_TYPE = 'geographicZone';
exports.ZONE_TYPE = ZONE_TYPE;
const ROOM_TYPE = 'geographicRoom';
exports.ROOM_TYPE = ROOM_TYPE;
const EQUIPMENT_TYPE = 'BIMObject';
exports.EQUIPMENT_TYPE = EQUIPMENT_TYPE;
const REFERENCE_TYPE = 'geographicReference';
exports.REFERENCE_TYPE = REFERENCE_TYPE;
const SITE_RELATION = 'hasGeographicSite';
exports.SITE_RELATION = SITE_RELATION;
const BUILDING_RELATION = 'hasGeographicBuilding';
exports.BUILDING_RELATION = BUILDING_RELATION;
const FLOOR_RELATION = 'hasGeographicFloor';
exports.FLOOR_RELATION = FLOOR_RELATION;
const ZONE_RELATION = 'hasGeographicZone';
exports.ZONE_RELATION = ZONE_RELATION;
const ROOM_RELATION = 'hasGeographicRoom';
exports.ROOM_RELATION = ROOM_RELATION;
const EQUIPMENT_RELATION = 'hasBimObject';
exports.EQUIPMENT_RELATION = EQUIPMENT_RELATION;
const REFERENCE_RELATION = 'hasReferenceObject';
exports.REFERENCE_RELATION = REFERENCE_RELATION;
const REFERENCE_ROOM_RELATION = 'hasReferenceObject.ROOM';
exports.REFERENCE_ROOM_RELATION = REFERENCE_ROOM_RELATION;
const SITE_REFERENCE_CONTEXT = '.SiteContext';
exports.SITE_REFERENCE_CONTEXT = SITE_REFERENCE_CONTEXT;
const BUILDING_REFERENCE_CONTEXT = '.BuildingContext';
exports.BUILDING_REFERENCE_CONTEXT = BUILDING_REFERENCE_CONTEXT;
const FLOOR_REFERENCE_CONTEXT = '.FloorContext';
exports.FLOOR_REFERENCE_CONTEXT = FLOOR_REFERENCE_CONTEXT;
const ZONE_REFERENCE_CONTEXT = '.ZoneContext';
exports.ZONE_REFERENCE_CONTEXT = ZONE_REFERENCE_CONTEXT;
const ROOM_REFERENCE_CONTEXT = '.RoomContext';
exports.ROOM_REFERENCE_CONTEXT = ROOM_REFERENCE_CONTEXT;
const GEOGRAPHIC_TYPES = Object.freeze([
    SITE_TYPE,
    BUILDING_TYPE,
    FLOOR_TYPE,
    ZONE_TYPE,
    ROOM_TYPE,
]);
exports.GEOGRAPHIC_TYPES = GEOGRAPHIC_TYPES;
const GEOGRAPHIC_TYPES_ORDER = Object.freeze([
    CONTEXT_TYPE,
    SITE_TYPE,
    BUILDING_TYPE,
    FLOOR_TYPE,
    ZONE_TYPE,
    ROOM_TYPE,
    EQUIPMENT_TYPE,
]);
exports.GEOGRAPHIC_TYPES_ORDER = GEOGRAPHIC_TYPES_ORDER;
const GEOGRAPHIC_RELATIONS = Object.freeze([
    SITE_RELATION,
    BUILDING_RELATION,
    FLOOR_RELATION,
    ZONE_RELATION,
    ROOM_RELATION,
    EQUIPMENT_RELATION,
]);
exports.GEOGRAPHIC_RELATIONS = GEOGRAPHIC_RELATIONS;
const GEOGRAPHIC_RELATIONS_ORDER = Object.freeze([
    SITE_RELATION,
    BUILDING_RELATION,
    FLOOR_RELATION,
    ZONE_RELATION,
    ROOM_RELATION,
    EQUIPMENT_RELATION,
]);
exports.GEOGRAPHIC_RELATIONS_ORDER = GEOGRAPHIC_RELATIONS_ORDER;
const MAP_TYPE_RELATION = Object.freeze(new Map([
    [SITE_TYPE, SITE_RELATION],
    [BUILDING_TYPE, BUILDING_RELATION],
    [FLOOR_TYPE, FLOOR_RELATION],
    [ZONE_TYPE, ZONE_RELATION],
    [ROOM_TYPE, ROOM_RELATION],
    [EQUIPMENT_TYPE, EQUIPMENT_RELATION],
]));
exports.MAP_TYPE_RELATION = MAP_TYPE_RELATION;
const MAP_RELATION_TYPE = Object.freeze(new Map([
    [SITE_RELATION, SITE_TYPE],
    [BUILDING_RELATION, BUILDING_TYPE],
    [FLOOR_RELATION, FLOOR_TYPE],
    [ZONE_RELATION, ZONE_TYPE],
    [ROOM_RELATION, ROOM_TYPE],
    [EQUIPMENT_RELATION, EQUIPMENT_TYPE],
]));
exports.MAP_RELATION_TYPE = MAP_RELATION_TYPE;
//# sourceMappingURL=constants.js.map