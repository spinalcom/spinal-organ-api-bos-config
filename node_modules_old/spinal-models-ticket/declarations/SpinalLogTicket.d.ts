import { Model } from "spinal-core-connectorjs_type";
export interface SpinalLogTicketInterface {
    id?: string;
    ticketId?: string;
    event?: number;
    user?: any;
    steps?: string[];
    [key: string]: any;
}
export declare class SpinalLogTicket extends Model {
    constructor(log: SpinalLogTicketInterface);
}
