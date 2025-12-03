import { SpinalStep } from 'spinal-models-ticket/declarations/SpinalStep';
export declare const SERVICE_NAME: string;
export declare const SERVICE_TYPE: string;
export declare const SPINAL_TICKET_SERVICE_TICKET_RELATION_TYPE: string;
export declare const SPINAL_TICKET_SERVICE_TICKET_RELATION_NAME: string;
export declare const SPINAL_TICKET_SERVICE_TICKET_TYPE: string;
/**
 * New values
 */
export declare const SPINAL_TICKET_SERVICE_PROCESS_RELATION_TYPE: string;
export declare const SPINAL_TICKET_SERVICE_PROCESS_RELATION_NAME: string;
export declare const PROCESS_TYPE: string;
/**
 * New values
 */
export declare const SPINAL_TICKET_SERVICE_STEP_RELATION_TYPE: string;
export declare const SPINAL_TICKET_SERVICE_STEP_TYPE: string;
export declare const SPINAL_TICKET_SERVICE_STEP_RELATION_NAME: string;
/**
 * New values
 */
export declare const ARCHIVED_STEP: {
    name: string;
    order: number;
    color: string;
};
export declare const DEFAULT_STEPS: SpinalStep[];
export declare const SPINAL_TICKET_SERVICE_INCIDENT_SECTION_RELATION_TYPE: string;
export declare const SPINAL_TICKET_SERVICE_INCIDENT_RELATION_TYPE: string;
export declare const SPINAL_TICKET_SERVICE_INCIDENT_SECTION_TYPE: string;
export declare const SPINAL_TICKET_SERVICE_INCIDENT_RELATION_NAME: string;
export declare const SPINAL_TICKET_SERVICE_INCIDENT_SECTION_RELATION_NAME: string;
export declare const SPINAL_TICKET_SERVICE_INCIDENT_TYPE: string;
export declare const DEFAULT_INCIDENTS_NAME: string;
export declare const SPINAL_TICKET_SERVICE_LOG_RELATION_TYPE: string;
export declare const SPINAL_TICKET_SERVICE_LOG_RELATION_NAME: string;
export declare const SERVICE_LOG_TYPE: string;
export declare enum LOGS_EVENTS {
    creation = 1,
    moveToNext = 2,
    moveToPrevious = 3,
    archived = 4,
    unarchive = 5,
    move = 6
}
export declare const EVENTS_TO_LOG: Readonly<{
    1: "creation";
    2: "moveToNext";
    3: "moveToPrevious";
    4: "archived";
    5: "unarchive";
    6: "move";
}>;
export declare const LOG_RELATION_TYPE: string;
export declare const LOG_RELATION_NAME: string;
export declare const LOG_TYPE: string;
export declare const LOGS_EVENTS_STEPS: typeof LOGS_EVENTS;
export declare const LOGS_EVENTS_STRING: string[];
export declare const TICKET_PRIORITIES: {
    [key: string]: number;
};
