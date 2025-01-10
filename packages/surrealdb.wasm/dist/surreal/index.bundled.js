const Deno =
	globalThis.Deno ??
	(typeof global > "u"
		? void 0
		: { readFile: (await import("node:fs")).readFileSync });
const module = await (async () => {
	const crypto2 = globalThis.crypto ?? (await import("node:crypto"));
	return {
		require: (string) => {
			if (string !== "crypto") throw new Error(`Unexpected require ${string}`);
			return crypto2;
		},
	};
})();
const heap = new Array(128).fill(void 0);
heap.push(void 0, null, !0, !1);
function getObject(idx) {
	return heap[idx];
}
const cachedTextDecoder =
	typeof TextDecoder < "u"
		? new TextDecoder("utf-8", { ignoreBOM: !0, fatal: !0 })
		: {
				decode: () => {
					throw Error("TextDecoder not available");
				},
			};
typeof TextDecoder < "u" && cachedTextDecoder.decode();
let cachedUint8ArrayMemory0 = null;
function getUint8ArrayMemory0() {
	return (
		(cachedUint8ArrayMemory0 === null ||
			cachedUint8ArrayMemory0.byteLength === 0) &&
			(cachedUint8ArrayMemory0 = new Uint8Array(wasm.memory.buffer)),
		cachedUint8ArrayMemory0
	);
}
function getStringFromWasm0(ptr, len) {
	return (
		(ptr = ptr >>> 0),
		cachedTextDecoder.decode(getUint8ArrayMemory0().subarray(ptr, ptr + len))
	);
}
let heap_next = heap.length;
function addHeapObject(obj) {
	heap_next === heap.length && heap.push(heap.length + 1);
	const idx = heap_next;
	return (heap_next = heap[idx]), (heap[idx] = obj), idx;
}
function dropObject(idx) {
	idx < 132 || ((heap[idx] = heap_next), (heap_next = idx));
}
function takeObject(idx) {
	const ret = getObject(idx);
	return dropObject(idx), ret;
}
function isLikeNone(x) {
	return x == null;
}
let cachedDataViewMemory0 = null;
function getDataViewMemory0() {
	return (
		(cachedDataViewMemory0 === null ||
			cachedDataViewMemory0.buffer.detached === !0 ||
			(cachedDataViewMemory0.buffer.detached === void 0 &&
				cachedDataViewMemory0.buffer !== wasm.memory.buffer)) &&
			(cachedDataViewMemory0 = new DataView(wasm.memory.buffer)),
		cachedDataViewMemory0
	);
}
let WASM_VECTOR_LEN = 0;
const cachedTextEncoder =
	typeof TextEncoder < "u"
		? new TextEncoder("utf-8")
		: {
				encode: () => {
					throw Error("TextEncoder not available");
				},
			};
const encodeString = (arg, view) => cachedTextEncoder.encodeInto(arg, view);
function passStringToWasm0(arg, malloc, realloc) {
	if (realloc === void 0) {
		const buf = cachedTextEncoder.encode(arg);
		const ptr2 = malloc(buf.length, 1) >>> 0;
		return (
			getUint8ArrayMemory0()
				.subarray(ptr2, ptr2 + buf.length)
				.set(buf),
			(WASM_VECTOR_LEN = buf.length),
			ptr2
		);
	}
	let len = arg.length;
	let ptr = malloc(len, 1) >>> 0;
	const mem = getUint8ArrayMemory0();
	let offset = 0;
	for (; offset < len; offset++) {
		const code = arg.charCodeAt(offset);
		if (code > 127) break;
		mem[ptr + offset] = code;
	}
	if (offset !== len) {
		offset !== 0 && (arg = arg.slice(offset)),
			(ptr = realloc(ptr, len, (len = offset + arg.length * 3), 1) >>> 0);
		const view = getUint8ArrayMemory0().subarray(ptr + offset, ptr + len);
		const ret = encodeString(arg, view);
		(offset += ret.written), (ptr = realloc(ptr, len, offset, 1) >>> 0);
	}
	return (WASM_VECTOR_LEN = offset), ptr;
}
function debugString(val) {
	const type = typeof val;
	if (type === "number" || type === "boolean" || val == null) return `${val}`;
	if (type === "string") return `"${val}"`;
	if (type === "symbol") {
		const description = val.description;
		return description == null ? "Symbol" : `Symbol(${description})`;
	}
	if (type === "function") {
		const name = val.name;
		return typeof name === "string" && name.length > 0
			? `Function(${name})`
			: "Function";
	}
	if (Array.isArray(val)) {
		const length = val.length;
		let debug = "[";
		length > 0 && (debug += debugString(val[0]));
		for (let i = 1; i < length; i++) debug += `, ${debugString(val[i])}`;
		return (debug += "]"), debug;
	}
	const builtInMatches = /\[object ([^\]]+)\]/.exec(toString.call(val));
	let className;
	if (builtInMatches.length > 1) className = builtInMatches[1];
	else return toString.call(val);
	if (className === "Object")
		try {
			return `Object(${JSON.stringify(val)})`;
		} catch {
			return "Object";
		}
	return val instanceof Error
		? `${val.name}: ${val.message}
${val.stack}`
		: className;
}
const CLOSURE_DTORS =
	typeof FinalizationRegistry > "u"
		? { register: () => {}, unregister: () => {} }
		: new FinalizationRegistry((state) => {
				wasm.__wbindgen_export_2.get(state.dtor)(state.a, state.b);
			});
function makeMutClosure(arg0, arg1, dtor, f2) {
	const state = { a: arg0, b: arg1, cnt: 1, dtor };
	const real = (...args) => {
		state.cnt++;
		const a = state.a;
		state.a = 0;
		try {
			return f2(a, state.b, ...args);
		} finally {
			--state.cnt === 0
				? (wasm.__wbindgen_export_2.get(state.dtor)(a, state.b),
					CLOSURE_DTORS.unregister(state))
				: (state.a = a);
		}
	};
	return (
		(real.original = state), CLOSURE_DTORS.register(real, state, state), real
	);
}
function __wbg_adapter_52(arg0, arg1, arg2) {
	try {
		const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
		wasm.__wbindgen_export_3(retptr, arg0, arg1, addHeapObject(arg2));
		const r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, !0);
		const r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, !0);
		if (r1) throw takeObject(r0);
	} finally {
		wasm.__wbindgen_add_to_stack_pointer(16);
	}
}
function __wbg_adapter_55(arg0, arg1) {
	wasm.__wbindgen_export_4(arg0, arg1);
}
function __wbg_adapter_58(arg0, arg1, arg2) {
	wasm.__wbindgen_export_5(arg0, arg1, addHeapObject(arg2));
}
function handleError(f2, args) {
	try {
		return f2.apply(this, args);
	} catch (e) {
		wasm.__wbindgen_export_7(addHeapObject(e));
	}
}
function __wbg_adapter_324(arg0, arg1, arg2, arg3) {
	wasm.__wbindgen_export_8(
		arg0,
		arg1,
		addHeapObject(arg2),
		addHeapObject(arg3),
	);
}
const __wbindgen_enum_IdbCursorDirection = [
	"next",
	"nextunique",
	"prev",
	"prevunique",
];
const __wbindgen_enum_IdbTransactionMode = [
	"readonly",
	"readwrite",
	"versionchange",
	"readwriteflush",
	"cleanup",
];
const __wbindgen_enum_RequestCredentials = ["omit", "same-origin", "include"];
const __wbindgen_enum_RequestMode = [
	"same-origin",
	"no-cors",
	"cors",
	"navigate",
];
const IntoUnderlyingByteSourceFinalization =
	typeof FinalizationRegistry > "u"
		? { register: () => {}, unregister: () => {} }
		: new FinalizationRegistry((ptr) =>
				wasm.__wbg_intounderlyingbytesource_free(ptr >>> 0, 1),
			);
const IntoUnderlyingSinkFinalization =
	typeof FinalizationRegistry > "u"
		? { register: () => {}, unregister: () => {} }
		: new FinalizationRegistry((ptr) =>
				wasm.__wbg_intounderlyingsink_free(ptr >>> 0, 1),
			);
const IntoUnderlyingSourceFinalization =
	typeof FinalizationRegistry > "u"
		? { register: () => {}, unregister: () => {} }
		: new FinalizationRegistry((ptr) =>
				wasm.__wbg_intounderlyingsource_free(ptr >>> 0, 1),
			);
const IntoUnderlyingSource = class {
	static __wrap(ptr) {
		ptr = ptr >>> 0;
		const obj = Object.create(IntoUnderlyingSource.prototype);
		return (
			(obj.__wbg_ptr = ptr),
			IntoUnderlyingSourceFinalization.register(obj, obj.__wbg_ptr, obj),
			obj
		);
	}
	__destroy_into_raw() {
		const ptr = this.__wbg_ptr;
		return (
			(this.__wbg_ptr = 0),
			IntoUnderlyingSourceFinalization.unregister(this),
			ptr
		);
	}
	free() {
		const ptr = this.__destroy_into_raw();
		wasm.__wbg_intounderlyingsource_free(ptr, 0);
	}
	pull(controller) {
		const ret = wasm.intounderlyingsource_pull(
			this.__wbg_ptr,
			addHeapObject(controller),
		);
		return takeObject(ret);
	}
	cancel() {
		const ptr = this.__destroy_into_raw();
		wasm.intounderlyingsource_cancel(ptr);
	}
};
const SurrealWasmEngineFinalization =
	typeof FinalizationRegistry > "u"
		? { register: () => {}, unregister: () => {} }
		: new FinalizationRegistry((ptr) =>
				wasm.__wbg_surrealwasmengine_free(ptr >>> 0, 1),
			);
