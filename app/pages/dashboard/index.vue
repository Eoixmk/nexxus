<script setup lang="ts">
// Protected route: redirects to /login when not authenticated.
definePageMeta({ middleware: 'auth' })

const { t } = useI18n()

useSeoMeta({
  title: () => t('dashboard.title'),
})
</script>

<template>
  <div class="p-6">
    <div
      class="rounded-lg border border-border bg-card p-10 flex flex-col items-center justify-center text-center gap-3"
    >
      <div class="h-12 w-12 rounded-lg flex items-center justify-center bg-aeto-teal-light">
        <UIcon name="i-lucide-layout-dashboard" class="h-6 w-6 text-aeto-teal-dark" />
      </div>
      <h1 class="text-lg font-bold text-foreground">
        {{ t('dashboard.title') }}
      </h1>
      <p class="text-sm text-muted-foreground max-w-md">
        {{ t('dashboard.placeholder') }}
      </p>
    </div>
  </div>
</template>
