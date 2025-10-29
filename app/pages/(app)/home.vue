<script setup lang="ts">
definePageMeta({
  middleware: ["authenticated"],
  layout: "auth",
});

const { user, clear: clearSession } = useUserSession();

async function logout() {
  await clearSession();
  await navigateTo("login");
}
</script>

<template>
  <div class="flex flex-col items-center justify-center gap-4">
    <title>Tokenizer - Home</title>
    <h1>Welcome {{ (user as User).email }}</h1>
    <UButton @click="logout">Logout</UButton>
  </div>
</template>
