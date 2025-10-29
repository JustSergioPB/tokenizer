<script setup lang="ts">
import { resetPasswordSchema } from "#shared/types/user.types";
import type { ResetPassword } from "#shared/types/user.types";
import type { FormSubmitEvent } from "@nuxt/ui";

definePageMeta({
  layout: "auth",
});

const isLoading = ref(false);
const { t } = useI18n();
const toast = useToast();
const route = useRoute();

const state = reactive<Partial<ResetPassword>>({
  password: undefined,
  token: undefined,
});

watch(
  () => route.query.token,
  (newToken) => {
    if (typeof newToken === "string") {
      state.token = newToken;
    }
  },
  { immediate: true },
);

async function onSubmit(event: FormSubmitEvent<ResetPassword>) {
  isLoading.value = true;
  try {
    await $fetch("/api/auth/reset-password", {
      method: "POST",
      body: { password: event.data.password, token: event.data.token },
    });

    toast.add({
      title: t("resetPasswordSuccess"),
      description: t("resetPasswordSuccessDescription"),
      icon: "i-heroicons-check-circle",
      color: "success",
    });

    await navigateTo("login");
  } catch (error) {
    toast.add({
      title: t("resetPasswordError"),
      description: error instanceof Error ? error.message : t("unknownError"),
      icon: "i-heroicons-exclamation-triangle",
      color: "error",
    });
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <div class="space-y-6">
    <title>{{ t("resetPassword") }}</title>
    <UForm
      :schema="resetPasswordSchema"
      :state="state"
      class="widget"
      @submit="onSubmit"
    >
      <header class="space-y-2">
        <h1 class="heading-4">{{ t("resetPasswordTitle") }}</h1>
        <p class="body-sm-regular text-muted">
          {{ t("resetPasswordDescription") }}
        </p>
      </header>
      <input v-model="state.token" type="hidden" name="token" >
      <PasswordIndicator v-model:password="state.password" class="w-full" />
      <UButton
        :loading="isLoading"
        type="submit"
        icon="i-lucide-key"
        class="flex w-full justify-center"
      >
        {{ t("resetPassword") }}
      </UButton>
    </UForm>
  </div>
</template>
