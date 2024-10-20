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
   * @param {number} x
   * @param {number} y
   * @param {number} value
   */
  set_value(x: number, y: number, value: number): void;
  /**
   * @returns {Uint8Array}
   */
  get_data(): Uint8Array;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly __wbg_heatmapdata_free: (a: number, b: number) => void;
  readonly heatmapdata_new: (a: number, b: number) => number;
  readonly heatmapdata_set_value: (a: number, b: number, c: number, d: number) => void;
  readonly heatmapdata_get_data: (a: number, b: number) => void;
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
