<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui";

definePageMeta({
  layout: "auth",
});

const isLoading = ref(false);
const showPassword = ref(false);

const { fetch: refreshSession } = useUserSession();
const { t } = useI18n();
const localePath = useLocalePath();
const toast = useToast();

const state = reactive<Partial<Login>>({
  email: undefined,
  password: undefined,
});

async function onSubmit(event: FormSubmitEvent<Login>) {
  isLoading.value = true;
  try {
    await $fetch("/api/auth/login", {
      method: "POST",
      body: event.data,
    });

    toast.add({
      title: t("loginSuccess"),
      description: t("loginSuccessDescription"),
      icon: "i-heroicons-check-circle",
      color: "success",
    });

    await refreshSession();
    await navigateTo(localePath("home"));
  } catch (error) {
    toast.add({
      title: t("loginError"),
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
    <title>{{ t("login") }}</title>
    <UForm
      :schema="loginSchema"
      :state="state"
      class="widget"
      @submit="onSubmit"
    >
      <div class="space-y-2">
        <h1 class="heading-3">{{ t("welcomeBack") }}</h1>
        <span class="flex items-center gap-2">
          <p class="body-sm-regular text-muted">{{ t("dontHaveAccount") }}</p>
          <ULink
            :to="localePath('register')"
            class="body-sm-regular underline"
            >{{ t("register") }}</ULink
          >
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
      <div class="widget-sm">
        <UFormField :label="t('password')" name="password" class="w-full">
          <UInput
            v-model="state.password"
            :type="showPassword ? 'text' : 'password'"
            placeholder="********"
            class="w-full"
            :ui="{ trailing: 'pe-1' }"
            required
          >
            <template #trailing>
              <UButton
                color="neutral"
                variant="link"
                size="sm"
                :icon="showPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'"
                :aria-label="
                  showPassword ? t('hidePassword') : t('showPassword')
                "
                :aria-pressed="showPassword"
                aria-controls="password"
                @click="showPassword = !showPassword"
              />
            </template>
          </UInput>
        </UFormField>
        <ULink
          :to="localePath('request-password-reset')"
          class="body-sm-regular underline"
          >{{ t("forgotPassword") }}
        </ULink>
      </div>
      <UButton
        :loading="isLoading"
        :label="t('login')"
        type="submit"
        icon="i-lucide-log-in"
        class="flex w-full justify-center"
      />
    </UForm>
  </div>
</template>
