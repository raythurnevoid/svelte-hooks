<script lang="ts">
	import { onDestroy, onMount } from "svelte";
	import type { DestroyerFunc, Hook } from "./types.js";

	export let hook: Hook = null;
	export let effect: boolean = false;
	export let once: boolean = false;
	export let when: boolean = true;
	export let deps: any = undefined;

	let runDone = false;
	let memoDeps = {value: deps};

	let runDestroyer: DestroyerFunc;
	$: if (when && hook && !effect && depsChanged(deps)) {
		runDestroyer = runHook();
	}

	let mounted = false;
	onMount(() => {
		mounted = true;
	});

	$: if (when && hook && effect && mounted && depsChanged(deps)) {
		runDestroyer = runHook();
	}

	onDestroy(() => {
		if (runDestroyer) runDestroyer();
	});

	function runHook() {
		if ((once && !runDone) || !once) {
			runDone = true;
			return hook() as DestroyerFunc;
		}
	}

	function depsChanged(_deps = deps) {
		return memoDeps.value !== deps || deps === undefined;
	}
</script>
