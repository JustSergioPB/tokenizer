<script setup lang="ts">
import { z } from "zod";
import type { FormSubmitEvent, RadioGroupItem } from "@nuxt/ui";
import {
  registerSchema,
  userTypes,
  type UserType,
} from "#shared/types/user.types";

definePageMeta({
  layout: "auth",
});

const isLoading = ref(false);

const { fetch: refreshSession } = useUserSession();
const { t } = useI18n();
const localePath = useLocalePath();
const toast = useToast();

const items = ref<RadioGroupItem[]>(
  userTypes.map((type) => ({
    label: t(`${type}Label`),
    description: t(`${type}Description`),
    value: type,
  })),
);

const schema = registerSchema.extend({
  terms: z.boolean().refine((data) => data, { message: "termsRequired" }),
  type: z.enum(userTypes, "mustPickOne"),
});

type Schema = z.infer<typeof schema>;

const state = reactive<Partial<Schema>>({
  email: undefined,
  password: undefined,
  orgName: undefined,
  type: undefined,
  terms: false,
});

async function onSubmit(event: FormSubmitEvent<Schema>) {
  isLoading.value = true;

  try {
    await $fetch("/api/auth/register", {
      method: "POST",
      body: event.data,
    });

    toast.add({
      title: t("registerSuccess"),
      description: t("registerSuccessDescription"),
      icon: "i-heroicons-check-circle",
      color: "success",
    });

    await refreshSession();
    await navigateTo(localePath("home"));
  } catch (error) {
    toast.add({
      title: t("registerError"),
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
    <title>{{ t("register") }}</title>
    <UForm :schema="schema" :state="state" class="widget" @submit="onSubmit">
      <header class="space-y-2">
        <h1 class="heading-4">{{ t("niceToMeetYou") }}</h1>
        <span class="flex items-center gap-2">
          <p class="body-sm-regular text-muted">
            {{ t("alreadyHaveAccount") }}
          </p>
          <ULink :to="localePath('login')" class="body-sm-regular underline">{{
            t("login")
          }}</ULink>
        </span>
      </header>
      <UFormField
        :label="t('accountTypeQuestion')"
        :help="t('accountTypeDescription')"
        name="type"
      >
        <URadioGroup
          variant="table"
          :items="items"
          @update:model-value="state.type = $event as UserType"
        />
      </UFormField>
      <UFormField
        v-if="state.type === 'organization'"
        :label="t('org')"
        name="orgName"
      >
        <UInput
          v-model="state.orgName"
          type="text"
          placeholder="Acme Inc."
          class="w-full"
          required
          :disabled="isLoading"
        />
      </UFormField>
      <UFormField :label="t('email')" name="email">
        <UInput
          v-model="state.email"
          type="email"
          placeholder="m@example.com"
          class="w-full"
          required
          :disabled="isLoading"
        />
      </UFormField>
      <PasswordIndicator
        v-model:password="state.password"
        :disabled="isLoading"
        class="w-full"
      />
      <div class="widget-sm">
        <UFormField name="terms">
          <UCheckbox
            v-model="state.terms"
            :label="t('termsDescription')"
            size="sm"
          />
        </UFormField>
        <ULink
          :to="localePath('terms')"
          class="body-sm-regular ml-6 underline"
          >{{ t("terms") }}</ULink
        >
      </div>
      <UButton
        :loading="isLoading"
        :label="t('register')"
        type="submit"
        icon="i-lucide-rocket"
        class="flex w-full justify-center"
      />
    </UForm>
  </div>
</template>
