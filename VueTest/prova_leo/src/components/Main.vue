<script setup>

	const operation = ["12 + 3", "13 - 2", "tua madre - tua nonna"];
	const index = 0;
	const res1 = 11;
	const res2 = 2;
	const res3 = 15;

</script>

<template>
	<main>
		<section id="question">
			<p>Vediamo se la matematica per te  non è un opinione</p>
			<p>Quanto vale: <span> {{ operation[index] }}? </span></p>
		</section>
		<section id="buttons_row">
			<button>{{ res1 }}</button>
			<button>{{ res2 }}</button>
			<button>{{ res3 }}</button>
		</section>
	</main>
</template>

<style scoped>
	main
	{
		background: #24c3f3;
		/* max-width: 30%; */
		border-radius: 0 60px 0 60px;
		border-style: inset;
		border-width: 10px;
		padding: 35px;
		margin-top: 10%;
		margin-left: 25%;
		margin-right: 25%;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 10px; 
	}

	span
	{
		color: rgb(241, 0, 0, 1);
		font-family:'Courier New', Courier, monospace;
		background-color: rgb(0, 0, 0, 0.85);
		border: 0;
		margin-left: 4%;
		font-size: 80%;
		padding: 5px;
		border-radius: 6px;
	}

	button
	{
		/* border: 10px; */
		scale: 120%;
		border-width: 10%;
		border-radius: 25%;
		color: white;
		background-color: black;
	}

	button:hover
	{
		background-color: rgb(0, 0, 0, 0.5);
		box-shadow: 0 .1rem 0 0 var(white);
	}


	#buttons_row
	{
		display: flex;
		flex-direction: row;
		gap: 20px;
		justify-content: center;
		align-items: center;
	}
</style>
