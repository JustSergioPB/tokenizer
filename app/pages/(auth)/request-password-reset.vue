<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui";
import type { ForgotPassword } from "#shared/types/user.types";
import { forgotPasswordSchema } from "#shared/types/user.types";

definePageMeta({
  layout: "auth",
});

const isLoading = ref(false);

const { t } = useI18n();
const localePath = useLocalePath();
const toast = useToast();

const state = reactive<Partial<ForgotPassword>>({
  email: undefined,
});

async function onSubmit(event: FormSubmitEvent<ForgotPassword>) {
  isLoading.value = true;
  try {
    await $fetch("/api/auth/request-password-reset", {
      method: "POST",
      body: event.data,
    });

    toast.add({
      title: t("forgotPasswordSuccess"),
      description: t("forgotPasswordSuccessDescription"),
      icon: "i-heroicons-check-circle",
      color: "primary",
    });
  } catch (error) {
    toast.add({
      title: t("forgotPasswordError"),
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
    <title>{{ t("forgotPassword") }}</title>
    <UForm
      :schema="forgotPasswordSchema"
      :state="state"
      class="widget"
      @submit="onSubmit"
    >
      <div class="space-y-2">
        <h1 class="heading-4">{{ t("forgotPasswordTitle") }}</h1>
        <span class="flex items-center gap-2">
          <p class="body-sm-regular text-muted">{{ t("rememberPassword") }}</p>
          <ULink :to="localePath('login')" class="body-sm-regular underline">{{
            t("login")
          }}</ULink>
        </span>
      </div>
      <UFormField :label="t('email')" name="email">
        <UInput
          v-model="state.email"
          type="email"
          placeholder="m@example.com"
          class="w-full"
          required
        />
      </UFormField>
      <UButton
        :loading="isLoading"
        :label="t('sendResetLink')"
        type="submit"
        icon="i-lucide-send"
        class="flex w-full justify-center"
      />
    </UForm>
  </div>
</template>
