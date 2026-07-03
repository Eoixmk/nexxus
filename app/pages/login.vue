<script setup lang="ts">
import * as v from 'valibot'
import type { FormSubmitEvent } from '@nuxt/ui'

definePageMeta({ layout: 'auth' })

const { login, isLoggedIn } = useAuth()
const route = useRoute()
const toast = useToast()

// If already logged in, don't show the login form.
if (isLoggedIn.value) {
  await navigateTo('/')
}

const schema = v.object({
  email: v.pipe(v.string(), v.email('Correo inválido')),
  password: v.pipe(v.string(), v.minLength(6, 'Mínimo 6 caracteres')),
})
type Schema = v.InferOutput<typeof schema>

const state = reactive({
  email: '',
  password: '',
})

const loading = ref(false)

async function onSubmit(event: FormSubmitEvent<Schema>) {
  loading.value = true
  try {
    await login(event.data.email, event.data.password)
    toast.add({ title: 'Bienvenido', color: 'success' })
    // Send the user back to where they were headed, or home.
    const redirect = (route.query.redirect as string) || '/'
    await navigateTo(redirect)
  } catch (err) {
    toast.add({
      title: 'No se pudo iniciar sesión',
      description: err instanceof Error ? err.message : 'Verifica tus credenciales',
      color: 'error',
    })
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <UCard class="w-full max-w-sm">
    <template #header>
      <div class="flex flex-col items-center gap-2 text-center">
        <UIcon name="i-lucide-hexagon" class="size-8 text-primary" />
        <h1 class="text-lg font-semibold">Iniciar sesión</h1>
        <p class="text-sm text-muted">Ingresa tus credenciales para continuar</p>
      </div>
    </template>

    <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
      <UFormField label="Correo" name="email">
        <UInput
          v-model="state.email"
          type="email"
          placeholder="tu@correo.com"
          icon="i-lucide-mail"
          autocomplete="email"
          class="w-full"
        />
      </UFormField>

      <UFormField label="Contraseña" name="password">
        <UInput
          v-model="state.password"
          type="password"
          placeholder="••••••••"
          icon="i-lucide-lock"
          autocomplete="current-password"
          class="w-full"
        />
      </UFormField>

      <UButton
        type="submit"
        color="primary"
        block
        :loading="loading"
        label="Entrar"
      />
    </UForm>
  </UCard>
</template>
