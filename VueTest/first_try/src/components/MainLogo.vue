<script setup>
</script>

<template>
	<header id="Logo">
		<div>
			<!-- <img src="../assets/logo_background.png"></img> -->
			<!-- <img src="../assets/logo.png"></img> -->
			<h1>
				<img id="mino" src="../assets/minotaur.png" alt="logo Minotaur">
				Chess
				<img id="zed" src="../assets/Zed.png" alt="logo Zed"></img>
			</h1>
		</div>
	</header>
</template>

<style scoped>
	@font-face {
		font-family: 'DeutschGothic';
		src: url('../../public/fonts/deutsch_gothic/Deutsch.ttf') format('truetype');
	}
	#Logo
	{
		position: fixed;
		left: 0%;
		top: 0%;
		width: 30vw;
		height: 20vh;
		z-index: 101;
	}
	h1
	{
		color: rgb(255, 255, 255);
		position: absolute;
		font-size: 600%;
        font-family: 'DeutschGothic', sans-serif;
		border: black;
		border-width: 10px;
		left: 30%;
		top: 15%;
		rotate: -2deg;
		/* font-weight: bold; */
	}
	span
	{
		color: gold;
		font-weight: 900;
	}
	#zed
	{
		position: absolute;
		top: 11%;
		left: 95%;
		width: 60%;
		height: 80%;
		rotate: 3deg;
		z-index: -1;
	}
	#mino
	{		
		position: absolute;
		top: 2%;
		left: -80%;
		width: 80%;
		height: 90%;
		rotate: -3deg;
		z-index: -1;
	}
	div 
	{
		display: flex;
		align-items: center;
		left: 10vw;
		top: 10vh;
	}
</style>