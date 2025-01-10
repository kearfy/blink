const Deno =
	globalThis.Deno ??
	(typeof global > "u"
		? void 0
		: { readFile: (await import("node:fs")).readFileSync });
const module = await (async () => {
	const crypto = globalThis.crypto ?? (await import("node:crypto"));
	return {
		require: (string) => {
			if (string !== "crypto") throw new Error(`Unexpected require ${string}`);
			return crypto;
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
function makeMutClosure(arg0, arg1, dtor, f) {
	const state = { a: arg0, b: arg1, cnt: 1, dtor };
	const real = (...args) => {
		state.cnt++;
		const a = state.a;
		state.a = 0;
		try {
			return f(a, state.b, ...args);
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
function handleError(f, args) {
	try {
		return f.apply(this, args);
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
import {
	AbstractEngine,
	ConnectionStatus,
	ConnectionUnavailable,
	UnexpectedConnectionError,
	getIncrementalID,
} from "surrealdb";
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
							const { id, action, result } = this.decodeCbor(raw.buffer);
							id &&
								this.emitter.emit(
									`live-${id.toString()}`,
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
			const id = getIncrementalID();
			const res = await this.db
				.execute(new Uint8Array(this.encodeCbor({ id, ...request })))
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
