/* tslint:disable */
/* eslint-disable */
export class HeatmapData {
  free(): void;
  /**
   * @param {number} width
   * @param {number} height
   * @returns {HeatmapData}
   */
  static new(width: number, height: number): HeatmapData;
  /**
   * @returns {number}
   */
  width(): number;
  /**
   * @returns {number}
   */
  height(): number;
  update(): void;
  /**
   * @returns {Uint8Array}
   */
  get_data(): Uint8Array;
  /**
   * @param {number} y
   * @returns {Float64Array}
   */
  get_row_data(y: number): Float64Array;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly __wbg_heatmapdata_free: (a: number, b: number) => void;
  readonly heatmapdata_new: (a: number, b: number) => number;
  readonly heatmapdata_width: (a: number) => number;
  readonly heatmapdata_height: (a: number) => number;
  readonly heatmapdata_update: (a: number) => void;
  readonly heatmapdata_get_data: (a: number, b: number) => void;
  readonly heatmapdata_get_row_data: (a: number, b: number, c: number) => void;
  readonly __wbindgen_add_to_stack_pointer: (a: number) => number;
  readonly __wbindgen_free: (a: number, b: number, c: number) => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;
/**
* Instantiates the given `module`, which can either be bytes or
* a precompiled `WebAssembly.Module`.
*
* @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
*
* @returns {InitOutput}
*/
export function initSync(module: { module: SyncInitInput } | SyncInitInput): InitOutput;

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
*
* @returns {Promise<InitOutput>}
*/
export default function __wbg_init (module_or_path?: { module_or_path: InitInput | Promise<InitInput> } | InitInput | Promise<InitInput>): Promise<InitOutput>;
