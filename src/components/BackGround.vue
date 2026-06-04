<script setup>
</script>

<template>
	 <!-- <video loop autoplay muted>
    	<source src="../assets/background.mp4" type="video/mp4">
    	Your browser does not support the video tag.
	</video> -->
  <img src="../assets/WoodenTable.png" alt="background">
  <!-- <img id="king" src="../assets/king.png" alt="king on the background"> -->
</template>

<style scoped>
  img {
    position: fixed;
    z-index: 0;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  #king
  {
    position: absolute;
    top: 30%;
    left: 5%;
    width: 50%;
    height: 65%;
    z-index: 11;
  }
</style>