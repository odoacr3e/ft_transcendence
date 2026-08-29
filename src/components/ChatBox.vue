<script setup>
	import { computed }				from 'vue'
	import { chat, resolveAuthor }	from '@/scripts/Data/ChatBox';

	const last = computed(() => chat.messages.at(-1) ?? null);
	const origin = computed(() => last.value ? resolveAuthor(last.value.author) : null);

	const	originClass = computed(() => {
		if (!origin.value)
			return ('');
		if (origin.value.kind === 'server')
			return ('k-server');
		return (origin.value.team ? `t-${origin.value.team}` : '');
	});
</script>

<template>
	<div class="msgbox flex items-center px-3 py-2" :class="originClass">
		<p v-if="last" class="line">
			<span class="author">{{ last.author }}:</span> {{ last.text }}
		</p>
		<p v-else class="line empty">No messages yet</p>
	</div>
</template>

<style scoped>
	.msgbox
	{
		--author-color: rgba(255, 255, 255, .35);

		user-select: none;
		border: 1px solid rgba(255, 255, 255, .35);
		border-left: 4px solid var(--author-color);
		border-radius: 10px;
		background-color: rgba(0, 0, 0, .25);
	}

	.msgbox.k-server	{ --author-color: #e57373; }
	.msgbox.t-white		{ --author-color: #ededed; }
	.msgbox.t-black		{ --author-color: #6b6b6b; }
	.msgbox.t-red		{ --author-color: #d5493f; }
	.msgbox.t-blue		{ --author-color: #4a7fd0; }
	.msgbox.t-green		{ --author-color: #4fa564; }
	.msgbox.t-yellow	{ --author-color: #d8b13c; }

	.line
	{
		width: 100%;
		color: #e8e8e8;
		font-size: 0.9rem;
		line-height: 1.25rem;
		text-align: left;
		word-break: break-word;
	}

	.author
	{
		color: var(--author-color);
		font-weight: 600;
	}

	.line.empty
	{
		color: rgba(255, 255, 255, .35);
		text-align: center;
	}

</style>