const SurrealWasmEngine = class {
	static __wrap(ptr) {
		ptr = ptr >>> 0;
		const obj = Object.create(SurrealWasmEngine.prototype);
		return (
			(obj.__wbg_ptr = ptr),
			SurrealWasmEngineFinalization.register(obj, obj.__wbg_ptr, obj),
			obj
		);
	}
	__destroy_into_raw() {
		const ptr = this.__wbg_ptr;
		return (
			(this.__wbg_ptr = 0), SurrealWasmEngineFinalization.unregister(this), ptr
		);
	}
	free() {
		const ptr = this.__destroy_into_raw();
		wasm.__wbg_surrealwasmengine_free(ptr, 0);
	}
	execute(data) {
		const ret = wasm.surrealwasmengine_execute(
			this.__wbg_ptr,
			addHeapObject(data),
		);
		return takeObject(ret);
	}
	notifications() {
		try {
			const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
			wasm.surrealwasmengine_notifications(retptr, this.__wbg_ptr);
			const r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, !0);
			const r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, !0);
			const r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, !0);
			if (r2) throw takeObject(r1);
			return takeObject(r0);
		} finally {
			wasm.__wbindgen_add_to_stack_pointer(16);
		}
	}
	static connect(endpoint, opts) {
		const ptr0 = passStringToWasm0(
			endpoint,
			wasm.__wbindgen_export_0,
			wasm.__wbindgen_export_1,
		);
		const len0 = WASM_VECTOR_LEN;
		const ret = wasm.surrealwasmengine_connect(
			ptr0,
			len0,
			isLikeNone(opts) ? 0 : addHeapObject(opts),
		);
		return takeObject(ret);
	}
	export(config) {
		const ret = wasm.surrealwasmengine_export(
			this.__wbg_ptr,
			isLikeNone(config) ? 0 : addHeapObject(config),
		);
		return takeObject(ret);
	}
	static version() {
		let deferred2_0;
		let deferred2_1;
		try {
			const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
			wasm.surrealwasmengine_version(retptr);
			const r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, !0);
			const r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, !0);
			const r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, !0);
			const r3 = getDataViewMemory0().getInt32(retptr + 4 * 3, !0);
			let ptr1 = r0;
			let len1 = r1;
			if (r3) throw ((ptr1 = 0), (len1 = 0), takeObject(r2));
			return (
				(deferred2_0 = ptr1),
				(deferred2_1 = len1),
				getStringFromWasm0(ptr1, len1)
			);
		} finally {
			wasm.__wbindgen_add_to_stack_pointer(16),
				wasm.__wbindgen_export_6(deferred2_0, deferred2_1, 1);
		}
	}
};
const imports = {
	__wbindgen_placeholder__: {
		__wbindgen_is_undefined: (arg0) => getObject(arg0) === void 0,
		__wbindgen_in: (arg0, arg1) => getObject(arg0) in getObject(arg1),
		__wbindgen_boolean_get: (arg0) => {
			const v = getObject(arg0);
			return typeof v === "boolean" ? (v ? 1 : 0) : 2;
		},
		__wbindgen_is_object: (arg0) => {
			const val = getObject(arg0);
			return typeof val === "object" && val !== null;
		},
		__wbindgen_error_new: (arg0, arg1) => {
			const ret = new Error(getStringFromWasm0(arg0, arg1));
			return addHeapObject(ret);
		},
		__wbindgen_jsval_eq: (arg0, arg1) => getObject(arg0) === getObject(arg1),
		__wbindgen_object_drop_ref: (arg0) => {
			takeObject(arg0);
		},
		__wbindgen_string_new: (arg0, arg1) => {
			const ret = getStringFromWasm0(arg0, arg1);
			return addHeapObject(ret);
		},
		__wbindgen_is_bigint: (arg0) => typeof getObject(arg0) === "bigint",
		__wbindgen_number_get: (arg0, arg1) => {
			const obj = getObject(arg1);
			const ret = typeof obj === "number" ? obj : void 0;
			getDataViewMemory0().setFloat64(
				arg0 + 8 * 1,
				isLikeNone(ret) ? 0 : ret,
				!0,
			),
				getDataViewMemory0().setInt32(arg0 + 4 * 0, !isLikeNone(ret), !0);
		},
		__wbindgen_bigint_from_i64: (arg0) => addHeapObject(arg0),
		__wbindgen_string_get: (arg0, arg1) => {
			const obj = getObject(arg1);
			const ret = typeof obj === "string" ? obj : void 0;
			const ptr1 = isLikeNone(ret)
				? 0
				: passStringToWasm0(
						ret,
						wasm.__wbindgen_export_0,
						wasm.__wbindgen_export_1,
					);
			const len1 = WASM_VECTOR_LEN;
			getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, !0),
				getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, !0);
		},
		__wbindgen_bigint_from_u64: (arg0) => {
			const ret = BigInt.asUintN(64, arg0);
			return addHeapObject(ret);
		},
		__wbg_surrealwasmengine_new: (arg0) => {
			const ret = SurrealWasmEngine.__wrap(arg0);
			return addHeapObject(ret);
		},
		__wbindgen_object_clone_ref: (arg0) => {
			const ret = getObject(arg0);
			return addHeapObject(ret);
		},
		__wbindgen_jsval_loose_eq: (arg0, arg1) =>
			getObject(arg0) === getObject(arg1),
		__wbindgen_as_number: (arg0) => +getObject(arg0),
		__wbg_String_b9412f8799faab3e: (arg0, arg1) => {
			const ret = String(getObject(arg1));
			const ptr1 = passStringToWasm0(
				ret,
				wasm.__wbindgen_export_0,
				wasm.__wbindgen_export_1,
			);
			const len1 = WASM_VECTOR_LEN;
			getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, !0),
				getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, !0);
		},
		__wbindgen_number_new: (arg0) => addHeapObject(arg0),
		__wbg_getwithrefkey_edc2c8960f0f1191: (arg0, arg1) => {
			const ret = getObject(arg0)[getObject(arg1)];
			return addHeapObject(ret);
		},
		__wbindgen_cb_drop: (arg0) => {
			const obj = takeObject(arg0).original;
			return obj.cnt-- === 1 ? ((obj.a = 0), !0) : !1;
		},
		__wbindgen_is_falsy: (arg0) => !getObject(arg0),
		__wbg_new_abda76e883ba8a5f: () => {
			const ret = new Error();
			return addHeapObject(ret);
		},
		__wbg_stack_658279fe44541cf6: (arg0, arg1) => {
			const ret = getObject(arg1).stack;
			const ptr1 = passStringToWasm0(
				ret,
				wasm.__wbindgen_export_0,
				wasm.__wbindgen_export_1,
			);
			const len1 = WASM_VECTOR_LEN;
			getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, !0),
				getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, !0);
		},
		__wbg_error_f851667af71bcfc6: (arg0, arg1) => {
			let deferred0_0;
			let deferred0_1;
			try {
				(deferred0_0 = arg0),
					(deferred0_1 = arg1),
					console.error(getStringFromWasm0(arg0, arg1));
			} finally {
				wasm.__wbindgen_export_6(deferred0_0, deferred0_1, 1);
			}
		},
		__wbg_performance_ffc4e815dfb3449f: (arg0) => {
			const ret = getObject(arg0).performance;
			return addHeapObject(ret);
		},
		__wbg_now_8799be02ba81a22e: (arg0) => getObject(arg0).now(),
		__wbg_setTimeout_2cb6c793c4aa44f8: () =>
			handleError(
				(arg0, arg1, arg2) => getObject(arg0).setTimeout(getObject(arg1), arg2),
				arguments,
			),
		__wbg_fetch_9b133f5ec268a7b8: (arg0) => {
			const ret = fetch(getObject(arg0));
			return addHeapObject(ret);
		},
		__wbg_newwithintounderlyingsource_5527e309da822cfb: (arg0, arg1) => {
			const ret = new ReadableStream(
				IntoUnderlyingSource.__wrap(arg0),
				takeObject(arg1),
			);
			return addHeapObject(ret);
		},
		__wbg_queueMicrotask_848aa4969108a57e: (arg0) => {
			const ret = getObject(arg0).queueMicrotask;
			return addHeapObject(ret);
		},
		__wbindgen_is_function: (arg0) => typeof getObject(arg0) === "function",
		__wbg_queueMicrotask_c5419c06eab41e73: (arg0) => {
			queueMicrotask(getObject(arg0));
		},
		__wbg_signal_9acfcec9e7dffc22: (arg0) => {
			const ret = getObject(arg0).signal;
			return addHeapObject(ret);
		},
		__wbg_new_75169ae5a9683c55: () =>
			handleError(() => {
				const ret = new AbortController();
				return addHeapObject(ret);
			}, arguments),
		__wbg_abort_c57daab47a6c1215: (arg0) => {
			getObject(arg0).abort();
		},
		__wbg_newwithu8arraysequenceandoptions_d41c0fdf78490206: () =>
			handleError((arg0, arg1) => {
				const ret = new Blob(getObject(arg0), getObject(arg1));
				return addHeapObject(ret);
			}, arguments),
		__wbg_settype_623d2ee701e6310a: (arg0, arg1, arg2) => {
			getObject(arg0).type = getStringFromWasm0(arg1, arg2);
		},
		__wbg_length_774a8b091f93d238: (arg0) => getObject(arg0).length,
		__wbg_contains_027db6e3929e2c2c: (arg0, arg1, arg2) =>
			getObject(arg0).contains(getStringFromWasm0(arg1, arg2)),
		__wbg_get_6272fbf6cb6a54f5: (arg0, arg1, arg2) => {
			const ret = getObject(arg1)[arg2 >>> 0];
			const ptr1 = isLikeNone(ret)
				? 0
				: passStringToWasm0(
						ret,
						wasm.__wbindgen_export_0,
						wasm.__wbindgen_export_1,
					);
			const len1 = WASM_VECTOR_LEN;
			getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, !0),
				getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, !0);
		},
		__wbg_target_b0499015ea29563d: (arg0) => {
			const ret = getObject(arg0).target;
			return isLikeNone(ret) ? 0 : addHeapObject(ret);
		},
		__wbg_new_4e7308fbedde3997: () =>
			handleError(() => {
				const ret = new FormData();
				return addHeapObject(ret);
			}, arguments),
		__wbg_append_7ee78799a92a9731: () =>
			handleError((arg0, arg1, arg2, arg3) => {
				getObject(arg0).append(getStringFromWasm0(arg1, arg2), getObject(arg3));
			}, arguments),
		__wbg_append_8135c71037096394: () =>
			handleError((arg0, arg1, arg2, arg3, arg4, arg5) => {
				getObject(arg0).append(
					getStringFromWasm0(arg1, arg2),
					getObject(arg3),
					getStringFromWasm0(arg4, arg5),
				);
			}, arguments),
		__wbg_append_43a4b1c9d5df4168: () =>
			handleError((arg0, arg1, arg2, arg3, arg4) => {
				getObject(arg0).append(
					getStringFromWasm0(arg1, arg2),
					getStringFromWasm0(arg3, arg4),
				);
			}, arguments),
		__wbg_new_a9ae04a5200606a5: () =>
			handleError(() => {
				const ret = new Headers();
				return addHeapObject(ret);
			}, arguments),
		__wbg_append_8b3e7f74a47ea7d5: () =>
			handleError((arg0, arg1, arg2, arg3, arg4) => {
				getObject(arg0).append(
					getStringFromWasm0(arg1, arg2),
					getStringFromWasm0(arg3, arg4),
				);
			}, arguments),
		__wbg_key_d369a32f7d9bb203: () =>
			handleError((arg0) => {
				const ret = getObject(arg0).key;
				return addHeapObject(ret);
			}, arguments),
		__wbg_advance_1426f786f7cacbf7: () =>
			handleError((arg0, arg1) => {
				getObject(arg0).advance(arg1 >>> 0);
			}, arguments),
		__wbg_continue_4028b17d3e4a708d: () =>
			handleError((arg0) => {
				getObject(arg0).continue();
			}, arguments),
		__wbg_value_b2fb99968ff262a1: () =>
			handleError((arg0) => {
				const ret = getObject(arg0).value;
				return addHeapObject(ret);
			}, arguments),
		__wbg_objectStoreNames_f1fecbfcef03f0b2: (arg0) => {
			const ret = getObject(arg0).objectStoreNames;
			return addHeapObject(ret);
		},
		__wbg_createObjectStore_57571f28302c49fb: () =>
			handleError((arg0, arg1, arg2, arg3) => {
				const ret = getObject(arg0).createObjectStore(
					getStringFromWasm0(arg1, arg2),
					getObject(arg3),
				);
				return addHeapObject(ret);
			}, arguments),
		__wbg_deleteObjectStore_953795ae210797aa: () =>
			handleError((arg0, arg1, arg2) => {
				getObject(arg0).deleteObjectStore(getStringFromWasm0(arg1, arg2));
			}, arguments),
		__wbg_transaction_43d82a46abc1aac6: () =>
			handleError((arg0, arg1, arg2) => {
				const ret = getObject(arg0).transaction(
					getObject(arg1),
					__wbindgen_enum_IdbTransactionMode[arg2],
				);
				return addHeapObject(ret);
			}, arguments),
		__wbg_instanceof_IdbFactory_c52f366d81841b3e: (arg0) => {
			let result;
			try {
				result = getObject(arg0) instanceof IDBFactory;
			} catch {
				result = !1;
			}
			return result;
		},
		__wbg_open_801f4a1d2f89716b: () =>
			handleError((arg0, arg1, arg2) => {
				const ret = getObject(arg0).open(getStringFromWasm0(arg1, arg2));
				return addHeapObject(ret);
			}, arguments),
		__wbg_open_24be520958657033: () =>
			handleError((arg0, arg1, arg2, arg3) => {
				const ret = getObject(arg0).open(
					getStringFromWasm0(arg1, arg2),
					arg3 >>> 0,
				);
				return addHeapObject(ret);
			}, arguments),
		__wbg_setmultientry_8e22297b5c50783f: (arg0, arg1) => {
			getObject(arg0).multiEntry = arg1 !== 0;
		},
		__wbg_setunique_d377cee4f9e0da93: (arg0, arg1) => {
			getObject(arg0).unique = arg1 !== 0;
		},
		__wbg_bound_7f3143b74beefea8: () =>
			handleError((arg0, arg1, arg2, arg3) => {
				const ret = IDBKeyRange.bound(
					getObject(arg0),
					getObject(arg1),
					arg2 !== 0,
					arg3 !== 0,
				);
				return addHeapObject(ret);
			}, arguments),
		__wbg_indexNames_cc6cd750b4c709d6: (arg0) => {
			const ret = getObject(arg0).indexNames;
			return addHeapObject(ret);
		},
		__wbg_createIndex_99802795748ed9b6: () =>
			handleError((arg0, arg1, arg2, arg3, arg4) => {
				const ret = getObject(arg0).createIndex(
					getStringFromWasm0(arg1, arg2),
					getObject(arg3),
					getObject(arg4),
				);
				return addHeapObject(ret);
			}, arguments),
		__wbg_delete_ea7c0b8da500c87c: () =>
			handleError((arg0, arg1) => {
				const ret = getObject(arg0).delete(getObject(arg1));
				return addHeapObject(ret);
			}, arguments),
		__wbg_deleteIndex_8f85ca977e808b3a: () =>
			handleError((arg0, arg1, arg2) => {
				getObject(arg0).deleteIndex(getStringFromWasm0(arg1, arg2));
			}, arguments),
		__wbg_get_8aadde94375925eb: () =>
			handleError((arg0, arg1) => {
				const ret = getObject(arg0).get(getObject(arg1));
				return addHeapObject(ret);
			}, arguments),
		__wbg_openCursor_6623d1a77709547f: () =>
			handleError((arg0) => {
				const ret = getObject(arg0).openCursor();
				return addHeapObject(ret);
			}, arguments),
		__wbg_openCursor_7aefea41d52995c1: () =>
			handleError((arg0, arg1) => {
				const ret = getObject(arg0).openCursor(getObject(arg1));
				return addHeapObject(ret);
			}, arguments),
		__wbg_openCursor_8cabd2dbaa332740: () =>
			handleError((arg0, arg1, arg2) => {
				const ret = getObject(arg0).openCursor(
					getObject(arg1),
					__wbindgen_enum_IdbCursorDirection[arg2],
				);
				return addHeapObject(ret);
			}, arguments),
		__wbg_put_1cbf36fae01483c9: () =>
			handleError((arg0, arg1) => {
				const ret = getObject(arg0).put(getObject(arg1));
				return addHeapObject(ret);
			}, arguments),
		__wbg_put_cd39df09d6a4bc25: () =>
			handleError((arg0, arg1, arg2) => {
				const ret = getObject(arg0).put(getObject(arg1), getObject(arg2));
				return addHeapObject(ret);
			}, arguments),
		__wbg_setautoincrement_ca2fcaf56d858f54: (arg0, arg1) => {
			getObject(arg0).autoIncrement = arg1 !== 0;
		},
		__wbg_setkeypath_f285167c6c9f91dd: (arg0, arg1) => {
			getObject(arg0).keyPath = getObject(arg1);
		},
		__wbg_setonupgradeneeded_cfde4e29e52161cb: (arg0, arg1) => {
			getObject(arg0).onupgradeneeded = getObject(arg1);
		},
		__wbg_result_4cac245a5afe6973: () =>
			handleError((arg0) => {
				const ret = getObject(arg0).result;
				return addHeapObject(ret);
			}, arguments),
		__wbg_error_5b9d0bd9ef24026d: () =>
			handleError((arg0) => {
				const ret = getObject(arg0).error;
				return isLikeNone(ret) ? 0 : addHeapObject(ret);
			}, arguments),
		__wbg_transaction_5d40f07c7331d084: (arg0) => {
			const ret = getObject(arg0).transaction;
			return isLikeNone(ret) ? 0 : addHeapObject(ret);
		},
		__wbg_setonsuccess_ecb76c4d9966a68d: (arg0, arg1) => {
			getObject(arg0).onsuccess = getObject(arg1);
		},
		__wbg_setonerror_601af2ccb639eba7: (arg0, arg1) => {
			getObject(arg0).onerror = getObject(arg1);
		},
		__wbg_setonabort_80241c753111eaba: (arg0, arg1) => {
			getObject(arg0).onabort = getObject(arg1);
		},
		__wbg_setoncomplete_d07971a3f474dfdc: (arg0, arg1) => {
			getObject(arg0).oncomplete = getObject(arg1);
		},
		__wbg_setonerror_e3339e6dd318429a: (arg0, arg1) => {
			getObject(arg0).onerror = getObject(arg1);
		},
		__wbg_abort_e823940113b36073: () =>
			handleError((arg0) => {
				getObject(arg0).abort();
			}, arguments),
		__wbg_objectStore_a367dc1c2a0d51b1: () =>
			handleError((arg0, arg1, arg2) => {
				const ret = getObject(arg0).objectStore(getStringFromWasm0(arg1, arg2));
				return addHeapObject(ret);
			}, arguments),
		__wbg_now_d3cbc9581625f686: (arg0) => getObject(arg0).now(),
		__wbg_sethighwatermark_3e325942406b05aa: (arg0, arg1) => {
			getObject(arg0).highWaterMark = arg1;
		},
		__wbg_byobRequest_86ac467c94924d3c: (arg0) => {
			const ret = getObject(arg0).byobRequest;
			return isLikeNone(ret) ? 0 : addHeapObject(ret);
		},
		__wbg_close_7cda9dd901230214: () =>
			handleError((arg0) => {
				getObject(arg0).close();
			}, arguments),
		__wbg_view_de0e81c5c00d2129: (arg0) => {
			const ret = getObject(arg0).view;
			return isLikeNone(ret) ? 0 : addHeapObject(ret);
		},
		__wbg_respond_ffb6928cd9b79c32: () =>
			handleError((arg0, arg1) => {
				getObject(arg0).respond(arg1 >>> 0);
			}, arguments),
		__wbg_close_cfd08d9cf9f36856: () =>
			handleError((arg0) => {
				getObject(arg0).close();
			}, arguments),
		__wbg_enqueue_e693a6fb4f3261c1: () =>
			handleError((arg0, arg1) => {
				getObject(arg0).enqueue(getObject(arg1));
			}, arguments),
		__wbg_newwithstrandinit_4b92c89af0a8e383: () =>
			handleError((arg0, arg1, arg2) => {
				const ret = new Request(
					getStringFromWasm0(arg0, arg1),
					getObject(arg2),
				);
				return addHeapObject(ret);
			}, arguments),
		__wbg_setbody_aa8b691bec428bf4: (arg0, arg1) => {
			getObject(arg0).body = getObject(arg1);
		},
		__wbg_setcredentials_a4e661320cdb9738: (arg0, arg1) => {
			getObject(arg0).credentials = __wbindgen_enum_RequestCredentials[arg1];
		},
		__wbg_setheaders_f5205d36e423a544: (arg0, arg1) => {
			getObject(arg0).headers = getObject(arg1);
		},
		__wbg_setmethod_ce2da76000b02f6a: (arg0, arg1, arg2) => {
			getObject(arg0).method = getStringFromWasm0(arg1, arg2);
		},
		__wbg_setmode_4919fd636102c586: (arg0, arg1) => {
			getObject(arg0).mode = __wbindgen_enum_RequestMode[arg1];
		},
		__wbg_setsignal_812ccb8269a7fd90: (arg0, arg1) => {
			getObject(arg0).signal = getObject(arg1);
		},
		__wbg_instanceof_Response_3c0e210a57ff751d: (arg0) => {
			let result;
			try {
				result = getObject(arg0) instanceof Response;
			} catch {
				result = !1;
			}
			return result;
		},
		__wbg_url_58af972663531d16: (arg0, arg1) => {
			const ret = getObject(arg1).url;
			const ptr1 = passStringToWasm0(
				ret,
				wasm.__wbindgen_export_0,
				wasm.__wbindgen_export_1,
			);
			const len1 = WASM_VECTOR_LEN;
			getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, !0),
				getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, !0);
		},
		__wbg_status_5f4e900d22140a18: (arg0) => getObject(arg0).status,
		__wbg_headers_1b9bf90c73fae600: (arg0) => {
			const ret = getObject(arg0).headers;
			return addHeapObject(ret);
		},
		__wbg_arrayBuffer_144729e09879650e: () =>
			handleError((arg0) => {
				const ret = getObject(arg0).arrayBuffer();
				return addHeapObject(ret);
			}, arguments),
		__wbg_text_ebeee8b31af4c919: () =>
			handleError((arg0) => {
				const ret = getObject(arg0).text();
				return addHeapObject(ret);
			}, arguments),
		__wbg_fetch_1fdc4448ed9eec00: (arg0, arg1) => {
			const ret = getObject(arg0).fetch(getObject(arg1));
			return addHeapObject(ret);
		},
		__wbg_now_0195cd5bcbf4093a: () => handleError(() => Date.now(), arguments),
		__wbg_crypto_1d1f22824a6a080c: (arg0) => {
			const ret = getObject(arg0).crypto;
			return addHeapObject(ret);
		},
		__wbg_process_4a72847cc503995b: (arg0) => {
			const ret = getObject(arg0).process;
			return addHeapObject(ret);
		},
		__wbg_versions_f686565e586dd935: (arg0) => {
			const ret = getObject(arg0).versions;
			return addHeapObject(ret);
		},
		__wbg_node_104a2ff8d6ea03a2: (arg0) => {
			const ret = getObject(arg0).node;
			return addHeapObject(ret);
		},
		__wbindgen_is_string: (arg0) => typeof getObject(arg0) === "string",
		__wbg_require_cca90b1a94a0255b: () =>
			handleError(() => {
				const ret = module.require;
				return addHeapObject(ret);
			}, arguments),
		__wbg_msCrypto_eb05e62b530a1508: (arg0) => {
			const ret = getObject(arg0).msCrypto;
			return addHeapObject(ret);
		},
		__wbg_randomFillSync_5c9c955aa56b6049: () =>
			handleError((arg0, arg1) => {
				getObject(arg0).randomFillSync(takeObject(arg1));
			}, arguments),
		__wbg_getRandomValues_3aa56aa6edec874c: () =>
			handleError((arg0, arg1) => {
				getObject(arg0).getRandomValues(getObject(arg1));
			}, arguments),
		__wbg_self_bf91bf94d9e04084: () =>
			handleError(() => {
				const ret = self.self;
				return addHeapObject(ret);
			}, arguments),
		__wbg_window_52dd9f07d03fd5f8: () =>
			handleError(() => {
				const ret = window.window;
				return addHeapObject(ret);
			}, arguments),
		__wbg_globalThis_05c129bf37fcf1be: () =>
			handleError(() => {
				const ret = globalThis.globalThis;
				return addHeapObject(ret);
			}, arguments),
		__wbg_global_3eca19bb09e9c484: () =>
			handleError(() => {
				const ret = global.global;
				return addHeapObject(ret);
			}, arguments),
		__wbg_newnoargs_1ede4bf2ebbaaf43: (arg0, arg1) => {
			const ret = new Function(getStringFromWasm0(arg0, arg1));
			return addHeapObject(ret);
		},
		__wbg_length_f217bbbf7e8e4df4: (arg0) => getObject(arg0).length,
		__wbg_new_034f913e7636e987: () => {
			const ret = new Array();
			return addHeapObject(ret);
		},
		__wbg_next_13b477da1eaa3897: (arg0) => {
			const ret = getObject(arg0).next;
			return addHeapObject(ret);
		},
		__wbg_value_2ab8a198c834c26a: (arg0) => {
			const ret = getObject(arg0).value;
			return addHeapObject(ret);
		},
		__wbg_iterator_695d699a44d6234c: () => addHeapObject(Symbol.iterator),
		__wbg_new_e69b5f66fda8f13c: () => {
			const ret = new Object();
			return addHeapObject(ret);
		},
		__wbg_get_5419cf6b954aa11d: (arg0, arg1) => {
			const ret = getObject(arg0)[arg1 >>> 0];
			return addHeapObject(ret);
		},
		__wbg_isArray_6f3b47f09adb61b5: (arg0) => Array.isArray(getObject(arg0)),
		__wbg_push_36cf4d81d7da33d1: (arg0, arg1) =>
			getObject(arg0).push(getObject(arg1)),
		__wbg_instanceof_ArrayBuffer_74945570b4a62ec7: (arg0) => {
			let result;
			try {
				result = getObject(arg0) instanceof ArrayBuffer;
			} catch {
				result = !1;
			}
			return result;
		},
		__wbg_new_70a2f23d1565c04c: (arg0, arg1) => {
			const ret = new Error(getStringFromWasm0(arg0, arg1));
			return addHeapObject(ret);
		},
		__wbg_toString_4b677455b9167e31: (arg0) => {
			const ret = getObject(arg0).toString();
			return addHeapObject(ret);
		},
		__wbg_call_a9ef466721e824f2: () =>
			handleError((arg0, arg1) => {
				const ret = getObject(arg0).call(getObject(arg1));
				return addHeapObject(ret);
			}, arguments),
		__wbg_call_3bfa248576352471: () =>
			handleError((arg0, arg1, arg2) => {
				const ret = getObject(arg0).call(getObject(arg1), getObject(arg2));
				return addHeapObject(ret);
			}, arguments),
		__wbg_instanceof_Map_f96986929e7e89ed: (arg0) => {
			let result;
			try {
				result = getObject(arg0) instanceof Map;
			} catch {
				result = !1;
			}
			return result;
		},
		__wbg_next_b06e115d1b01e10b: () =>
			handleError((arg0) => {
				const ret = getObject(arg0).next();
				return addHeapObject(ret);
			}, arguments),
		__wbg_done_983b5ffcaec8c583: (arg0) => getObject(arg0).done,
		__wbg_isSafeInteger_b9dff570f01a9100: (arg0) =>
			Number.isSafeInteger(getObject(arg0)),
		__wbg_getTime_41225036a0393d63: (arg0) => getObject(arg0).getTime(),
		__wbg_getTimezoneOffset_93f7d384c8ade3be: (arg0) =>
			getObject(arg0).getTimezoneOffset(),
		__wbg_new_6fb55f037293191b: (arg0) => {
			const ret = new Date(getObject(arg0));
			return addHeapObject(ret);
		},
		__wbg_new0_218ada33b570be35: () => addHeapObject(new Date()),
		__wbg_now_70af4fe37a792251: () => Date.now(),
		__wbg_entries_c02034de337d3ee2: (arg0) => {
			const ret = Object.entries(getObject(arg0));
			return addHeapObject(ret);
		},
		__wbg_get_ef828680c64da212: () =>
			handleError((arg0, arg1) => {
				const ret = Reflect.get(getObject(arg0), getObject(arg1));
				return addHeapObject(ret);
			}, arguments),
		__wbg_has_bd717f25f195f23d: () =>
			handleError(
				(arg0, arg1) => Reflect.has(getObject(arg0), getObject(arg1)),
				arguments,
			),
		__wbg_buffer_ccaed51a635d8a2d: (arg0) => {
			const ret = getObject(arg0).buffer;
			return addHeapObject(ret);
		},
		__wbg_stringify_eead5648c09faaf8: () =>
			handleError((arg0) => {
				const ret = JSON.stringify(getObject(arg0));
				return addHeapObject(ret);
			}, arguments),
		__wbg_new_1073970097e5a420: (arg0, arg1) => {
			try {
				const state0 = { a: arg0, b: arg1 };
				const cb0 = (arg02, arg12) => {
					const a = state0.a;
					state0.a = 0;
					try {
						return __wbg_adapter_324(a, state0.b, arg02, arg12);
					} finally {
						state0.a = a;
					}
				};
				const ret = new Promise(cb0);
				return addHeapObject(ret);
			} finally {
				state0.a = state0.b = 0;
			}
		},
		__wbg_resolve_0aad7c1484731c99: (arg0) => {
			const ret = Promise.resolve(getObject(arg0));
			return addHeapObject(ret);
		},
		__wbg_then_748f75edfb032440: (arg0, arg1) => {
			const ret = getObject(arg0).then(getObject(arg1));
			return addHeapObject(ret);
		},
		__wbg_then_4866a7d9f55d8f3e: (arg0, arg1, arg2) => {
			const ret = getObject(arg0).then(getObject(arg1), getObject(arg2));
			return addHeapObject(ret);
		},
		__wbg_newwithbyteoffsetandlength_7e3eb787208af730: (arg0, arg1, arg2) => {
			const ret = new Uint8Array(getObject(arg0), arg1 >>> 0, arg2 >>> 0);
			return addHeapObject(ret);
		},
		__wbg_new_fec2611eb9180f95: (arg0) => {
			const ret = new Uint8Array(getObject(arg0));
			return addHeapObject(ret);
		},
		__wbg_instanceof_Uint8Array_df0761410414ef36: (arg0) => {
			let result;
			try {
				result = getObject(arg0) instanceof Uint8Array;
			} catch {
				result = !1;
			}
			return result;
		},
		__wbg_newwithlength_76462a666eca145f: (arg0) => {
			const ret = new Uint8Array(arg0 >>> 0);
			return addHeapObject(ret);
		},
		__wbg_buffer_95102df5554646dc: (arg0) => {
			const ret = getObject(arg0).buffer;
			return addHeapObject(ret);
		},
		__wbg_subarray_975a06f9dbd16995: (arg0, arg1, arg2) => {
			const ret = getObject(arg0).subarray(arg1 >>> 0, arg2 >>> 0);
			return addHeapObject(ret);
		},
		__wbg_length_9254c4bd3b9f23c4: (arg0) => getObject(arg0).length,
		__wbg_byteLength_5d623ba3d92a3a9c: (arg0) => getObject(arg0).byteLength,
		__wbg_byteOffset_ec0928143c619cd7: (arg0) => getObject(arg0).byteOffset,
		__wbg_set_ec2fcf81bc573fd9: (arg0, arg1, arg2) => {
			getObject(arg0).set(getObject(arg1), arg2 >>> 0);
		},
		__wbindgen_bigint_get_as_i64: (arg0, arg1) => {
			const v = getObject(arg1);
			const ret = typeof v === "bigint" ? v : void 0;
			getDataViewMemory0().setBigInt64(
				arg0 + 8 * 1,
				isLikeNone(ret) ? BigInt(0) : ret,
				!0,
			),
				getDataViewMemory0().setInt32(arg0 + 4 * 0, !isLikeNone(ret), !0);
		},
		__wbindgen_debug_string: (arg0, arg1) => {
			const ret = debugString(getObject(arg1));
			const ptr1 = passStringToWasm0(
				ret,
				wasm.__wbindgen_export_0,
				wasm.__wbindgen_export_1,
			);
			const len1 = WASM_VECTOR_LEN;
			getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, !0),
				getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, !0);
		},
		__wbindgen_throw: (arg0, arg1) => {
			throw new Error(getStringFromWasm0(arg0, arg1));
		},
		__wbindgen_memory: () => {
			const ret = wasm.memory;
			return addHeapObject(ret);
		},
		__wbindgen_closure_wrapper23787: (arg0, arg1, arg2) => {
			const ret = makeMutClosure(arg0, arg1, 1886, __wbg_adapter_52);
			return addHeapObject(ret);
		},
		__wbindgen_closure_wrapper25838: (arg0, arg1, arg2) => {
			const ret = makeMutClosure(arg0, arg1, 2133, __wbg_adapter_55);
			return addHeapObject(ret);
		},
		__wbindgen_closure_wrapper30702: (arg0, arg1, arg2) => {
			const ret = makeMutClosure(arg0, arg1, 2701, __wbg_adapter_58);
			return addHeapObject(ret);
		},
	},
};
const wasm_url = new URL("index_bg.wasm", import.meta.url);
let wasmCode = "";
switch (wasm_url.protocol) {
	case "file:":
		wasmCode = await Deno.readFile(wasm_url);
		break;
	default:
		wasmCode = await (await fetch(wasm_url)).arrayBuffer();
		break;
}
const wasmInstance = (await WebAssembly.instantiate(wasmCode, imports))
	.instance;
