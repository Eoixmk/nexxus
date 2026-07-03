<script setup lang="ts">
// Protected route: redirects to /login when not authenticated.
definePageMeta({ middleware: 'auth' })

const { user } = useAuth()

const stats = [
  { label: 'Proyectos', value: 12, icon: 'i-lucide-folder' },
  { label: 'Tareas', value: 34, icon: 'i-lucide-check-circle' },
  { label: 'Mensajes', value: 5, icon: 'i-lucide-mail' },
]
</script>

<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-bold">
        Hola, {{ user?.name || 'bienvenido' }} 👋
      </h1>
      <p class="text-muted">Este es tu panel principal.</p>
    </div>

    <div class="grid gap-4 sm:grid-cols-3">
      <UCard v-for="stat in stats" :key="stat.label">
        <div class="flex items-center gap-3">
          <UIcon :name="stat.icon" class="size-8 text-primary" />
          <div>
            <p class="text-2xl font-semibold tabular-nums">{{ stat.value }}</p>
            <p class="text-sm text-muted">{{ stat.label }}</p>
          </div>
        </div>
      </UCard>
    </div>

    <!-- Example of isolating a risky section behind the boundary. -->
    <AppErrorBoundary title="No se pudo cargar la actividad reciente">
      <UCard>
        <template #header>
          <h2 class="font-semibold">Actividad reciente</h2>
        </template>
        <p class="text-sm text-muted">Aún no hay actividad para mostrar.</p>
      </UCard>
    </AppErrorBoundary>
  </div>
</template>
