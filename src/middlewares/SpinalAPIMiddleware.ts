/*
 * Copyright 2022 SpinalCom - www.spinalcom.com
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

import { FileSystem, Model, spinalCore, File as SpinalFile } from "spinal-core-connectorjs";
import { SpinalContext, SpinalGraph, SpinalGraphService, SpinalNode } from "spinal-env-viewer-graph-service";
import { IConfig, ISpinalAPIMiddleware } from "spinal-organ-api-server";
import { EXCLUDES_TYPES, HTTP_CODES } from "../constant";
import { AppProfileService, AppService, DigitalTwinService, UserProfileService } from "../services";
import { AdminProfileService } from "../services/adminProfile.service";
import { DIRECTORY_NODE_TYPE, FILE_NODE_TYPE, TO_FILE_RELATION, TO_FOLDER_RELATION, TO_ROOT_DIRECTORY_RELATION } from "spinal-env-viewer-plugin-documentation-service/dist/Models/constants";
import { parseTimeOfDay, parseDuration } from "../utils/parseTime";

// node types of the documents (files and directories) of the documentation service
const DOCUMENT_NODE_TYPES = [FILE_NODE_TYPE, DIRECTORY_NODE_TYPE];
// relations linking a document node to its parents : directory -> file, directory -> directory, owner -> root directory
const DOCUMENT_PARENT_RELATIONS = [TO_FILE_RELATION, TO_FOLDER_RELATION, TO_ROOT_DIRECTORY_RELATION];
// upper bound of nodes visited while looking for an authorized parent of a document
const MAX_DOCUMENT_PARENTS_VISITED = 500;


export default class SpinalAPIMiddleware implements ISpinalAPIMiddleware {
	config: IConfig = {
		spinalConnector: {
			protocol: process.env.HUB_PROTOCOL || "http",
			user: process.env.USER_ID,
			password: process.env.USER_MDP,
			host: process.env.HUB_HOST,
			port: process.env.HUB_PORT,
		},
		api: {
			port: process.env.SERVER_PORT,
		},
		file: {
			path: process.env.CONFIG_DIRECTORY_PATH,
		},
		preload: {
			workHoursStart: parseTimeOfDay(process.env.WORK_HOURS_START, 8 * 60),
			workHoursEnd: parseTimeOfDay(process.env.WORK_HOURS_END, 19 * 60),
			idleDelay: parseDuration(process.env.PRELOAD_IDLE_DELAY, 2000),
			batchSize: parseDuration(process.env.PRELOAD_BATCH_SIZE, 20) || 20,
			batchDelay: parseDuration(process.env.PRELOAD_BATCH_DELAY, 50),
		}
	};
	conn: FileSystem | undefined;

	loadedPtr: Map<number, any> = new Map();
	iteratorGraph: AsyncGenerator<SpinalGraph<any>, never> = this._geneGraph();
	profilesToGraph: Map<string, SpinalGraph> = new Map();
	private static instance: SpinalAPIMiddleware;
	graph: SpinalGraph | undefined;

	private constructor() { }

	static getInstance(): SpinalAPIMiddleware {
		if (!this.instance) this.instance = new SpinalAPIMiddleware();
		return this.instance;
	}

	public setConnection(conn: spinal.FileSystem) {
		this.conn = conn;
	}

	async getGraph(): Promise<SpinalGraph<any>> {
		const next = await this.iteratorGraph.next();
		return next.value;
	}

	async getProfileGraph(profileId: string): Promise<SpinalGraph> {
		let graph: any = this.profilesToGraph.get(profileId);
		if (graph) return graph;

		graph = await AppProfileService.getInstance().getAppProfileNodeGraph(profileId);
		if (!graph) graph = await UserProfileService.getInstance().getUserProfileNodeGraph(profileId);

		if (!graph) throw { code: 401, message: `No graph found for ${profileId}` };

		this.profilesToGraph.set(profileId, graph);
		return graph;
	}

	addProfileToMap(profileId: string, graph: SpinalGraph) {
		this.profilesToGraph.set(profileId, graph);
	}

	async load<T extends Model>(server_id: number, profileId: string): Promise<T> {
		if (!server_id) return Promise.reject({ code: 406, message: "Invalid serverId" });

		if (!profileId) return Promise.reject({ code: HTTP_CODES.UNAUTHORIZED, message: "Unauthorized" });

		const model = FileSystem._objects[server_id];
		if (!model) return this._loadwithConnect(server_id, profileId);

		return this._checkModelAccess<T>(model, server_id, profileId);
	}

	loadPtr<T extends Model>(ptr: spinal.File<T> | spinal.Ptr<T> | spinal.Pbr<T>): Promise<T> {
		if (ptr instanceof spinalCore._def["File"]) return this.loadPtr(ptr._ptr);
		const server_id = ptr.data.value;

		if (this.loadedPtr.has(server_id)) {
			return this.loadedPtr.get(server_id);
		}

		const prom: Promise<T> = new Promise((resolve, reject) => {
			try {
				if (!this.conn) return reject(new Error("No connection available"));

				this.conn.load_ptr(server_id, (model: T) => {
					if (!model) {
						reject(new Error(`LoadedPtr Error server_id: '${server_id}'`));
					} else {
						resolve(model);
					}
				});
			} catch (e) {
				reject(e);
			}
		});
		this.loadedPtr.set(server_id, prom);
		return prom;
	}

	//////////////////////////////////////////////
	//               PRIVATES                   //
	//////////////////////////////////////////////

	private async *_geneGraph(): AsyncGenerator<SpinalGraph, never> {
		await this.setGraph();
		while (true) {
			yield this.graph!;
		}
	}

	async setGraph(actualDigitalTwin?: SpinalNode) {
		if (!actualDigitalTwin) {
			actualDigitalTwin = await DigitalTwinService.getInstance().getActualDigitalTwin();
		}
		const url = actualDigitalTwin.info.url.get();
		const graph = await this._loadNewGraph(url);
		this.graph = graph;
		await SpinalGraphService.setGraph(graph);
		return graph;
	}

	private _loadNewGraph(path: string): Promise<SpinalGraph> {
		return new Promise<SpinalGraph<any>>((resolve, reject) => {
			if (!this.conn) return reject(new Error("No connection available"));

			spinalCore.load(
				this.conn,
				path,
				(graph: any) => resolve(graph),
				() => {
					console.error(`File does not exist in location ${path}`);
					reject();
				},
			);
		});
	}

	private _loadwithConnect<T extends spinal.Model>(server_id: number, profileId: string): Promise<T> {
		return new Promise((resolve, reject) => {
			if (!this.conn) return reject(new Error("No connection available"));

			try {
				// the connector does not handle the callback result : it must never throw nor return a rejected promise
				this.conn.load_ptr(server_id, (model: T) => {
					if (!model) return reject({ code: HTTP_CODES.NOT_FOUND, message: "Node is not found" });

					this._checkModelAccess<T>(model, server_id, profileId).then(resolve, reject);
				});
			} catch (error) {
				reject(this._toHttpError(error));
			}
		});
	}

	/**
	 * Returns the model if the profile can access it :
	 * - a node must belong to an authorized context (see _nodeIsBelongUserContext) ;
	 * - a file (or document) must be linked to a node accessible to the profile (see _fileIsAccessible).
	 * Any other model (Lst, Ptr, Path, FileVersion...) is refused.
	 * A refused model rejects the returned promise with a { code, message } error.
	 */
	private async _checkModelAccess<T>(model: any, server_id: number, profileId: string): Promise<T> {
		let authorized = false;

		try {
			if (model instanceof SpinalNode) {
				authorized = await this._nodeIsBelongUserContext(model, profileId);
				// @ts-ignore
				if (authorized) SpinalGraphService._addNode(model);
			} else if (model instanceof SpinalFile) {
				authorized = await this._fileIsAccessible(model, profileId);
			} else {
				return Promise.reject({ code: HTTP_CODES.BAD_REQUEST, message: `The id ${server_id} does not refer to a node nor a file` });
			}
		} catch (error) {
			return Promise.reject(this._toHttpError(error));
		}

		if (!authorized) return Promise.reject({ code: HTTP_CODES.UNAUTHORIZED, message: "Unauthorized" });
		return <T>model;
	}

	private _toHttpError(error: any): { code: number; message: string } {
		if (error?.code && error?.message) return error;
		return { code: HTTP_CODES.INTERNAL_ERROR, message: error?.message || String(error) };
	}

	private async _nodeIsBelongUserContext(node: SpinalNode<any>, profileId: string): Promise<boolean> {
		const type = node.getType().get();
		if (EXCLUDES_TYPES.indexOf(type) !== -1) return true;

		const contexts = await this._getProfileContexts(profileId);
		if (this._nodeBelongsToContexts(node, contexts)) return true;

		// a document is also accessible through the objects it is linked to (directories, then the owner of the root directory)
		if (DOCUMENT_NODE_TYPES.indexOf(type) !== -1) return this._documentNodeIsLinkedToUserContext(node, contexts, profileId);

		return false;
	}

	private _nodeBelongsToContexts(node: SpinalNode<any>, contexts: SpinalNode<any>[]): boolean {
		const found = contexts.find((context) => {
			if (node instanceof SpinalContext) return node.getId().get() === context.getId().get();
			return node.belongsToContext(<SpinalContext>context);
		});
		return found ? true : false;
	}

	/**
	 * Walks up the parents of a document node through the directories (DirectoryhasFiles, DirectoryhasDirectory)
	 * up to the root directory and its owner (hasFiles).
	 * A directory is authorized if it belongs to an authorized context ; an owner (room, equipment, ticket...)
	 * is authorized with the same rule as any other node and is not walked through.
	 */
	private async _documentNodeIsLinkedToUserContext(documentNode: SpinalNode<any>, contexts: SpinalNode<any>[], profileId: string): Promise<boolean> {
		const visited = new Set<SpinalNode<any>>([documentNode]);
		let queue: SpinalNode<any>[] = [documentNode];

		while (queue.length > 0) {
			const nextQueue: SpinalNode<any>[] = [];

			for (const node of queue) {
				const parents = await node.getParents(DOCUMENT_PARENT_RELATIONS);

				for (const parent of parents) {
					if (visited.has(parent)) continue;
					if (visited.size >= MAX_DOCUMENT_PARENTS_VISITED) return false;
					visited.add(parent);

					const parentType = parent.getType().get();
					if (DOCUMENT_NODE_TYPES.indexOf(parentType) === -1) {
						if (await this._nodeIsBelongUserContext(parent, profileId)) return true;
						continue;
					}

					if (this._nodeBelongsToContexts(parent, contexts)) return true;
					nextQueue.push(parent);
				}
			}

			queue = nextQueue;
		}

		return false;
	}

	/**
	 * A file is accessible if the node it refers to (SpinalDocument or file converted by the documentation service)
	 * is accessible. A file that can't be attached to any node (e.g. an old Drive file) is reserved to the admin profile.
	 */
	private async _fileIsAccessible(file: SpinalFile<any>, profileId: string): Promise<boolean> {
		const fileNode = await this._getFileNode(file);
		if (fileNode) return this._nodeIsBelongUserContext(fileNode, profileId);

		return this._isAdminProfile(profileId);
	}

	private async _getFileNode(file: SpinalFile<any>): Promise<SpinalNode<any> | undefined> {
		let node: any;
		const anyFile: any = file;

		if (typeof anyFile.getNode === "function") {
			node = await anyFile.getNode();
		} else {
			const nodePtr = anyFile._info?.node;
			if (!nodePtr || typeof nodePtr.load !== "function") return;
			node = await new Promise((resolve) => nodePtr.load((element: any) => resolve(element)));
		}

		if (!(node instanceof SpinalNode)) return;

		// the node must refer back to the file, otherwise the link is not reliable
		const elementPtr: any = node.element;
		const refersToFile = elementPtr?.data?.model === file || (!!file._server_id && elementPtr?.data?.value === file._server_id);
		return refersToFile ? node : undefined;
	}

	private _isAdminProfile(profileId: string): boolean {
		const adminNode = AdminProfileService.getInstance().adminNode;
		return !!adminNode && adminNode.getId().get() === profileId;
	}

	private async _getProfileContexts(profileId: string): Promise<SpinalNode<any>[]> {
		const graph = await this.getProfileGraph(profileId);
		if (!graph) throw new Error("no graph found");

		const contexts = await graph.getChildren(["hasContext"]);

		//addContext to SpinalNode map
		return contexts.map((context) => {
			//@ts-ignore
			SpinalGraphService._addNode(context);
			return context;
		});
	}
}

export { SpinalAPIMiddleware };
