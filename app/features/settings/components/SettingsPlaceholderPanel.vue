<script setup lang="ts">
defineProps<{
  title: string
  description?: string
}>()

const { t } = useI18n()
</script>

<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-xl font-bold text-foreground">
        {{ title }}
      </h2>
      <p
        v-if="description"
        class="text-sm text-muted-foreground mt-1"
      >
        {{ description }}
      </p>
    </div>

    <div class="bg-card border border-border rounded-xl p-10 flex flex-col items-center justify-center text-center gap-2 text-muted-foreground">
      <UIcon
        name="i-lucide-construction"
        class="h-8 w-8"
      />
      <p class="text-sm">
        {{ t('settings.comingSoon') }}
      </p>
      <slot />
    </div>
  </div>
</template>
