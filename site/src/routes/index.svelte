<svelte:options immutable={true} />

<script lang="ts">
	import { onMount } from "svelte";
	import {
		use,
		useEffect,
		useEffectOnce,
		useDebounce,
		useThrottle,
		useState,
	} from "../../../src";

	let count = 0;
	let derivedCount;
	let derivedCountOnMount;
	let count2 = 0;
	let derivedCount2;
	let derivedCount2OnMount;
	let count3 = 0;
	let derivedCount3;
	let derivedCount3OnMount;
	let count4 = 0;
	let derivedCount4;
	let derivedCount4OnMount;
	let count5 = 0;
	let derivedCount5;
	let derivedCount5OnMount;

	onMount(() => {
		derivedCountOnMount = derivedCount;
		derivedCount2OnMount = derivedCount2;
		derivedCount3OnMount = derivedCount3;
		derivedCount4OnMount = derivedCount4;
		derivedCount5OnMount = derivedCount5;
	});

	const useDerivedCount = use(updateDerivedCount);
	$: useDerivedCount([count]);
	const useDerivedCount2 = useEffect(updateDerivedCount2);
	$: useDerivedCount2([count2]);
	const useDerivedCount3 = useEffectOnce(updateDerivedCount3);
	$: count3 > 1 && useDerivedCount3([count3]);
	const useDerivedCount4 = useDebounce(updateDerivedCount4, 500);
	$: useDerivedCount4([count4]);
	const useDerivedCount5 = useThrottle(updateDerivedCount5, 500);
	$: useDerivedCount5([count5]);
	const useDerivedCount5State = useState(derivedCount5, (args) => {
		console.log(args);
	});

	$: [count5Val] = useDerivedCount5State(derivedCount5);

	function updateDerivedCount() {
		derivedCount = ~count;
	}

	function updateDerivedCount2() {
		derivedCount2 = ~count2;
		useDerivedCount2.setDeps([count2 + 1]);
	}

	function updateDerivedCount3() {
		derivedCount3 = ~count3;
		useDerivedCount3.setDeps([count3 + 1]);
	}

	function updateDerivedCount4() {
		derivedCount4 = ~count4;
		useDerivedCount3.setDeps([count4]);
	}

	function updateDerivedCount5() {
		derivedCount5 = ~count5;
		useDerivedCount3.setDeps([count5]);
	}
</script>

<div>
	{count}
	{derivedCount}
	{derivedCountOnMount}

	<button on:click={() => count++}>+</button>
</div>
<div>
	{count2}
	{derivedCount2}
	{derivedCount2OnMount}
	<button on:click={() => count2++}>+</button>
</div>
<div>
	{count3}
	{derivedCount3}
	{derivedCount3OnMount}
	<button on:click={() => count3++}>+</button>
</div>
<div>
	{count4}
	{derivedCount4}
	{derivedCount4OnMount}
	<button on:click={() => count4++}>+</button>
</div>
<div>
	{count5}
	{derivedCount5}
	{derivedCount5OnMount}
	{count5Val}
	<button on:click={() => count5++}>+</button>
</div>
