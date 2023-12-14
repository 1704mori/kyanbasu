<script lang="ts">
	import { cn } from '$lib';
	import type { HTMLInputAttributes } from 'svelte/elements';

	type $$Props = HTMLInputAttributes & {
    color?: 'accent' | 'transparent';
  };

	let className: $$Props['class'] = undefined;

	export let value: $$Props['value'] = undefined;
	export let color: 'accent' | 'transparent' = 'accent';

	export { className as class };

	function buildBaseColor() {
		switch (color) {
			case 'accent':
				return 'bg-neutral-900 file:bg-neutral-900 border-neutral-800 ring-offset-neutral-700 ring-neutral-800 focus-visible:ring-neutral-800';
			case 'transparent':
				return 'bg-transparent file:bg-transparent border-neutral-800 ring-offset-neutral-700 ring-neutral-800 focus-visible:ring-neutral-800';
			default:
				return 'bg-neutral-900 file:bg-neutral-900 border-neutral-800 ring-offset-neutral-700 ring-neutral-800 focus-visible:ring-neutral-800';
		}
	}
</script>

<input
	class={cn(
		'flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:text-sm file:font-medium placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
    buildBaseColor(),
		className
	)}
	bind:value
	on:blur
	on:change
	on:click
	on:focus
	on:keydown
	on:keypress
	on:keyup
	on:mouseover
	on:mouseenter
	on:mouseleave
	on:paste
	on:input
	{...$$restProps}
/>
