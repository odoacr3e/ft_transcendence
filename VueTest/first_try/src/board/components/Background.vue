<script setup>
</script>

<template>
	 <video loop autoplay muted>
    	<source src="../../home/assets/background.mp4" type="video/mp4">
    	Your browser does not support the video tag.
	</video>
</template>

<style scoped>
  video {
    position: fixed;
    z-index: 0;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    pointer-events: none;
  }
</style>