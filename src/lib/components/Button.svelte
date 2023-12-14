<script lang="ts">
	import type TailwindColors from 'tailwindcss/colors';
	import { cn } from '$lib';

	type Colors = keyof typeof TailwindColors;

	export let type: 'button' | 'submit' | 'reset' = 'button';
  // phantasm is a ghost button that is not visible until hovered
  export let ghost: "phantasm" | "ghost" = "ghost";

	export let size: 'sm' | 'md' | 'lg' = 'md';
	export let color: Colors = 'blue';
	export let loading = false;
	export let disabled = false;

	const sizes: Record<string, string> = {
		sm: 'py-1 px-2 text-sm',
		md: 'py-2 px-4 text-md',
		lg: 'py-3 px-6 text-lg'
	};
</script>

<button
	{type}
  {...$$props}
  class={cn(
    sizes[size],
    `${ghost}`,
    // "bg-blue-600 hover:bg-blue-700 hover:bg-blue-600/20 bg-blue-600/50 border-blue-600",
    `bg-${color}-600 hover:bg-${color}-700 text-white`,
    ghost === "phantasm" && `bg-transparent border border-${color}-600 hover:bg-${color}-600/20 text-white`,
    ghost === "ghost" && `bg-${color}-600/20 hover:bg-${color}-600/30 border border-${color}-600`,
    loading && `bg-${color}-600/50 cursor-not-allowed`,
    "rounded-lg",
    "font-medium",
    "transition-colors",
    "focus:outline-none",
    "focus:ring-2",
    "focus:ring-${color}-500",
    "focus:ring-opacity-50",
    `disabled:bg-${color}-600/50`,
    "disabled:cursor-not-allowed",
    "disabled:pointer-events-none",
  )}
	disabled={loading || disabled}
  on:click
  on:submit
>
	<slot />
</button>

<style>
</style>
