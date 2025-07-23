export const NUXT_APP_FILE = `<script lang="ts" setup>
import "./main.css";
</script>

<template>
  <NuxtPage />
</template>`

export const NUXT_INDEX_FILE = `<script setup lang="ts"></script>

<template>
  <div>Nuxt.js</div>
</template>

<style scoped></style>`

export const NUXT_INDEX_FILE_WITH_NUXT_UI = `<script setup lang="ts"></script>

<template>
  <div class="text-6xl">Nuxt.js with Nuxt UI and Tailwind CSS</div>
</template>

<style scoped></style>`

export const NUXT_MAIN_CSS = `body {
	width: 100%;
	min-height: 100vh;

	display: flex;
	align-items: center;
	justify-content: center;
}
`
export const NUXT_MAIN_CSS_WITH_NUXT_UI = `@import "tailwindcss";
@import "@nuxt/ui";

body {
	width: 100%;
	min-height: 100vh;

	display: flex;
	align-items: center;
	justify-content: center;
}
`
