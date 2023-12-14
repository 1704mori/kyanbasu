<script lang="ts">
	import FigmaAPI from '$lib/figma';
	import type { FigmaFile } from '$lib/figma/types';

	import { generateComponent } from '$lib/figma/builder';
	import type { DocumentChild } from '$lib/figma/types';
	import { onMount } from 'svelte';
	import LoginWithFigma from '$lib/components/LoginWithFigma.svelte';

	import { auth, logout } from '$lib/stores/auth';
	import { PUBLIC_FIGMA_CLIENT_ID, PUBLIC_FIGMA_REDIRECT_URI } from '$env/static/public';

	import Button from '$lib/components/Button.svelte';
	import Code from '$lib/components/Code.svelte';

	let fileID = '';
	let file: FigmaFile;
	let generated: string;

	let loading = false;
	let preview = false;

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
		const child = file.document.children[0].children[0] as unknown as DocumentChild;
		generated = generateComponent(child);
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

<div class="grid place-items-center mx-auto h-full max-w-5xl">
	{#if !$auth?.accessToken}
		<LoginWithFigma
			href="https://www.figma.com/oauth?client_id={PUBLIC_FIGMA_CLIENT_ID}&redirect_uri={PUBLIC_FIGMA_REDIRECT_URI}&scope=files:read&state={Date.now()}&response_type=code"
		/>
	{:else if file}
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
					<Code code={generated}/>
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
			<Button disabled={loading} {loading} on:click={handleSearchFile}>
				{#if loading}
					Loading...
				{:else}
					Search
				{/if}
			</Button>
		</div>
	{/if}
</div>
