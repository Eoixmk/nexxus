<script setup lang="ts">
// Protected route: redirects to /login when not authenticated.
definePageMeta({ middleware: 'auth' })

const { t, locale, locales, setLocale } = useI18n()

const availableLocales = computed(() => locales.value)

async function selectLocale(code: string) {
  await setLocale(code as typeof locale.value)
}

useTitle(t('settings.title'))
</script>

<template>
  <div class="p-6 max-w-2xl mx-auto space-y-6">
    <h1 class="text-xl font-bold text-foreground">
      {{ t('settings.title') }}
    </h1>

    <section class="rounded-lg border border-border bg-card p-5">
      <div class="mb-4">
        <h2 class="text-sm font-semibold text-foreground">
          {{ t('settings.language.title') }}
        </h2>
        <p class="text-sm text-muted-foreground">
          {{ t('settings.language.description') }}
        </p>
      </div>

      <div class="space-y-2">
        <button
          v-for="loc in availableLocales"
          :key="loc.code"
          type="button"
          class="w-full flex items-center justify-between px-4 py-2.5 text-sm rounded-md border transition-colors"
          :class="locale === loc.code
            ? 'border-aeto-teal bg-aeto-teal-light text-aeto-teal-dark font-medium'
            : 'border-border text-foreground hover:bg-muted'"
          @click="selectLocale(loc.code)"
        >
          <span>{{ loc.name }}</span>
          <UIcon
            v-if="locale === loc.code"
            name="i-lucide-check"
            class="h-4 w-4"
          />
        </button>
      </div>
    </section>
  </div>
</template>
