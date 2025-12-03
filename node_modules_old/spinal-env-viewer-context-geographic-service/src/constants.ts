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

const CONTEXT_TYPE = 'geographicContext';
const SITE_TYPE = 'geographicSite';
const BUILDING_TYPE = 'geographicBuilding';
const FLOOR_TYPE = 'geographicFloor';
const ZONE_TYPE = 'geographicZone';
const ROOM_TYPE = 'geographicRoom';
const EQUIPMENT_TYPE = 'BIMObject';
const REFERENCE_TYPE = 'geographicReference';

const SITE_RELATION = 'hasGeographicSite';
const BUILDING_RELATION = 'hasGeographicBuilding';
const FLOOR_RELATION = 'hasGeographicFloor';
const ZONE_RELATION = 'hasGeographicZone';
const ROOM_RELATION = 'hasGeographicRoom';
const EQUIPMENT_RELATION = 'hasBimObject';
const REFERENCE_RELATION = 'hasReferenceObject';
const REFERENCE_ROOM_RELATION = 'hasReferenceObject.ROOM';

const SITE_REFERENCE_CONTEXT = '.SiteContext';
const BUILDING_REFERENCE_CONTEXT = '.BuildingContext';
const FLOOR_REFERENCE_CONTEXT = '.FloorContext';
const ZONE_REFERENCE_CONTEXT = '.ZoneContext';
const ROOM_REFERENCE_CONTEXT = '.RoomContext';

const GEOGRAPHIC_TYPES = Object.freeze([
  SITE_TYPE,
  BUILDING_TYPE,
  FLOOR_TYPE,
  ZONE_TYPE,
  ROOM_TYPE,
]) as string[];

const GEOGRAPHIC_TYPES_ORDER = Object.freeze([
  CONTEXT_TYPE,
  SITE_TYPE,
  BUILDING_TYPE,
  FLOOR_TYPE,
  ZONE_TYPE,
  ROOM_TYPE,
  EQUIPMENT_TYPE,
]) as string[];

const GEOGRAPHIC_RELATIONS = Object.freeze([
  SITE_RELATION,
  BUILDING_RELATION,
  FLOOR_RELATION,
  ZONE_RELATION,
  ROOM_RELATION,
  EQUIPMENT_RELATION,
]) as string[];

const GEOGRAPHIC_RELATIONS_ORDER = Object.freeze([
  SITE_RELATION,
  BUILDING_RELATION,
  FLOOR_RELATION,
  ZONE_RELATION,
  ROOM_RELATION,
  EQUIPMENT_RELATION,
]) as string[];

const MAP_TYPE_RELATION = Object.freeze(
  new Map([
    [SITE_TYPE, SITE_RELATION],
    [BUILDING_TYPE, BUILDING_RELATION],
    [FLOOR_TYPE, FLOOR_RELATION],
    [ZONE_TYPE, ZONE_RELATION],
    [ROOM_TYPE, ROOM_RELATION],
    [EQUIPMENT_TYPE, EQUIPMENT_RELATION],
  ])
) as Map<string, string>;

const MAP_RELATION_TYPE = Object.freeze(
  new Map([
    [SITE_RELATION, SITE_TYPE],
    [BUILDING_RELATION, BUILDING_TYPE],
    [FLOOR_RELATION, FLOOR_TYPE],
    [ZONE_RELATION, ZONE_TYPE],
    [ROOM_RELATION, ROOM_TYPE],
    [EQUIPMENT_RELATION, EQUIPMENT_TYPE],
  ])
) as Map<string, string>;

export {
  CONTEXT_TYPE,
  SITE_TYPE,
  BUILDING_TYPE,
  FLOOR_TYPE,
  ZONE_TYPE,
  ROOM_TYPE,
  GEOGRAPHIC_TYPES,
  EQUIPMENT_TYPE,
  GEOGRAPHIC_TYPES_ORDER,
  SITE_RELATION,
  BUILDING_RELATION,
  FLOOR_RELATION,
  ZONE_RELATION,
  ROOM_RELATION,
  GEOGRAPHIC_RELATIONS,
  EQUIPMENT_RELATION,
  GEOGRAPHIC_RELATIONS_ORDER,
  MAP_TYPE_RELATION,
  MAP_RELATION_TYPE,
  REFERENCE_TYPE,
  REFERENCE_RELATION,
  SITE_REFERENCE_CONTEXT,
  BUILDING_REFERENCE_CONTEXT,
  FLOOR_REFERENCE_CONTEXT,
  ZONE_REFERENCE_CONTEXT,
  ROOM_REFERENCE_CONTEXT,
  REFERENCE_ROOM_RELATION
};
