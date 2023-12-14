<script lang="ts">
	import { generateComponent } from "$lib/figma/builder";
  import file from "$lib/figma/file.json";
	import type { DocumentChild } from "$lib/figma/types";

  const child = file.document.children[0].children[0] as unknown as DocumentChild;
  const component = generateComponent(child)
</script>

<!-- <h1>Welcome to SvelteKit</h1> -->
<!-- <p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p> -->

{@html component}