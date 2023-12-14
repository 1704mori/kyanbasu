<script lang="ts">
	import type TailwindColors from 'tailwindcss/colors';
	import { cn } from '$lib';

	type Colors = keyof typeof TailwindColors;

	export let type: 'button' | 'submit' | 'reset' = 'button';
	// phantasm is a ghost button that is not visible until hovered
	export let ghost: 'phantasm' | 'ghost' | 'none' = 'none';

	export let size: 'sm' | 'md' | 'lg' = 'md';
	export let color: 'primary' | "accent" | "accent-light" = 'primary';
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
				return 'bg-primary hover:bg-primary-accent';
      case 'accent':
        return 'bg-neutral-900 hover:bg-neutral-800';
      case 'accent-light':
        return 'bg-neutral-800 hover:bg-neutral-700';
			default:
				return 'bg-primary hover:bg-primary-accent';
		}
	}

	function buildGhost() {
		switch (color) {
			case 'primary':
				return 'bg-primary/20 hover:bg-primary/30 border border-primary';
      case 'accent':
        return 'bg-neutral-900/20 hover:bg-neutral-800/30 border border-neutral-800';
      case 'accent-light':
        return 'bg-neutral-800/20 hover:bg-neutral-700/30 border border-neutral-700';
			default:
				return 'bg-primary/20 hover:bg-primary/30 border border-primary';
		}
	}

	function buildPhantasm() {
		switch (color) {
			case 'primary':
				return 'bg-transparent border border-primary hover:bg-primary/20';
      case 'accent':
        return 'bg-transparent border border-neutral-800 hover:bg-neutral-800/30';
      case 'accent-light':
        return 'bg-transparent border border-neutral-700 hover:bg-neutral-700/30';
			default:
				return 'bg-transparent border border-primary hover:bg-primary/20';
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
		loading && "opacity-50 cursor-not-allowed",
		'rounded-md',
		'font-medium',
		'transition-colors',
		'focus:outline-none',
		'focus:ring-1',
		'focus:ring-opacity-50',
		`disabled:opacity-50`,
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
