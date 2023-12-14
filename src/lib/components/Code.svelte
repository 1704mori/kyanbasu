<script lang="ts">
	import { clipboard } from '$lib/clipboard';

	export let code = '';

	export let buttonCopied = '👍';

	let copyState = false;

	function onCopyClick() {
		copyState = true;
		setTimeout(() => {
			copyState = false;
		}, 2000);
	}
</script>

<div class="bg-neutral-900 shadow text-sm text-neutral-100 py-2 px-4 rounded-lg relative">
	<button class="absolute top-1 right-2" on:click={onCopyClick} use:clipboard={code}>
		{!copyState ? 'copy' : buttonCopied}
	</button>
	<pre class="whitespace-break-spaces break-all">
<code>
{code}
</code>
</pre>
</div>
