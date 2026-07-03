<script setup lang="ts">
/**
 * Reusable, in-tree error boundary.
 *
 * Wraps <NuxtErrorBoundary> so any component/section can fail in isolation
 * WITHOUT taking down the whole app (unlike app/error.vue, which is for fatal
 * errors). Use it around risky UI: data tables, widgets, third-party embeds.
 *
 *   <AppErrorBoundary>
 *     <RiskyWidget />
 *   </AppErrorBoundary>
 *
 * Optionally pass a #fallback slot to fully customize the error UI:
 *   <AppErrorBoundary v-slot:fallback="{ error, clearError }"> ... </AppErrorBoundary>
 */
withDefaults(
  defineProps<{
    /** Short label describing what failed, shown in the default fallback. */
    title?: string
  }>(),
  { title: 'No se pudo cargar esta sección' },
)

// import.meta can't be referenced from a template expression, so expose it here.
const isDev = import.meta.dev

function onError(error: unknown) {
  // Central place to hook logging/telemetry (Sentry, etc.).
  console.error('[AppErrorBoundary]', error)
}
</script>

<template>
  <NuxtErrorBoundary @error="onError">
    <slot />

    <template #error="{ error, clearError }">
      <slot name="fallback" :error="error" :clear-error="clearError">
        <UAlert
          color="error"
          variant="subtle"
          icon="i-lucide-alert-triangle"
          :title="title"
          :description="isDev ? String(error) : undefined"
          :actions="[
            {
              label: 'Reintentar',
              color: 'neutral',
              variant: 'outline',
              onClick: () => clearError(),
            },
          ]"
        />
      </slot>
    </template>
  </NuxtErrorBoundary>
</template>
