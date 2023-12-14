<script lang="ts">
	import type TailwindColors from 'tailwindcss/colors';
	import { cn } from '$lib';

	type Colors = keyof typeof TailwindColors;

	export let type: 'button' | 'submit' | 'reset' = 'button';
	// phantasm is a ghost button that is not visible until hovered
	export let ghost: 'phantasm' | 'ghost' | 'none' = 'none';

	export let size: 'sm' | 'md' | 'lg' = 'md';
	export let color: 'primary' = 'primary';
	export let loading = false;
	export let disabled = false;

	const sizes: Record<string, string> = {
		sm: 'py-1 px-2 text-sm',
		md: 'py-2 px-4 text-md',
		lg: 'py-3 px-6 text-lg'
	};

	function buildBaseColor() {
		switch (color) {
			case 'primary':
				return 'bg-primary hover:bg-primary-accent text-white';
			default:
				return 'bg-primary hover:bg-primary-accent text-white';
		}
	}

	function buildGhost() {
		switch (color) {
			case 'primary':
				return 'bg-primary/20 hover:bg-primary/30 border border-primary';
			default:
				return 'bg-primary/20 hover:bg-primary/30 border border-primary';
		}
	}

	function buildPhantasm() {
		switch (color) {
			case 'primary':
				return 'bg-transparent border border-primary hover:bg-primary/20 text-white';
			default:
				return 'bg-transparent border border-primary hover:bg-primary/20 text-white';
		}
	}

	function buildLoading() {
		switch (color) {
			case 'primary':
				return 'bg-primary/50 cursor-not-allowed';
			default:
				return 'bg-primary/50 cursor-not-allowed';
		}
	}

	function buildDisabled() {
		switch (color) {
			case 'primary':
				return 'bg-primary/50';
			default:
				return 'bg-primary/50';
		}
	}
</script>

<button
	{type}
	{...$$props}
	class={cn(
		sizes[size],
		buildBaseColor(),
		ghost === 'ghost' && buildGhost(),
		ghost === 'phantasm' && buildPhantasm(),
		loading && buildLoading(),
		'rounded-lg',
		'font-medium',
		'transition-colors',
		'focus:outline-none',
		'focus:ring-2',
		'focus:ring-${color}-500',
		'focus:ring-opacity-50',
		// `disabled:bg-${color}/50`,
		disabled && buildDisabled(),
		'disabled:cursor-not-allowed',
		'disabled:pointer-events-none'
	)}
	disabled={loading || disabled}
	on:click
	on:submit
>
	<slot />
</button>

<style>
</style>
