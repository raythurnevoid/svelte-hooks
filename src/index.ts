import Use from "./Use.svelte";
import UseState from "./UseState.svelte";
import UseDebounce from "./UseDebounce.svelte";
import { arrayEquals } from "./utils";
import { onMount } from "svelte";

export { Use, UseState, UseDebounce };
export * from "./types";

export function use(cb: () => void) {
	class _Use {
		private deps: any;

		constructor() {}

		hook(deps: any[]) {
			let uninitialized = this.deps?.length === undefined;
			let firstUpdate = uninitialized && deps?.length !== undefined;
			let updated =
				firstUpdate || (this.deps !== deps && !arrayEquals(this.deps, deps));

			if (updated) {
				this.setDeps(deps);
				cb();
			}
		}

		setDeps(deps: any[]) {
			this.deps = deps;
		}
	}

	const _use = new _Use();
	return createHookApi((deps: any) => _use.hook(deps), {
		setDeps(deps: any) {
			_use.setDeps(deps);
		},
	});
}

export function useEffect(cb: () => void) {
	let _deps: any[];
	let mounted = false;

	const hook = use(cb);

	onMount(() => {
		mounted = true;
		hook(_deps);
	});

	return createHookApi(
		(deps: any[]) => {
			_deps = deps;
			if (mounted) {
				return hook(deps);
			}
		},
		{
			setDeps(deps: any[]) {
				hook.setDeps(deps);
			},
		}
	);
}

export function useOnce(cb: () => void) {
	let run = true;

	return () => {
		if (run) {
			run = false;
			return cb();
		}
	};
}

export function useEffectOnce(cb: () => void) {
	const hook = useEffect(useOnce(cb));

	return createHookApi(
		(deps: any[]) => {
			return hook(deps);
		},
		{
			setDeps(deps: any[]) {
				hook.setDeps(deps);
			},
		}
	);
}

export function useDebounce(cb: () => void, debounce: number) {
	const hook = use(cb);
	let timeout: number;

	return createHookApi(
		(deps: any[]) => {
			if (timeout) return;
			timeout = setTimeout(() => {
				timeout = null;
				hook(deps);
			}, debounce);
		},
		{
			setDeps(deps: any[]) {
				hook.setDeps(deps);
			},
		}
	);
}

export function useThrottle(cb: () => void, throttle: number) {
	const hook = use(cb);
	let timeout: number;

	return createHookApi(
		(deps: any[]) => {
			clearTimeout(timeout);
			timeout = setTimeout(() => {
				timeout = null;
				hook(deps);
			}, throttle);
		},
		{
			setDeps(deps: any[]) {
				hook.setDeps(deps);
			},
		}
	);
}

export function useState<T = any>(
	initialValue: T,
	cb: (updateArgs: { newValue: T; oldValue: T }) => void
) {
	let oldValue: T = initialValue;
	let newValue: T;

	const hook = use(() => {
		cb({
			newValue,
			oldValue,
		});
		oldValue = newValue;
	});

	return createHookApi(
		(value: T) => {
			newValue = value;
			hook([value]);
			return [value, oldValue];
		},
		{
			setState(value: T) {
				hook.setDeps([value]);
			},
		}
	);
}

export function createHookApi<
	T = () => void,
	Api extends { [prop: string]: (...args: any) => any } = {
		[prop: string]: () => void;
	}
>(updater: T, api: Api): T & Api {
	return Object.assign(updater, {
		...api,
	});
}
