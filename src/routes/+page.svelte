<script lang="ts">
	import FigmaAPI from '$lib/figma';
	import type { FigmaFile } from '$lib/figma/types';

	import { generateComponent, generateComponentFormatted } from '$lib/figma/builder';
	import type { DocumentChild } from '$lib/figma/types';
	import { onMount } from 'svelte';
	import LoginWithFigma from '$lib/components/LoginWithFigma.svelte';

	import { auth, logout } from '$lib/stores/auth';
	import { PUBLIC_FIGMA_CLIENT_ID, PUBLIC_FIGMA_REDIRECT_URI } from '$env/static/public';

	import Button from '$lib/components/Button.svelte';
	import Code from '$lib/components/Code.svelte';
	import Input from '$lib/components/Input.svelte';

	let fileID = '';
	let file: FigmaFile | undefined;
	let generated: string;

	let loading = false;
	let preview = false;
	let help = false;

	async function handleSearchFile() {
		if (!fileID) {
			alert('Please enter a file ID');
			return;
		}

		if (!$auth?.accessToken) {
			alert('Please login with Figma');
			return;
		}

		loading = true;
		const [data, err] = await FigmaAPI.getFile(fileID);
		if (err) {
			alert(err.message);
			loading = false;
			return;
		}

		file = data;
		loading = false;
	}

	async function handleGenerate() {
		const child = file!.document.children[0].children[0] as unknown as DocumentChild;
		generated = await generateComponentFormatted(child);
	}

	function handleHelp() {
		help = !help;
	}

	onMount(async () => {
		let accessToken = document.cookie.split('figma_access_token=')[1];
		if (!accessToken) return;
		accessToken = accessToken.split(';')[0];
		console.log(accessToken);

		const me = await FigmaAPI.getMe(accessToken);
		auth.set({ ...me, accessToken });
	});
</script>

<div class="grid place-items-center mx-auto h-full max-w-3xl">
	{#if !$auth?.accessToken}
		<LoginWithFigma
			href="https://www.figma.com/oauth?client_id={PUBLIC_FIGMA_CLIENT_ID}&redirect_uri={PUBLIC_FIGMA_REDIRECT_URI}&scope=files:read&state={Date.now()}&response_type=code"
		/>
	{:else if file}
		<div class="flex flex-col gap-2 w-full">
			<div class="flex flex-col gap-2">
				<div class="flex flex-row gap-2 font-medium">
					<span class="bg-neutral-900 px-3 py-2 rounded-lg">
						File ID: {fileID}
					</span>
					<span class="bg-neutral-900 px-3 py-2 rounded-lg">
						File Name: {file.name}
					</span>
					<span class="bg-neutral-900 px-3 py-2 rounded-lg">
						File Version: {file.version}
					</span>
					<span class="bg-neutral-900 px-3 py-2 rounded-lg">
						File Last Modified: {file.lastModified}
					</span>
				</div>
				<img class="w-full max-h-96 rounded-md object-none" src={file.thumbnailUrl} alt="File Thumbnail" />
			</div>
			{#if !generated}
				<Button on:click={handleGenerate}>Generate with TailwindCSS</Button>
			{:else}
				<Button on:click={() => (preview = !preview)}>Preview</Button>
			{/if}
			{#if preview}
				{@html generated}
			{/if}
			{#if generated}
				<div class="flex flex-col gap-2">
					<span> Generated: </span>
					<Code code={generated} />
				</div>
			{/if}
			<Button ghost="ghost" on:click={() => (file = undefined)}>Search Again</Button>
		</div>
	{:else}
		<div class="flex flex-col gap-5 w-full">
			<Input placeholder="File ID" bind:value={fileID} />
			{#if help}
				<div class="flex flex-col gap-2 text-neutral-500">
					<img class="rounded-md" src="images/figma_id_help.png" alt="Figma ID Help" />
					<span class="font-medium">
						To get the file ID, open the file in Figma and copy the ID from the URL as shown in the
						image above
					</span>
				</div>
			{/if}
			<div class="grid grid-cols-2 gap-2">
				<Button color="accent-light" disabled={loading} {loading} on:click={handleSearchFile}>
					{#if loading}
						Loading...
					{:else}
						Find
					{/if}
				</Button>
				<Button color="accent-light" ghost="ghost" on:click={handleHelp}>
					{#if help}
						Hide Help
					{:else}
						Show Help
					{/if}
				</Button>
			</div>
		</div>
	{/if}
</div>
