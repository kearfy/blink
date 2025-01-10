/* tslint:disable */
/* eslint-disable */

	type CapabilitiesAllowDenyList = {
		allow?: boolean | string[];
		deny?: boolean | string[];
	};

	type ConnectionOptions = {
		strict?: boolean;
		query_timeout?: number;
		transaction_timeout?: number;
		capabilities?: boolean | {
			scripting?: boolean;
			guest_access?: boolean;
			live_query_notifications?: boolean;
			functions?: boolean | string[] | CapabilitiesAllowDenyList;
			network_targets?: boolean | string[] | CapabilitiesAllowDenyList;
		}
	}


export class IntoUnderlyingByteSource {
  free(): void;
  /**
   * @param {ReadableByteStreamController} controller
   */
  start(controller: ReadableByteStreamController): void;
  /**
   * @param {ReadableByteStreamController} controller
   * @returns {Promise<any>}
   */
  pull(controller: ReadableByteStreamController): Promise<any>;
  cancel(): void;
  readonly autoAllocateChunkSize: number;
  readonly type: any;
}
export class IntoUnderlyingSink {
  free(): void;
  /**
   * @param {any} chunk
   * @returns {Promise<any>}
   */
  write(chunk: any): Promise<any>;
  /**
   * @returns {Promise<any>}
   */
  close(): Promise<any>;
  /**
   * @param {any} reason
   * @returns {Promise<any>}
   */
  abort(reason: any): Promise<any>;
}
export class IntoUnderlyingSource {
  free(): void;
  /**
   * @param {ReadableStreamDefaultController} controller
   * @returns {Promise<any>}
   */
  pull(controller: ReadableStreamDefaultController): Promise<any>;
  cancel(): void;
}
export class SurrealWasmEngine {
  free(): void;
  /**
   * @param {Uint8Array} data
   * @returns {Promise<Uint8Array>}
   */
  execute(data: Uint8Array): Promise<Uint8Array>;
  /**
   * @returns {ReadableStream}
   */
  notifications(): ReadableStream;
  /**
   * @param {string} endpoint
   * @param {ConnectionOptions | undefined} [opts]
   * @returns {Promise<SurrealWasmEngine>}
   */
  static connect(endpoint: string, opts?: ConnectionOptions): Promise<SurrealWasmEngine>;
  /**
   * @param {Uint8Array | undefined} [config]
   * @returns {Promise<string>}
   */
  export(config?: Uint8Array): Promise<string>;
  /**
   * @returns {string}
   */
  static version(): string;
}
