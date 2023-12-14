<script lang="ts">
	import FigmaAPI from '$lib/figma';
	import type { FigmaFile } from '$lib/figma/types';

	// import file from "$lib/figma/file.json";
	import { generateComponent } from '$lib/figma/builder';
	import type { DocumentChild } from '$lib/figma/types';

	// const child = file.document.children[0].children[0] as unknown as DocumentChild;
	// const component = generateComponent(child)

	let fileID = '';
	let file: FigmaFile;
	let generated: string;

	let loading = false;

	async function handleSearchFile() {
		const cookies = document.cookie;
		const accessToken = cookies.split('figma_access_token=')[1].split(';')[0];

		if (!accessToken) {
			alert('Please login first');
			return;
		}

		loading = true;
		file = await FigmaAPI.getFile(accessToken, fileID);
		loading = false;
	}

	function handleGenerate() {
		const child = file.document.children[0].children[0] as unknown as DocumentChild;
		const component = generateComponent(child);

		generated = component;
	}
</script>

<div class="grid place-items-center h-full">
	{#if file}
		<div class="flex flex-col gap-2">
			<div class="flex flex-col gap-1">
				<span>
					File ID: {fileID}
				</span>
				<span>
					File Name: {file.name}
				</span>
				<span>
					File Version: {file.version}
				</span>
				<span>
					File Last Modified: {file.lastModified}
				</span>
			</div>
			<button
				type="button"
				class="rounded-lg p-2 bg-blue-600 hover:bg-blue-700 text-white"
        on:click={handleGenerate}
			>
				Generate with TailwindCSS
			</button>
      {#if generated}
        <div class="flex flex-col gap-2">
          <span>
            Generated:
          </span>
          <code class="bg-neutral-900 p-2 rounded-lg">
            {generated}
          </code>
        </div>
      {/if}
		</div>
	{:else}
		<div class="flex flex-col gap-1">
			<input
				class="bg-neutral-900 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
				type="text"
				placeholder="File ID"
				bind:value={fileID}
			/>
			<button
				disabled={loading}
				type="button"
				class={`
        rounded-lg
        p-2
        bg-blue-600
        hover:bg-blue-700
        text-white
        ${loading ? 'cursor-not-allowed opacity-50' : ''}
      `}
				on:click={handleSearchFile}
			>
				{#if loading}
					Loading...
				{:else}
					Search
				{/if}
			</button>
		</div>
	{/if}
</div>
