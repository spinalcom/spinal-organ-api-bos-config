# 03.11.22

- Ajout de la fonctionnalité "Alarmes" dans le context de ticket : modification de createContext() et addTicket(), ajout de la fonction getAlarmsFromNode() et de constantes

# 13.10.23 - 0.1.8

Archive functions:

- getTicketsFromArchive(processOrSpatialNode: string | SpinalNode, begin: moment.MomentInput, end: moment.MomentInput): Promise<SpinalNode<any>[]>;
- getTicketsFromArchiveGen(processOrSpatialNode: string | SpinalNode, begin: moment.MomentInput, end: moment.MomentInput): AsyncGenerator<SpinalNode<any>, void, unknown>;
- deleteTicketFromArchive(processOrSpatialNode: string | SpinalNode, begin: number, end: number): Promise<void>;
- archiveTicketFromProcess(ticketNode: string | SpinalNode, processNode: string | SpinalNode, date: moment.MomentInput, maxArchiveSize?: number): Promise<void>;
- archiveTicketFromSpatial(ticketNode: string | SpinalNode, spatialNode: string | SpinalNode, date: moment.MomentInput, maxArchiveSize?: number): Promise<void>;

The methods `archiveTicketFromProcess` and `archiveTicketFromSpatial` need to be called in a synchronous way AND sorted by date for the Process / Spatial node.
It's not an `insert` methods but just a `push_back`.

# 37.10.23 - 0.1.9

- catch error remove child

# 37.10.23 - 0.1.10

bug fix get archive part
