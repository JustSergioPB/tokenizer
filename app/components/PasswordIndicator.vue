<script setup lang="ts">
const password = defineModel<string>("password");

const props = defineProps<{
  class?: string;
  disabled?: boolean;
}>();

const { t } = useI18n();

const show = ref(false);

const strength = computed(() => checkStrength(password.value || ""));
const score = computed(() => strength.value.filter((req) => req.met).length);

const color = computed(() => {
  if (score.value === 0) return "neutral";
  if (score.value <= 1) return "error";
  if (score.value <= 2) return "warning";
  if (score.value === 3) return "warning";
  return "success";
});

const text = computed(() => {
  if (score.value === 0) return t("enterPassword");
  if (score.value <= 2) return t("weakPassword");
  if (score.value === 3) return t("mediumPassword");
  return t("strongPassword");
});

function checkStrength(str: string) {
  const requirements = [
    { regex: /.{8,}/, text: t("minChars", { min: 8 }) },
    { regex: /\d/, text: t("atLeastOneNumber") },
    { regex: /[a-z]/, text: t("atLeastOneLowercaseLetter") },
    { regex: /[A-Z]/, text: t("atLeastOneUppercaseLetter") },
    { regex: /[^A-Za-z0-9]/, text: t("atLeastOneSpecialCharacter") },
  ];

  return requirements.map((req) => ({
    met: req.regex.test(str),
    text: req.text,
  }));
}
</script>

<template>
  <div class="space-y-2" :class="props.class">
    <UFormField :label="t('password')">
      <UInput
        v-model="password"
        :placeholder="t('password')"
        :color="color"
        :type="show ? 'text' : 'password'"
        :aria-invalid="score < 4"
        aria-describedby="password-strength"
        :ui="{ trailing: 'pe-1' }"
        :disabled="disabled"
        class="w-full"
      >
        <template #trailing>
          <UButton
            color="neutral"
            variant="link"
            size="sm"
            :icon="show ? 'i-lucide-eye-off' : 'i-lucide-eye'"
            :aria-label="show ? t('hidePassword') : t('showPassword')"
            :aria-pressed="show"
            aria-controls="password"
            @click="show = !show"
          />
        </template>
      </UInput>
    </UFormField>

    <UProgress
      :color="color"
      :indicator="text"
      :model-value="score"
      :max="4"
      size="sm"
    />

    <p id="password-strength" class="body-xs-medium">
      {{ text }}. {{ t("mustContain") }}
    </p>

    <ul class="space-y-1" :aria-label="t('passwordRequirements')">
      <li
        v-for="(req, index) in strength"
        :key="index"
        class="flex items-center gap-0.5"
        :class="req.met ? 'text-success' : 'text-muted'"
      >
        <UIcon
          :name="req.met ? 'i-lucide-circle-check' : 'i-lucide-circle-x'"
          class="size-4 shrink-0"
        />

        <span class="body-xs-regular">
          {{ req.text }}
          <span class="sr-only">
            {{ req.met ? t("requirementMet") : t("requirementNotMet") }}
          </span>
        </span>
      </li>
    </ul>
  </div>
</template>