const wasm = wasmInstance.exports;
const DIGITS = "0123456789abcdef";
const UUID = class {
	constructor(bytes) {
		this.bytes = bytes;
	}
	static ofInner(bytes) {
		if (bytes.length !== 16) throw new TypeError("not 128-bit length");
		return new UUID(bytes);
	}
	static fromFieldsV7(unixTsMs, randA, randBHi, randBLo) {
		if (
			!Number.isInteger(unixTsMs) ||
			!Number.isInteger(randA) ||
			!Number.isInteger(randBHi) ||
			!Number.isInteger(randBLo) ||
			unixTsMs < 0 ||
			randA < 0 ||
			randBHi < 0 ||
			randBLo < 0 ||
			unixTsMs > 0xffffffffffff ||
			randA > 4095 ||
			randBHi > 1073741823 ||
			randBLo > 4294967295
		)
			throw new RangeError("invalid field value");
		const bytes = new Uint8Array(16);
		return (
			(bytes[0] = unixTsMs / 2 ** 40),
			(bytes[1] = unixTsMs / 2 ** 32),
			(bytes[2] = unixTsMs / 2 ** 24),
			(bytes[3] = unixTsMs / 2 ** 16),
			(bytes[4] = unixTsMs / 2 ** 8),
			(bytes[5] = unixTsMs),
			(bytes[6] = 112 | (randA >>> 8)),
			(bytes[7] = randA),
			(bytes[8] = 128 | (randBHi >>> 24)),
			(bytes[9] = randBHi >>> 16),
			(bytes[10] = randBHi >>> 8),
			(bytes[11] = randBHi),
			(bytes[12] = randBLo >>> 24),
			(bytes[13] = randBLo >>> 16),
			(bytes[14] = randBLo >>> 8),
			(bytes[15] = randBLo),
			new UUID(bytes)
		);
	}
	static parse(uuid) {
		let _a;
		let _b;
		let _c;
		let _d;
		let hex;
		switch (uuid.length) {
			case 32:
				hex =
					(_a = /^[0-9a-f]{32}$/i.exec(uuid)) === null || _a === void 0
						? void 0
						: _a[0];
				break;
			case 36:
				hex =
					(_b =
						/^([0-9a-f]{8})-([0-9a-f]{4})-([0-9a-f]{4})-([0-9a-f]{4})-([0-9a-f]{12})$/i.exec(
							uuid,
						)) === null || _b === void 0
						? void 0
						: _b.slice(1, 6).join("");
				break;
			case 38:
				hex =
					(_c =
						/^\{([0-9a-f]{8})-([0-9a-f]{4})-([0-9a-f]{4})-([0-9a-f]{4})-([0-9a-f]{12})\}$/i.exec(
							uuid,
						)) === null || _c === void 0
						? void 0
						: _c.slice(1, 6).join("");
				break;
			case 45:
				hex =
					(_d =
						/^urn:uuid:([0-9a-f]{8})-([0-9a-f]{4})-([0-9a-f]{4})-([0-9a-f]{4})-([0-9a-f]{12})$/i.exec(
							uuid,
						)) === null || _d === void 0
						? void 0
						: _d.slice(1, 6).join("");
				break;
			default:
				break;
		}
		if (hex) {
			const inner = new Uint8Array(16);
			for (let i = 0; i < 16; i += 4) {
				const n = Number.parseInt(hex.substring(2 * i, 2 * i + 8), 16);
				(inner[i + 0] = n >>> 24),
					(inner[i + 1] = n >>> 16),
					(inner[i + 2] = n >>> 8),
					(inner[i + 3] = n);
			}
			return new UUID(inner);
		}
		throw new SyntaxError("could not parse UUID string");
	}
	toString() {
		let text = "";
		for (let i = 0; i < this.bytes.length; i++)
			(text += DIGITS.charAt(this.bytes[i] >>> 4)),
				(text += DIGITS.charAt(this.bytes[i] & 15)),
				(i === 3 || i === 5 || i === 7 || i === 9) && (text += "-");
		return text;
	}
	toHex() {
		let text = "";
		for (let i = 0; i < this.bytes.length; i++)
			(text += DIGITS.charAt(this.bytes[i] >>> 4)),
				(text += DIGITS.charAt(this.bytes[i] & 15));
		return text;
	}
	toJSON() {
		return this.toString();
	}
	getVariant() {
		const n = this.bytes[8] >>> 4;
		if (n < 0) throw new Error("unreachable");
		if (n <= 7) return this.bytes.every((e) => e === 0) ? "NIL" : "VAR_0";
		if (n <= 11) return "VAR_10";
		if (n <= 13) return "VAR_110";
		if (n <= 15)
			return this.bytes.every((e) => e === 255) ? "MAX" : "VAR_RESERVED";
		throw new Error("unreachable");
	}
	getVersion() {
		return this.getVariant() === "VAR_10" ? this.bytes[6] >>> 4 : void 0;
	}
	clone() {
		return new UUID(this.bytes.slice(0));
	}
	equals(other) {
		return this.compareTo(other) === 0;
	}
	compareTo(other) {
		for (let i = 0; i < 16; i++) {
			const diff = this.bytes[i] - other.bytes[i];
			if (diff !== 0) return Math.sign(diff);
		}
		return 0;
	}
};
const V7Generator = class {
	constructor(randomNumberGenerator) {
		(this.timestamp = 0),
			(this.counter = 0),
			(this.random = randomNumberGenerator ?? getDefaultRandom());
	}
	generate() {
		return this.generateOrResetCore(Date.now(), 1e4);
	}
	generateOrAbort() {
		return this.generateOrAbortCore(Date.now(), 1e4);
	}
	generateOrResetCore(unixTsMs, rollbackAllowance) {
		let value = this.generateOrAbortCore(unixTsMs, rollbackAllowance);
		return (
			value === void 0 &&
				((this.timestamp = 0),
				(value = this.generateOrAbortCore(unixTsMs, rollbackAllowance))),
			value
		);
	}
	generateOrAbortCore(unixTsMs, rollbackAllowance) {
		if (
			!Number.isInteger(unixTsMs) ||
			unixTsMs < 1 ||
			unixTsMs > 0xffffffffffff
		)
			throw new RangeError("`unixTsMs` must be a 48-bit positive integer");
		if (rollbackAllowance < 0 || rollbackAllowance > 0xffffffffffff)
			throw new RangeError("`rollbackAllowance` out of reasonable range");
		if (unixTsMs > this.timestamp)
			(this.timestamp = unixTsMs), this.resetCounter();
		else if (unixTsMs + rollbackAllowance >= this.timestamp)
			this.counter++,
				this.counter > 4398046511103 && (this.timestamp++, this.resetCounter());
		else return;
		return UUID.fromFieldsV7(
			this.timestamp,
			Math.trunc(this.counter / 2 ** 30),
			this.counter & (2 ** 30 - 1),
			this.random.nextUint32(),
		);
	}
	resetCounter() {
		this.counter =
			this.random.nextUint32() * 1024 + (this.random.nextUint32() & 1023);
	}
	generateV4() {
		const bytes = new Uint8Array(
			Uint32Array.of(
				this.random.nextUint32(),
				this.random.nextUint32(),
				this.random.nextUint32(),
				this.random.nextUint32(),
			).buffer,
		);
		return (
			(bytes[6] = 64 | (bytes[6] >>> 4)),
			(bytes[8] = 128 | (bytes[8] >>> 2)),
			UUID.ofInner(bytes)
		);
	}
};
const getDefaultRandom = () => {
	if (typeof crypto < "u" && typeof crypto.getRandomValues < "u")
		return new BufferedCryptoRandom();
	if (typeof UUIDV7_DENY_WEAK_RNG < "u" && UUIDV7_DENY_WEAK_RNG)
		throw new Error("no cryptographically strong RNG available");
	return {
		nextUint32: () =>
			Math.trunc(Math.random() * 65536) * 65536 +
			Math.trunc(Math.random() * 65536),
	};
};
const BufferedCryptoRandom = class {
	constructor() {
		(this.buffer = new Uint32Array(8)), (this.cursor = 65535);
	}
	nextUint32() {
		return (
			this.cursor >= this.buffer.length &&
				(crypto.getRandomValues(this.buffer), (this.cursor = 0)),
			this.buffer[this.cursor++]
		);
	}
};
let defaultGenerator;
const uuidv7obj = () =>
	(defaultGenerator || (defaultGenerator = new V7Generator())).generate();
