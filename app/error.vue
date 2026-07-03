<script setup lang="ts">
import type { NuxtError } from '#app'

// Global error page. Nuxt renders this OUTSIDE of <NuxtPage>, so it catches
// fatal errors from any page/plugin/middleware, plus unmatched routes (404).
const props = defineProps<{
  error: NuxtError
}>()

const isDev = import.meta.dev

const is404 = computed(() => props.error?.statusCode === 404)

const title = computed(() => {
  if (is404.value) return 'Página no encontrada'
  return 'Algo salió mal'
})

const description = computed(() => {
  if (is404.value) return 'La página que buscas no existe o fue movida.'
  return props.error?.message || 'Ocurrió un error inesperado. Intenta de nuevo.'
})

// clearError resets Nuxt's error state and (optionally) navigates away.
function handleReset() {
  clearError({ redirect: '/' })
}
</script>

<template>
  <UApp>
    <div class="min-h-screen flex items-center justify-center p-4">
      <UCard class="w-full max-w-md text-center">
        <div class="flex flex-col items-center gap-4 py-6">
          <UIcon
            :name="is404 ? 'i-lucide-map-pin-off' : 'i-lucide-alert-triangle'"
            class="size-12 text-primary"
          />

          <div class="space-y-1">
            <p class="text-5xl font-bold tabular-nums">
              {{ error?.statusCode || 500 }}
            </p>
            <h1 class="text-xl font-semibold">
              {{ title }}
            </h1>
            <p class="text-sm text-muted">
              {{ description }}
            </p>
          </div>

          <div class="flex gap-2">
            <UButton
              color="primary"
              icon="i-lucide-home"
              label="Ir al inicio"
              @click="handleReset"
            />
            <UButton
              color="neutral"
              variant="subtle"
              icon="i-lucide-rotate-cw"
              label="Reintentar"
              @click="() => clearError()"
            />
          </div>

          <!-- Stack trace only in dev, never leak internals in prod. -->
          <pre
            v-if="isDev && error?.stack"
            class="mt-4 max-h-48 w-full overflow-auto rounded bg-muted p-3 text-left text-xs text-toned"
          >{{ error.stack }}</pre>
        </div>
      </UCard>
    </div>
  </UApp>
</template>
