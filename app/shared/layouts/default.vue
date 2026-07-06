<script setup lang="ts">
const { user, isLoggedIn, logout } = useAuth()
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <header class="border-b border-default">
      <div class="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <NuxtLink to="/" class="flex items-center gap-2 font-semibold">
          <UIcon name="i-lucide-hexagon" class="size-5 text-primary" />
          Nexxus
        </NuxtLink>

        <div v-if="isLoggedIn" class="flex items-center gap-3">
          <span class="hidden text-sm text-muted sm:inline">{{ user?.username }}</span>
          <UButton
            color="neutral"
            variant="ghost"
            icon="i-lucide-log-out"
            label="Salir"
            @click="logout"
          />
        </div>
      </div>
    </header>

    <main class="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
      <slot />
    </main>
  </div>
</template>