const uuidv4obj = () =>
	(defaultGenerator || (defaultGenerator = new V7Generator())).generateV4();
const __defProp = Object.defineProperty;
const __export = (target, all) => {
	for (const name in all)
		__defProp(target, name, { get: all[name], enumerable: !0 });
};
const Gap = class {
	args = [];
	constructor(...args) {
		this.args = args;
	}
	fill(value) {
		return [this, value];
	}
	hasDefault() {
		return this.args.length === 1;
	}
	get default() {
		return this.args[0];
	}
};
const cbor_exports = {};
__export(cbor_exports, {
	CborBreak: () => CborBreak,
	CborError: () => CborError,
	CborFillMissing: () => CborFillMissing,
	CborInvalidMajorError: () => CborInvalidMajorError,
	CborNumberError: () => CborNumberError,
	CborPartialDisabled: () => CborPartialDisabled,
	CborRangeError: () => CborRangeError,
	Encoded: () => Encoded,
	Gap: () => Gap,
	POW_2_53: () => POW_2_53,
	POW_2_64: () => POW_2_64,
	PartiallyEncoded: () => PartiallyEncoded,
	Reader: () => Reader,
	Tagged: () => Tagged,
	Writer: () => Writer,
	decode: () => decode,
	encode: () => encode,
	infiniteBytes: () => infiniteBytes,
	partiallyEncodeObject: () => partiallyEncodeObject,
});
const POW_2_53 = 9007199254740992;
const POW_2_64 = BigInt(18446744073709552e3);
const Encoded = class {
	constructor(encoded) {
		this.encoded = encoded;
	}
};
const SurrealDbError = class extends Error {};
const UnexpectedConnectionError = class extends SurrealDbError {
	constructor(error) {
		super(), (this.error = error), (this.message = `${error}`);
	}
	name = "UnexpectedConnectionError";
};
const ConnectionUnavailable = class extends SurrealDbError {
	name = "ConnectionUnavailable";
	message = "There is no connection available at this moment.";
};
const HttpConnectionError = class extends SurrealDbError {
	constructor(message, status, statusText, buffer) {
		super(),
			(this.message = message),
			(this.status = status),
			(this.statusText = statusText),
			(this.buffer = buffer);
	}
	name = "HttpConnectionError";
};
const CborError = class extends SurrealDbError {
	message;
	constructor(message) {
		super(), (this.message = message);
	}
};
const CborNumberError = class extends CborError {
	name = "CborNumberError";
};
const CborRangeError = class extends CborError {
	name = "CborRangeError";
};
const CborInvalidMajorError = class extends CborError {
	name = "CborInvalidMajorError";
};
const CborBreak = class extends CborError {
	name = "CborBreak";
	constructor() {
		super("Came across a break which was not intercepted by the decoder");
	}
};
const CborPartialDisabled = class extends CborError {
	name = "CborPartialDisabled";
	constructor() {
		super(
			"Tried to insert a Gap into a CBOR value, while partial mode is not enabled",
		);
	}
};
const CborFillMissing = class extends CborError {
	name = "CborFillMissing";
	constructor() {
		super("Fill for a gap is missing, and gap has no default");
	}
};
const Writer = class {
	constructor(byteLength = 256) {
		(this.byteLength = byteLength),
			(this._buf = new ArrayBuffer(this.byteLength)),
			(this._view = new DataView(this._buf)),
			(this._byte = new Uint8Array(this._buf));
	}
	_chunks = [];
	_pos = 0;
	_buf;
	_view;
	_byte;
	chunk(gap) {
		this._chunks.push([this._buf.slice(0, this._pos), gap]),
			(this._buf = new ArrayBuffer(this.byteLength)),
			(this._view = new DataView(this._buf)),
			(this._byte = new Uint8Array(this._buf)),
			(this._pos = 0);
	}
	get chunks() {
		return this._chunks;
	}
	get buffer() {
		return this._buf.slice(0, this._pos);
	}
	claim(length) {
		const pos = this._pos;
		if (((this._pos += length), this._pos <= this._buf.byteLength)) return pos;
		let newLen = this._buf.byteLength << 1;
		while (newLen < this._pos) newLen <<= 1;
		if (newLen > this._buf.byteLength) {
			const oldb = this._byte;
			(this._buf = new ArrayBuffer(newLen)),
				(this._view = new DataView(this._buf)),
				(this._byte = new Uint8Array(this._buf)),
				this._byte.set(oldb);
		}
		return pos;
	}
	writeUint8(value) {
		const pos = this.claim(1);
		this._view.setUint8(pos, value);
	}
	writeUint16(value) {
		const pos = this.claim(2);
		this._view.setUint16(pos, value);
	}
	writeUint32(value) {
		const pos = this.claim(4);
		this._view.setUint32(pos, value);
	}
	writeUint64(value) {
		const pos = this.claim(8);
		this._view.setBigUint64(pos, value);
	}
	writeUint8Array(data) {
		if (data.byteLength === 0) return;
		const pos = this.claim(data.byteLength);
		this._byte.set(data, pos);
	}
	writeArrayBuffer(data) {
		data.byteLength !== 0 && this.writeUint8Array(new Uint8Array(data));
	}
	writePartiallyEncoded(data) {
		for (const [buf, gap] of data.chunks)
			this.writeArrayBuffer(buf), this.chunk(gap);
		this.writeArrayBuffer(data.end);
	}
	writeFloat32(value) {
		const pos = this.claim(4);
		this._view.setFloat32(pos, value);
	}
	writeFloat64(value) {
		const pos = this.claim(8);
		this._view.setFloat64(pos, value);
	}
	writeMajor(type, length) {
		const base = type << 5;
		length < 24
			? this.writeUint8(base + Number(length))
			: length < 256
				? (this.writeUint8(base + 24), this.writeUint8(Number(length)))
				: length < 65536
					? (this.writeUint8(base + 25), this.writeUint16(Number(length)))
					: length < 4294967296
						? (this.writeUint8(base + 26), this.writeUint32(Number(length)))
						: (this.writeUint8(base + 27), this.writeUint64(BigInt(length)));
	}
	output(partial, replacer2) {
		return partial
			? new PartiallyEncoded(this._chunks, this.buffer, replacer2)
			: this.buffer;
	}
};
const PartiallyEncoded = class {
	constructor(chunks, end, replacer2) {
		(this.chunks = chunks), (this.end = end), (this.replacer = replacer2);
	}
	build(fills, partial) {
		const writer = new Writer();
		const map = new Map(fills);
		for (const [buffer, gap] of this.chunks) {
			const hasValue = map.has(gap) || gap.hasDefault();
			if (!partial && !hasValue) throw new CborFillMissing();
			if ((writer.writeArrayBuffer(buffer), hasValue)) {
				const data = map.get(gap) ?? gap.default;
				encode(data, { writer, replacer: this.replacer });
			} else writer.chunk(gap);
		}
		return (
			writer.writeArrayBuffer(this.end), writer.output(!!partial, this.replacer)
		);
	}
};
function partiallyEncodeObject(object, options) {
	return Object.fromEntries(
		Object.entries(object).map(([k, v]) => [
			k,
			encode(v, { ...options, partial: !0 }),
		]),
	);
}
const Tagged = class {
	constructor(tag, value) {
		(this.tag = tag), (this.value = value);
	}
};
let textEncoder;
function encode(input, options = {}) {
	const w = options.writer ?? new Writer();
	const fillsMap = new Map(options.fills ?? []);
	function inner(input2) {
		const value = options.replacer ? options.replacer(input2) : input2;
		if (value === void 0) return w.writeUint8(247);
		if (value === null) return w.writeUint8(246);
		if (value === !0) return w.writeUint8(245);
		if (value === !1) return w.writeUint8(244);
		switch (typeof value) {
			case "number": {
				if (Number.isInteger(value))
					if (value >= 0 && value <= 9007199254740992) w.writeMajor(0, value);
					else if (value < 0 && value >= -9007199254740992)
						w.writeMajor(1, -(value + 1));
					else throw new CborNumberError("Number too big to be encoded");
				else w.writeUint8(251), w.writeFloat64(value);
				return;
			}
			case "bigint": {
				if (value >= 0 && value < POW_2_64) w.writeMajor(0, value);
				else if (value <= 0 && value >= -POW_2_64)
					w.writeMajor(1, -(value + 1n));
				else throw new CborNumberError("BigInt too big to be encoded");
				return;
			}
			case "string": {
				textEncoder ??= new TextEncoder();
				const encoded = textEncoder.encode(value);
				w.writeMajor(3, encoded.byteLength), w.writeUint8Array(encoded);
				return;
			}
			default: {
				if (Array.isArray(value)) {
					w.writeMajor(4, value.length);
					for (const v of value) inner(v);
					return;
				}
				if (value instanceof Tagged) {
					w.writeMajor(6, value.tag), inner(value.value);
					return;
				}
				if (value instanceof Encoded) {
					w.writeArrayBuffer(value.encoded);
					return;
				}
				if (value instanceof Gap) {
					if (fillsMap.has(value)) inner(fillsMap.get(value));
					else {
						if (!options.partial) throw new CborPartialDisabled();
						w.chunk(value);
					}
					return;
				}
				if (value instanceof PartiallyEncoded) {
					const res = value.build(options.fills ?? [], options.partial);
					options.partial
						? w.writePartiallyEncoded(res)
						: w.writeArrayBuffer(res);
					return;
				}
				if (
					value instanceof Uint8Array ||
					value instanceof Uint16Array ||
					value instanceof Uint32Array ||
					value instanceof Int8Array ||
					value instanceof Int16Array ||
					value instanceof Int32Array ||
					value instanceof Float32Array ||
					value instanceof Float64Array ||
					value instanceof ArrayBuffer
				) {
					const v = new Uint8Array(value);
					w.writeMajor(2, v.byteLength), w.writeUint8Array(v);
					return;
				}
				const entries =
					value instanceof Map
						? Array.from(value.entries())
						: Object.entries(value);
				w.writeMajor(5, entries.length);
				for (const v of entries.flat()) inner(v);
			}
		}
	}
	return inner(input), w.output(!!options.partial, options.replacer);
}
const Reader = class {
	_buf;
	_view;
	_byte;
	_pos = 0;
	constructor(buffer) {
		(this._buf = new ArrayBuffer(buffer.byteLength)),
			(this._view = new DataView(this._buf)),
			(this._byte = new Uint8Array(this._buf)),
			this._byte.set(new Uint8Array(buffer));
	}
	read(amount, res) {
		return (this._pos += amount), res;
	}
	readUint8() {
		try {
			return this.read(1, this._view.getUint8(this._pos));
		} catch (e) {
			throw e instanceof RangeError ? new CborRangeError(e.message) : e;
		}
	}
	readUint16() {
		try {
			return this.read(2, this._view.getUint16(this._pos));
		} catch (e) {
			throw e instanceof RangeError ? new CborRangeError(e.message) : e;
		}
	}
	readUint32() {
		try {
			return this.read(4, this._view.getUint32(this._pos));
		} catch (e) {
			throw e instanceof RangeError ? new CborRangeError(e.message) : e;
		}
	}
	readUint64() {
		try {
			return this.read(8, this._view.getBigUint64(this._pos));
		} catch (e) {
			throw e instanceof RangeError ? new CborRangeError(e.message) : e;
		}
	}
	readFloat16() {
		const bytes = this.readUint16();
		const s2 = (bytes & 32768) >> 15;
		const e = (bytes & 31744) >> 10;
		const f2 = bytes & 1023;
		return e === 0
			? (s2 ? -1 : 1) * 2 ** -14 * (f2 / 2 ** 10)
			: e === 31
				? f2
					? Number.NaN
					: (s2 ? -1 : 1) * Number.POSITIVE_INFINITY
				: (s2 ? -1 : 1) * 2 ** (e - 15) * (1 + f2 / 2 ** 10);
	}
	readFloat32() {
		try {
			return this.read(4, this._view.getFloat32(this._pos));
		} catch (e) {
			throw e instanceof RangeError ? new CborRangeError(e.message) : e;
		}
	}
	readFloat64() {
		try {
			return this.read(8, this._view.getFloat64(this._pos));
		} catch (e) {
			throw e instanceof RangeError ? new CborRangeError(e.message) : e;
		}
	}
	readBytes(amount) {
		const available = this._byte.length - this._pos;
		if (available < amount)
			throw new CborRangeError(
				`The argument must be between 0 and ${available}`,
			);
		return this.read(amount, this._byte.slice(this._pos, this._pos + amount));
	}
	readMajor() {
		const byte = this.readUint8();
		const major = byte >> 5;
		if (major < 0 || major > 7)
			throw new CborInvalidMajorError("Received invalid major type");
		return [major, byte & 31];
	}
	readMajorLength(length) {
		if (length <= 23) return length;
		switch (length) {
			case 24:
				return this.readUint8();
			case 25:
				return this.readUint16();
			case 26:
				return this.readUint32();
			case 27: {
				const read = this.readUint64();
				return read > 9007199254740992 ? read : Number(read);
			}
		}
		throw new CborRangeError("Expected a final length");
	}
};
function infiniteBytes(r2, forMajor) {
	const w = new Writer();
	for (;;) {
		const [major, len] = r2.readMajor();
		if (major === 7 && len === 31) break;
		if (major !== forMajor)
			throw new CborInvalidMajorError(
				`Expected a resource of the same major (${forMajor}) while processing an infinite resource`,
			);
		if (len === 31)
			throw new CborRangeError(
				"Expected a finite resource while processing an infinite resource",
			);
		w.writeUint8Array(r2.readBytes(Number(r2.readMajorLength(len))));
	}
	return w.buffer;
}
let textDecoder;
function decode(input, options = {}) {
	const r2 = input instanceof Reader ? input : new Reader(input);
	function inner() {
		const [major, len] = r2.readMajor();
		switch (major) {
			case 0:
				return r2.readMajorLength(len);
			case 1: {
				const l = r2.readMajorLength(len);
				return typeof l === "bigint" ? -(l + 1n) : -(l + 1);
			}
			case 2:
				return len === 31
					? infiniteBytes(r2, 2)
					: r2.readBytes(Number(r2.readMajorLength(len))).buffer;
			case 3: {
				const encoded =
					len === 31
						? infiniteBytes(r2, 3)
						: r2.readBytes(Number(r2.readMajorLength(len)));
				return (textDecoder ??= new TextDecoder()), textDecoder.decode(encoded);
			}
			case 4: {
				if (len === 31) {
					const arr2 = [];
					for (;;)
						try {
							arr2.push(decode2());
						} catch (e) {
							if (e instanceof CborBreak) break;
							throw e;
						}
					return arr2;
				}
				const l = r2.readMajorLength(len);
				const arr = Array(l);
				for (let i = 0; i < l; i++) arr[i] = decode2();
				return arr;
			}
			case 5: {
				const entries = [];
				if (len === 31)
					for (;;) {
						let key;
						try {
							key = decode2();
						} catch (e) {
							if (e instanceof CborBreak) break;
							throw e;
						}
						const value = decode2();
						entries.push([key, value]);
					}
				else {
					const l = r2.readMajorLength(len);
					for (let i = 0; i < l; i++) {
						const key = decode2();
						const value = decode2();
						entries[i] = [key, value];
					}
				}
				return options.map === "map"
					? new Map(entries)
					: Object.fromEntries(entries);
			}
			case 6: {
				const tag = r2.readMajorLength(len);
				const value = decode2();
				return new Tagged(tag, value);
			}
			case 7:
				switch (len) {
					case 20:
						return !1;
					case 21:
						return !0;
					case 22:
						return null;
					case 23:
						return;
					case 25:
						return r2.readFloat16();
					case 26:
						return r2.readFloat32();
					case 27:
						return r2.readFloat64();
					case 31:
						throw new CborBreak();
				}
		}
		throw new CborInvalidMajorError(
			`Unable to decode value with major tag ${major}`,
		);
	}
	function decode2() {
		return options.replacer ? options.replacer(inner()) : inner();
	}
	return decode2();
}
function dateToCborCustomDate(date) {
	const s2 = Math.floor(date.getTime() / 1e3);
	const ms = date.getTime() - s2 * 1e3;
	return [s2, ms * 1e6];
}
function cborCustomDateToDate([s2, ns]) {
	const date = new Date(0);
	return (
		date.setUTCSeconds(Number(s2)),
		date.setMilliseconds(Math.floor(Number(ns) / 1e6)),
		date
	);
}
const Value = class {};
const Decimal = class _Decimal extends Value {
	decimal;
	constructor(decimal) {
		super(), (this.decimal = decimal.toString());
	}
	equals(other) {
		return other instanceof _Decimal ? this.decimal === other.decimal : !1;
	}
	toString() {
		return this.decimal;
	}
	toJSON() {
		return this.decimal;
	}
};
const millisecond = 1;
const microsecond = millisecond / 1e3;
const nanosecond = microsecond / 1e3;
const second = 1e3 * millisecond;
const minute = 60 * second;
const hour = 60 * minute;
const day = 24 * hour;
const week = 7 * day;
const units = new Map([
	["ns", nanosecond],
	["\xB5s", microsecond],
	["\u03BCs", microsecond],
	["us", microsecond],
	["ms", millisecond],
	["s", second],
	["m", minute],
	["h", hour],
	["d", day],
	["w", week],
]);
const unitsReverse = Array.from(units).reduce(
	(map, [unit, size]) => (map.set(size, unit), map),
	new Map(),
);
const durationPartRegex = new RegExp(
	`^(\\d+)(${Array.from(units.keys()).join("|")})`,
);
const Duration = class _Duration extends Value {
	_milliseconds;
	constructor(input) {
		super(),
			input instanceof _Duration
				? (this._milliseconds = input._milliseconds)
				: typeof input === "string"
					? (this._milliseconds = _Duration.parseString(input))
					: (this._milliseconds = input);
	}
	static fromCompact([s2, ns]) {
		(s2 = s2 ?? 0), (ns = ns ?? 0);
		const ms = s2 * 1e3 + ns / 1e6;
		return new _Duration(ms);
	}
	equals(other) {
		return other instanceof _Duration
			? this._milliseconds === other._milliseconds
			: !1;
	}
	toCompact() {
		const s2 = Math.floor(this._milliseconds / 1e3);
		const ns = Math.floor((this._milliseconds - s2 * 1e3) * 1e6);
		return ns > 0 ? [s2, ns] : s2 > 0 ? [s2] : [];
	}
	toString() {
		let left = this._milliseconds;
		let result = "";
		function scrap(size) {
			const num = Math.floor(left / size);
			return num > 0 && (left = left % size), num;
		}
		for (const [size, unit] of Array.from(unitsReverse).reverse()) {
			const scrapped = scrap(size);
			scrapped > 0 && (result += `${scrapped}${unit}`);
		}
		return result;
	}
	toJSON() {
		return this.toString();
	}
	static parseString(input) {
		let ms = 0;
		let left = input;
		while (left !== "") {
			const match = left.match(durationPartRegex);
			if (match) {
				const amount = Number.parseInt(match[1]);
				const factor = units.get(match[2]);
				if (factor === void 0)
					throw new SurrealDbError(`Invalid duration unit: ${match[2]}`);
				(ms += amount * factor), (left = left.slice(match[0].length));
				continue;
			}
			throw new SurrealDbError("Could not match a next duration part");
		}
		return ms;
	}
	static nanoseconds(nanoseconds) {
		return new _Duration(Math.floor(nanoseconds * nanosecond));
	}
	static microseconds(microseconds) {
		return new _Duration(Math.floor(microseconds * microsecond));
	}
	static milliseconds(milliseconds) {
		return new _Duration(milliseconds);
	}
	static seconds(seconds) {
		return new _Duration(seconds * second);
	}
	static minutes(minutes) {
		return new _Duration(minutes * minute);
	}
	static hours(hours) {
		return new _Duration(hours * hour);
	}
	static days(days) {
		return new _Duration(days * day);
	}
	static weeks(weeks) {
		return new _Duration(weeks * week);
	}
	get microseconds() {
		return Math.floor(this._milliseconds / microsecond);
	}
	get nanoseconds() {
		return Math.floor(this._milliseconds / nanosecond);
	}
	get milliseconds() {
		return Math.floor(this._milliseconds);
	}
	get seconds() {
		return Math.floor(this._milliseconds / second);
	}
	get minutes() {
		return Math.floor(this._milliseconds / minute);
	}
	get hours() {
		return Math.floor(this._milliseconds / hour);
	}
	get days() {
		return Math.floor(this._milliseconds / day);
	}
	get weeks() {
		return Math.floor(this._milliseconds / week);
	}
};
const Future = class _Future extends Value {
	constructor(inner) {
		super(), (this.inner = inner);
	}
	equals(other) {
		return other instanceof _Future ? this.inner === other.inner : !1;
	}
	toJSON() {
		return this.toString();
	}
	toString() {
		return `<future> ${this.inner}`;
	}
};
const Geometry = class _Geometry extends Value {
	equals(other) {
		return other instanceof _Geometry ? this.is(other) : !1;
	}
	toString() {
		return JSON.stringify(this.toJSON());
	}
};
function f(num) {
	return num instanceof Decimal ? Number.parseFloat(num.decimal) : num;
}
const GeometryPoint = class _GeometryPoint extends Geometry {
	point;
	constructor(point) {
		super(),
			point instanceof _GeometryPoint
				? (this.point = point.clone().point)
				: (this.point = [f(point[0]), f(point[1])]);
	}
	toJSON() {
		return { type: "Point", coordinates: this.coordinates };
	}
	get coordinates() {
		return this.point;
	}
	is(geometry) {
		return geometry instanceof _GeometryPoint
			? this.point[0] === geometry.point[0] &&
					this.point[1] === geometry.point[1]
			: !1;
	}
	clone() {
		return new _GeometryPoint([...this.point]);
	}
};
const GeometryLine = class _GeometryLine extends Geometry {
	line;
	constructor(line) {
		super(),
			(this.line = line instanceof _GeometryLine ? line.clone().line : line);
	}
	toJSON() {
		return { type: "LineString", coordinates: this.coordinates };
	}
	get coordinates() {
		return this.line.map((g) => g.coordinates);
	}
	close() {
		this.line[0].is(this.line.at(-1)) || this.line.push(this.line[0]);
	}
	is(geometry) {
		if (
			!(geometry instanceof _GeometryLine) ||
			this.line.length !== geometry.line.length
		)
			return !1;
		for (let i = 0; i < this.line.length; i++)
			if (!this.line[i].is(geometry.line[i])) return !1;
		return !0;
	}
	clone() {
		return new _GeometryLine(this.line.map((p) => p.clone()));
	}
};
const GeometryPolygon = class _GeometryPolygon extends Geometry {
	polygon;
	constructor(polygon) {
		super(),
			(this.polygon =
				polygon instanceof _GeometryPolygon
					? polygon.clone().polygon
					: polygon.map((l) => {
							const line = l.clone();
							return line.close(), line;
						}));
	}
	toJSON() {
		return { type: "Polygon", coordinates: this.coordinates };
	}
	get coordinates() {
		return this.polygon.map((g) => g.coordinates);
	}
	is(geometry) {
		if (
			!(geometry instanceof _GeometryPolygon) ||
			this.polygon.length !== geometry.polygon.length
		)
			return !1;
		for (let i = 0; i < this.polygon.length; i++)
			if (!this.polygon[i].is(geometry.polygon[i])) return !1;
		return !0;
	}
	clone() {
		return new _GeometryPolygon(this.polygon.map((p) => p.clone()));
	}
};
const GeometryMultiPoint = class _GeometryMultiPoint extends Geometry {
	points;
	constructor(points) {
		super(),
			(this.points =
				points instanceof _GeometryMultiPoint ? points.points : points);
	}
	toJSON() {
		return { type: "MultiPoint", coordinates: this.coordinates };
	}
	get coordinates() {
		return this.points.map((g) => g.coordinates);
	}
	is(geometry) {
		if (
			!(geometry instanceof _GeometryMultiPoint) ||
			this.points.length !== geometry.points.length
		)
			return !1;
		for (let i = 0; i < this.points.length; i++)
			if (!this.points[i].is(geometry.points[i])) return !1;
		return !0;
	}
	clone() {
		return new _GeometryMultiPoint(this.points.map((p) => p.clone()));
	}
};
const GeometryMultiLine = class _GeometryMultiLine extends Geometry {
	lines;
	constructor(lines) {
		super(),
			(this.lines = lines instanceof _GeometryMultiLine ? lines.lines : lines);
	}
	toJSON() {
		return { type: "MultiLineString", coordinates: this.coordinates };
	}
	get coordinates() {
		return this.lines.map((g) => g.coordinates);
	}
	is(geometry) {
		if (
			!(geometry instanceof _GeometryMultiLine) ||
			this.lines.length !== geometry.lines.length
		)
			return !1;
		for (let i = 0; i < this.lines.length; i++)
			if (!this.lines[i].is(geometry.lines[i])) return !1;
		return !0;
	}
	clone() {
		return new _GeometryMultiLine(this.lines.map((p) => p.clone()));
	}
};
const GeometryMultiPolygon = class _GeometryMultiPolygon extends Geometry {
	polygons;
	constructor(polygons) {
		super(),
			(this.polygons =
				polygons instanceof _GeometryMultiPolygon
					? polygons.polygons
					: polygons);
	}
	toJSON() {
		return { type: "MultiPolygon", coordinates: this.coordinates };
	}
	get coordinates() {
		return this.polygons.map((g) => g.coordinates);
	}
	is(geometry) {
		if (
			!(geometry instanceof _GeometryMultiPolygon) ||
			this.polygons.length !== geometry.polygons.length
		)
			return !1;
		for (let i = 0; i < this.polygons.length; i++)
			if (!this.polygons[i].is(geometry.polygons[i])) return !1;
		return !0;
	}
	clone() {
		return new _GeometryMultiPolygon(this.polygons.map((p) => p.clone()));
	}
};
const GeometryCollection = class _GeometryCollection extends Geometry {
	collection;
	constructor(collection) {
		super(),
			(this.collection =
				collection instanceof _GeometryCollection
					? collection.collection
					: collection);
	}
	toJSON() {
		return { type: "GeometryCollection", geometries: this.geometries };
	}
	get geometries() {
		return this.collection.map((g) => g.toJSON());
	}
	is(geometry) {
		if (
			!(geometry instanceof _GeometryCollection) ||
			this.collection.length !== geometry.collection.length
		)
			return !1;
		for (let i = 0; i < this.collection.length; i++)
			if (!this.collection[i].is(geometry.collection[i])) return !1;
		return !0;
	}
	clone() {
		return new _GeometryCollection(this.collection.map((p) => p.clone()));
	}
};
function equals(x, y) {
	if (Object.is(x, y)) return !0;
	if (x instanceof Date && y instanceof Date)
		return x.getTime() === y.getTime();
	if (x instanceof RegExp && y instanceof RegExp)
		return x.toString() === y.toString();
	if (x instanceof Value && y instanceof Value) return x.equals(y);
	if (
		typeof x !== "object" ||
		x === null ||
		typeof y !== "object" ||
		y === null
	)
		return !1;
	const keysX = Reflect.ownKeys(x);
	const keysY = Reflect.ownKeys(y);
	if (keysX.length !== keysY.length) return !1;
	for (let i = 0; i < keysX.length; i++)
		if (!Reflect.has(y, keysX[i]) || !equals(x[keysX[i]], y[keysX[i]]))
			return !1;
	return !0;
}
const MAX_i64 = 9223372036854775807n;
function escapeIdent(str) {
	if (isOnlyNumbers(str)) return `\u27E8${str}\u27E9`;
	let code;
	let i;
	let len;
	for (i = 0, len = str.length; i < len; i++)
		if (
			((code = str.charCodeAt(i)),
			!(code > 47 && code < 58) &&
				!(code > 64 && code < 91) &&
				!(code > 96 && code < 123) &&
				code !== 95)
		)
			return `\u27E8${str.replaceAll("\u27E9", "\\\u27E9")}\u27E9`;
	return str;
}
function escapeNumber(num) {
	return num <= MAX_i64 ? num.toString() : `\u27E8${num}\u27E9`;
}
function isOnlyNumbers(str) {
	const stripped = str.replace("_", "");
	const parsed = Number.parseInt(stripped);
	return !Number.isNaN(parsed) && parsed.toString() === stripped;
}
const Uuid = class _Uuid extends Value {
	inner;
	constructor(uuid) {
		super(),
			uuid instanceof ArrayBuffer
				? (this.inner = UUID.ofInner(new Uint8Array(uuid)))
				: uuid instanceof Uint8Array
					? (this.inner = UUID.ofInner(uuid))
					: uuid instanceof _Uuid
						? (this.inner = uuid.inner)
						: uuid instanceof UUID
							? (this.inner = uuid)
							: (this.inner = UUID.parse(uuid));
	}
	equals(other) {
		return other instanceof _Uuid ? this.inner.equals(other.inner) : !1;
	}
	toString() {
		return this.inner.toString();
	}
	toJSON() {
		return this.inner.toString();
	}
	toUint8Array() {
		return this.inner.bytes;
	}
	toBuffer() {
		return this.inner.bytes.buffer;
	}
	static v4() {
		return new _Uuid(uuidv4obj());
	}
	static v7() {
		return new _Uuid(uuidv7obj());
	}
};
const RecordId = class _RecordId extends Value {
	tb;
	id;
	constructor(tb, id2) {
		if ((super(), typeof tb !== "string"))
			throw new SurrealDbError("TB part is not valid");
		if (!isValidIdPart(id2)) throw new SurrealDbError("ID part is not valid");
		(this.tb = tb), (this.id = id2);
	}
	equals(other) {
		return other instanceof _RecordId
			? this.tb === other.tb && equals(this.id, other.id)
			: !1;
	}
	toJSON() {
		return this.toString();
	}
	toString() {
		const tb = escapeIdent(this.tb);
		const id2 = escapeIdPart(this.id);
		return `${tb}:${id2}`;
	}
};
const StringRecordId = class _StringRecordId extends Value {
	rid;
	constructor(rid) {
		if ((super(), rid instanceof _StringRecordId)) this.rid = rid.rid;
		else if (rid instanceof RecordId) this.rid = rid.toString();
		else if (typeof rid === "string") this.rid = rid;
		else throw new SurrealDbError("String Record ID must be a string");
	}
	equals(other) {
		return other instanceof _StringRecordId ? this.rid === other.rid : !1;
	}
	toJSON() {
		return this.rid;
	}
	toString() {
		return this.rid;
	}
};
function isValidIdPart(v) {
	if (v instanceof Uuid) return !0;
	switch (typeof v) {
		case "string":
		case "number":
		case "bigint":
			return !0;
		case "object":
			return Array.isArray(v) || v !== null;
		default:
			return !1;
	}
}
function escapeIdPart(id2) {
	return id2 instanceof Uuid
		? `u"${id2}"`
		: typeof id2 === "string"
			? escapeIdent(id2)
			: typeof id2 === "bigint" || typeof id2 === "number"
				? escapeNumber(id2)
				: toSurrealqlString(id2);
}
const Table = class _Table extends Value {
	tb;
	constructor(tb) {
		if ((super(), typeof tb !== "string"))
			throw new SurrealDbError("Table must be a string");
		this.tb = tb;
	}
	equals(other) {
		return other instanceof _Table ? this.tb === other.tb : !1;
	}
	toJSON() {
		return this.tb;
	}
	toString() {
		return this.tb;
	}
};
function toSurrealqlString(input) {
	if (typeof input === "string") return `s${JSON.stringify(input)}`;
	if (input === null) return "NULL";
	if (input === void 0) return "NONE";
	if (typeof input === "object") {
		if (input instanceof Date) return `d${JSON.stringify(input.toISOString())}`;
		if (input instanceof Uuid) return `u${JSON.stringify(input.toString())}`;
		if (input instanceof RecordId || input instanceof StringRecordId)
			return `r${JSON.stringify(input.toString())}`;
		if (input instanceof Geometry) return toSurrealqlString(input.toJSON());
		if (
			input instanceof Decimal ||
			input instanceof Duration ||
			input instanceof Future ||
			input instanceof Range ||
			input instanceof Table
		)
			return input.toJSON();
		switch (Object.getPrototypeOf(input)) {
			case Object.prototype: {
				let output2 = "{ ";
				const entries = Object.entries(input);
				for (const [i, [k, v]] of entries.entries())
					(output2 += `${JSON.stringify(k)}: ${toSurrealqlString(v)}`),
						i < entries.length - 1 && (output2 += ", ");
				return (output2 += " }"), output2;
			}
			case Map.prototype: {
				let output2 = "{ ";
				const entries = Array.from(input.entries());
				for (const [i, [k, v]] of entries.entries())
					(output2 += `${JSON.stringify(k)}: ${toSurrealqlString(v)}`),
						i < entries.length - 1 && (output2 += ", ");
				return (output2 += " }"), output2;
			}
			case Array.prototype:
				return `[ ${input.map(toSurrealqlString).join(", ")} ]`;
			case Set.prototype:
				return `[ ${[...new Set([...input].map(toSurrealqlString))].join(", ")} ]`;
		}
	}
	return `${input}`;
}
const Range = class _Range extends Value {
	constructor(beg, end) {
		super(), (this.beg = beg), (this.end = end);
	}
	equals(other) {
		return !(other instanceof _Range) ||
			this.beg?.constructor !== other.beg?.constructor ||
			this.end?.constructor !== other.end?.constructor
			? !1
			: equals(this.beg?.value, other.beg?.value) &&
					equals(this.end?.value, other.end?.value);
	}
	toJSON() {
		return this.toString();
	}
	toString() {
		const beg = escapeRangeBound(this.beg);
		const end = escapeRangeBound(this.end);
		return `${beg}${getRangeJoin(this.beg, this.end)}${end}`;
	}
};
const BoundIncluded = class {
	constructor(value) {
		this.value = value;
	}
};
const BoundExcluded = class {
	constructor(value) {
		this.value = value;
	}
};
const RecordIdRange = class _RecordIdRange extends Value {
	constructor(tb, beg, end) {
		if (
			(super(),
			(this.tb = tb),
			(this.beg = beg),
			(this.end = end),
			typeof tb !== "string")
		)
			throw new SurrealDbError("TB part is not valid");
		if (!isValidIdBound(beg)) throw new SurrealDbError("Beg part is not valid");
		if (!isValidIdBound(end)) throw new SurrealDbError("End part is not valid");
	}
	equals(other) {
		return !(other instanceof _RecordIdRange) ||
			this.beg?.constructor !== other.beg?.constructor ||
			this.end?.constructor !== other.end?.constructor
			? !1
			: this.tb === other.tb &&
					equals(this.beg?.value, other.beg?.value) &&
					equals(this.end?.value, other.end?.value);
	}
	toJSON() {
		return this.toString();
	}
	toString() {
		const tb = escapeIdent(this.tb);
		const beg = escapeIdBound(this.beg);
		const end = escapeIdBound(this.end);
		return `${tb}:${beg}${getRangeJoin(this.beg, this.end)}${end}`;
	}
};
function getRangeJoin(beg, end) {
	let output2 = "";
	return (
		beg instanceof BoundExcluded && (output2 += ">"),
		(output2 += ".."),
		end instanceof BoundIncluded && (output2 += "="),
		output2
	);
}
function isValidIdBound(bound) {
	return bound instanceof BoundIncluded || bound instanceof BoundExcluded
		? isValidIdPart(bound.value)
		: !0;
}
function escapeIdBound(bound) {
	return bound instanceof BoundIncluded || bound instanceof BoundExcluded
		? escapeIdPart(bound.value)
		: "";
}
function escapeRangeBound(bound) {
	if (bound === void 0) return "";
	const value = bound.value;
	return bound instanceof Range
		? `(${toSurrealqlString(value)})`
		: toSurrealqlString(value);
}
function rangeToCbor([beg, end]) {
	function encodeBound(bound) {
		return bound instanceof BoundIncluded
			? new Tagged(TAG_BOUND_INCLUDED, bound.value)
			: bound instanceof BoundExcluded
				? new Tagged(TAG_BOUND_EXCLUDED, bound.value)
				: null;
	}
	return [encodeBound(beg), encodeBound(end)];
}
function cborToRange(range) {
	function decodeBound(bound) {
		if (bound !== null) {
			if (bound.tag === TAG_BOUND_INCLUDED)
				return new BoundIncluded(bound.value);
			if (bound.tag === TAG_BOUND_EXCLUDED)
				return new BoundExcluded(bound.value);
			throw new SurrealDbError("Invalid bound tag");
		}
	}
	return [decodeBound(range[0]), decodeBound(range[1])];
}
const TAG_SPEC_DATETIME = 0;
const TAG_SPEC_UUID = 37;
const TAG_NONE = 6;
const TAG_TABLE = 7;
const TAG_RECORDID = 8;
const TAG_STRING_UUID = 9;
const TAG_STRING_DECIMAL = 10;
const TAG_CUSTOM_DATETIME = 12;
const TAG_STRING_DURATION = 13;
const TAG_CUSTOM_DURATION = 14;
const TAG_FUTURE = 15;
const TAG_RANGE = 49;
const TAG_BOUND_INCLUDED = 50;
const TAG_BOUND_EXCLUDED = 51;
const TAG_GEOMETRY_POINT = 88;
const TAG_GEOMETRY_LINE = 89;
const TAG_GEOMETRY_POLYGON = 90;
const TAG_GEOMETRY_MULTIPOINT = 91;
const TAG_GEOMETRY_MULTILINE = 92;
const TAG_GEOMETRY_MULTIPOLYGON = 93;
const TAG_GEOMETRY_COLLECTION = 94;
const replacer = {
	encode(v) {
		return v instanceof Date
			? new Tagged(TAG_CUSTOM_DATETIME, dateToCborCustomDate(v))
			: v === void 0
				? new Tagged(TAG_NONE, null)
				: v instanceof Uuid
					? new Tagged(TAG_SPEC_UUID, v.toBuffer())
					: v instanceof Decimal
						? new Tagged(TAG_STRING_DECIMAL, v.toString())
						: v instanceof Duration
							? new Tagged(TAG_CUSTOM_DURATION, v.toCompact())
							: v instanceof RecordId
								? new Tagged(TAG_RECORDID, [v.tb, v.id])
								: v instanceof StringRecordId
									? new Tagged(TAG_RECORDID, v.rid)
									: v instanceof RecordIdRange
										? new Tagged(TAG_RECORDID, [
												v.tb,
												new Tagged(TAG_RANGE, rangeToCbor([v.beg, v.end])),
											])
										: v instanceof Table
											? new Tagged(TAG_TABLE, v.tb)
											: v instanceof Future
												? new Tagged(TAG_FUTURE, v.inner)
												: v instanceof Range
													? new Tagged(TAG_RANGE, rangeToCbor([v.beg, v.end]))
													: v instanceof GeometryPoint
														? new Tagged(TAG_GEOMETRY_POINT, v.point)
														: v instanceof GeometryLine
															? new Tagged(TAG_GEOMETRY_LINE, v.line)
															: v instanceof GeometryPolygon
																? new Tagged(TAG_GEOMETRY_POLYGON, v.polygon)
																: v instanceof GeometryMultiPoint
																	? new Tagged(
																			TAG_GEOMETRY_MULTIPOINT,
																			v.points,
																		)
																	: v instanceof GeometryMultiLine
																		? new Tagged(
																				TAG_GEOMETRY_MULTILINE,
																				v.lines,
																			)
																		: v instanceof GeometryMultiPolygon
																			? new Tagged(
																					TAG_GEOMETRY_MULTIPOLYGON,
																					v.polygons,
																				)
																			: v instanceof GeometryCollection
																				? new Tagged(
																						TAG_GEOMETRY_COLLECTION,
																						v.collection,
																					)
																				: v;
	},
	decode(v) {
		if (!(v instanceof Tagged)) return v;
		switch (v.tag) {
			case TAG_SPEC_DATETIME:
				return new Date(v.value);
			case TAG_SPEC_UUID:
			case TAG_STRING_UUID:
				return new Uuid(v.value);
			case TAG_CUSTOM_DATETIME:
				return cborCustomDateToDate(v.value);
			case TAG_NONE:
				return;
			case TAG_STRING_DECIMAL:
				return new Decimal(v.value);
			case TAG_STRING_DURATION:
				return new Duration(v.value);
			case TAG_CUSTOM_DURATION:
				return Duration.fromCompact(v.value);
			case TAG_TABLE:
				return new Table(v.value);
			case TAG_FUTURE:
				return new Future(v.value);
			case TAG_RANGE:
				return new Range(...cborToRange(v.value));
			case TAG_RECORDID:
				return v.value[1] instanceof Range
					? new RecordIdRange(v.value[0], v.value[1].beg, v.value[1].end)
					: new RecordId(v.value[0], v.value[1]);
			case TAG_GEOMETRY_POINT:
				return new GeometryPoint(v.value);
			case TAG_GEOMETRY_LINE:
				return new GeometryLine(v.value);
			case TAG_GEOMETRY_POLYGON:
				return new GeometryPolygon(v.value);
			case TAG_GEOMETRY_MULTIPOINT:
				return new GeometryMultiPoint(v.value);
			case TAG_GEOMETRY_MULTILINE:
				return new GeometryMultiLine(v.value);
			case TAG_GEOMETRY_MULTIPOLYGON:
				return new GeometryMultiPolygon(v.value);
			case TAG_GEOMETRY_COLLECTION:
				return new GeometryCollection(v.value);
		}
	},
};
Object.freeze(replacer);
const supportedSurrealDbVersionMin = "1.4.2";
const supportedSurrealDbVersionUntil = "3.0.0";
const supportedSurrealDbVersionRange = `>= ${supportedSurrealDbVersionMin} < ${supportedSurrealDbVersionUntil}`;
let id = 0;
function getIncrementalID() {
	return (id = (id + 1) % Number.MAX_SAFE_INTEGER), id.toString();
}
const ConnectionStatus = ((ConnectionStatus2) => (
	(ConnectionStatus2.Disconnected = "disconnected"),
	(ConnectionStatus2.Connecting = "connecting"),
	(ConnectionStatus2.Connected = "connected"),
	(ConnectionStatus2.Error = "error"),
	ConnectionStatus2
))(ConnectionStatus || {});
const AbstractEngine = class {
	context;
	ready;
	status = "disconnected";
	connection = {
		url: void 0,
		namespace: void 0,
		database: void 0,
		token: void 0,
	};
	constructor(context) {
		this.context = context;
	}
	get emitter() {
		return this.context.emitter;
	}
	get encodeCbor() {
		return this.context.encodeCbor;
	}
	get decodeCbor() {
		return this.context.decodeCbor;
	}
	async req_post(body, url, headers_) {
		const headers = {
			"Content-Type": "application/cbor",
			Accept: "application/cbor",
			...headers_,
		};
		this.connection.namespace &&
			(headers["Surreal-NS"] = this.connection.namespace),
			this.connection.database &&
				(headers["Surreal-DB"] = this.connection.database),
			this.connection.token &&
				(headers.Authorization = `Bearer ${this.connection.token}`);
		const raw = await fetch(`${url ?? this.connection.url}`, {
			method: "POST",
			headers,
			body: this.encodeCbor(body),
		});
		const buffer = await raw.arrayBuffer();
		if (raw.status === 200) return buffer;
		const dec = new TextDecoder("utf-8");
		throw new HttpConnectionError(
			dec.decode(buffer),
			raw.status,
			raw.statusText,
			buffer,
		);
	}
};
function surrealdbWasmEngines(opts) {
	class WasmEmbeddedEngine extends AbstractEngine {
		ready = void 0;
		reader;
		status = ConnectionStatus.Disconnected;
		queue = [];
		processing = !1;
		db;
		async version() {
			return SurrealWasmEngine.version();
		}
		setStatus(status, ...args) {
			(this.status = status), this.emitter.emit(status, args);
		}
		async connect(url) {
			(this.connection.url = url), this.setStatus(ConnectionStatus.Connecting);
			const ready = (async () => {
				const db = await SurrealWasmEngine.connect(url.toString(), opts).catch(
					(e) => {
						console.log(e);
						const error = new UnexpectedConnectionError(
							typeof e === "string"
								? e
								: "error" in e
									? e.error
									: "An unexpected error occurred",
						);
						throw (this.setStatus(ConnectionStatus.Error, error), e);
					},
				);
				(this.db = db),
					this.setStatus(ConnectionStatus.Connected),
					(this.reader = (async () => {
						const reader = db.notifications().getReader();
						while (this.connected) {
							const { done, value } = await reader.read();
							if (done) break;
							const raw = value;
							const { id: id2, action, result } = this.decodeCbor(raw.buffer);
							id2 &&
								this.emitter.emit(
									`live-${id2.toString()}`,
									[action, result],
									!0,
								);
						}
					})());
			})();
			return (this.ready = ready), await ready;
		}
		async disconnect() {
			(this.connection = {
				url: void 0,
				namespace: void 0,
				database: void 0,
				token: void 0,
			}),
				await this.ready,
				(this.ready = void 0),
				this.db?.free(),
				(this.db = void 0),
				await this.reader,
				(this.reader = void 0),
				this.status !== ConnectionStatus.Disconnected &&
					this.setStatus(ConnectionStatus.Disconnected);
		}
		async rpc(request) {
			if ((await this.ready, !this.db)) throw new ConnectionUnavailable();
			return new Promise((resolve, reject) => {
				this.queue.push(async () => {
					try {
						const result = await this.execute(request);
						resolve(result);
					} catch (error) {
						reject(error);
					}
				}),
					this.processQueue();
			});
		}
		get connected() {
			return !!this.db;
		}
		async processQueue() {
			if (!this.processing) {
				for (this.processing = !0; this.queue.length > 0; ) {
					const task = this.queue.shift();
					if (task)
						try {
							await task();
						} catch (error) {
							console.error("Query execution failed", error);
						}
				}
				this.processing = !1;
			}
		}
		async execute(request) {
			const id2 = getIncrementalID();
			const res = await this.db
				.execute(new Uint8Array(this.encodeCbor({ id: id2, ...request })))
				.then((raw) => ({ result: this.decodeCbor(raw.buffer) }))
				.catch((message) => ({ error: { code: -1, message } }));
			if ("result" in res)
				switch (request.method) {
					case "use": {
						(this.connection.namespace = request.params?.[0]),
							(this.connection.database = request.params?.[1]);
						break;
					}
					case "signin":
					case "signup": {
						this.connection.token = res.result;
						break;
					}
					case "authenticate": {
						this.connection.token = request.params?.[0];
						break;
					}
					case "invalidate": {
						this.connection.token = void 0;
						break;
					}
				}
			return res;
		}
		export(options) {
			return this.db.export(
				options ? new Uint8Array(this.encodeCbor(options)) : void 0,
			);
		}
	}
	return { mem: WasmEmbeddedEngine, indxdb: WasmEmbeddedEngine };
}
export { surrealdbWasmEngines };
/*! Bundled license information:

uuidv7/dist/index.js:
  (**
   * uuidv7: A JavaScript implementation of UUID version 7
   *
   * @license Apache-2.0
   * @copyright 2021-2024 LiosK
   * @packageDocumentation
   *)
*/
