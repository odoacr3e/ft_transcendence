<script setup>
	import { gameMsg } from '@/scripts/Data/ChatBox';
</script>

<template>
	<div class="msgbox flex items-center px-3 py-2">
		<p class="line" :class="{ empty: !gameMsg.text }">
			{{ gameMsg.text || "No messages yet" }}
		</p>
	</div>
</template>

<style scoped>
	.msgbox
	{
		user-select: none;
		border: 1px solid rgba(255, 255, 255, .35);
		border-radius: 10px;
		background-color: rgba(0, 0, 0, .25);
	}

	.line
	{
		width: 100%;
		color: #e8e8e8;
		font-size: 0.9rem;
		line-height: 1.25rem;
		text-align: center;
		word-break: break-word;
	}

	.line.empty { color: rgba(255, 255, 255, .35); }
</style>
