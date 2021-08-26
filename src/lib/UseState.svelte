<svelte:options immutable={true} />

<script context="module" lang="ts">
	let count = 0;
</script>

<script lang="ts">
	import Use from "./Use.svelte";
	import { onMount } from "svelte";

	export let value: any;
	export let onUpdate: (oldValue?: any) => void;
	export const id: string = `../../../../packages/common/hooks/UseState-${count++}`;

	let valueMemo: { value: any };
	onMount(() => {
		valueMemo = { value };
	});

	function onValueUpdate(value: any) {
		if (valueMemo === undefined) return;

		if (value !== valueMemo.value) {
			const currentValueMemo = valueMemo.value;

			onUpdate(valueMemo.value);

			if (currentValueMemo === valueMemo.value) {
				// Prevent infinite loop when setValue is called during onUpdate
				valueMemo.value = value;
			}
		}
	}

	export function setValue(newValue: typeof value) {
		if (valueMemo) valueMemo.value = newValue;
		value = newValue;
	}

	export function getValue() {
		return value;
	}
</script>

<Use effect hook={() => onValueUpdate(value)} />
