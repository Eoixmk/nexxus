<script setup lang="ts">
// Protected route: redirects to /login when not authenticated.
// Landing/Hub tras el login: selector de módulos.
definePageMeta({ middleware: 'auth', layout: false })

const { t } = useI18n()
const { logout } = useAuth()
const colorMode = useColorMode()

const isDark = computed(() => colorMode.value === 'dark')

function toggleTheme() {
  colorMode.preference = isDark.value ? 'light' : 'dark'
}

useSeoMeta({
  title: () => t('hub.title'),
})
</script>

<template>
  <div class="min-h-screen flex flex-col bg-background text-foreground">
    <header class="h-16 shrink-0 flex items-center justify-between px-6 border-b border-border">
      <NexxusLogo class="h-9" />

      <div class="flex items-center gap-2">
        <ClientOnly>
          <button
            type="button"
            :aria-label="t('toolbar.toggleTheme')"
            class="h-9 w-9 inline-flex items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition"
            @click="toggleTheme"
          >
            <UIcon :name="isDark ? 'i-lucide-sun' : 'i-lucide-moon'" class="h-4 w-4" />
          </button>
          <template #fallback>
            <div class="h-9 w-9" />
          </template>
        </ClientOnly>

        <button
          type="button"
          :aria-label="t('common.logout')"
          class="h-9 w-9 inline-flex items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition"
          @click="logout"
        >
          <UIcon name="i-lucide-log-out" class="h-4 w-4" />
        </button>
      </div>
    </header>

    <main class="flex-1 flex flex-col items-center justify-center px-6">
      <div class="text-center mb-8">
        <h1 class="text-2xl font-bold text-foreground">
          {{ t('hub.title') }}
        </h1>
        <p class="text-sm text-muted-foreground mt-1">
          {{ t('hub.subtitle') }}
        </p>
      </div>

      <div class="grid gap-4 sm:grid-cols-2 w-full max-w-2xl">
        <NuxtLink
          to="/tasks"
          class="group rounded-xl border border-border bg-card p-6 flex flex-col gap-4 transition-all hover:border-aeto-teal hover:shadow-lg"
        >
          <div class="flex items-center justify-between">
            <div class="h-12 w-12 rounded-lg flex items-center justify-center bg-aeto-teal-light">
              <UIcon name="i-lucide-square-check-big" class="h-6 w-6 text-aeto-teal-dark" />
            </div>
            <UIcon
              name="i-lucide-arrow-right"
              class="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-aeto-teal"
            />
          </div>
          <div>
            <h2 class="text-base font-bold text-foreground">
              Nexxus Tasks
            </h2>
            <p class="text-sm text-muted-foreground mt-1">
              {{ t('hub.tasksDescription') }}
            </p>
          </div>
        </NuxtLink>
      </div>
    </main>
  </div>
</template>
