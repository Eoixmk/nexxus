<script setup lang="ts">
import { useStartTaskProcess } from '~/features/tasks/composables/useStartTaskProcess'

const open = defineModel<boolean>('open', { default: false })

const props = defineProps<{
  taskId: number
}>()

const emit = defineEmits<{
  success: []
}>()

const { t } = useI18n()
const { mutateAsync: startProcess, isPending } = useStartTaskProcess()

const comment = ref('')
const images = ref<File[] | null | undefined>(null)

function reset() {
  comment.value = ''
  images.value = null
}

watch(open, (isOpen) => {
  if (!isOpen) {
    reset()
  }
})

async function onConfirm() {
  const files = Array.isArray(images.value)
    ? images.value
    : images.value
      ? [images.value]
      : []

  try {
    await startProcess({
      task: props.taskId,
      comment: comment.value.trim() || undefined,
      images: files.length ? files : undefined,
    })
    open.value = false
    emit('success')
  }
  catch {
    // El toast de error ya se muestra en la mutación.
  }
}
</script>

<template>
  <UModal
    v-model:open="open"
    :title="t('tasks.processStart.modalTitle')"
    :description="t('tasks.processStart.modalDescription')"
    :ui="{
      content: 'sm:max-w-lg',
      footer: 'justify-end',
    }"
  >
    <template #body>
      <div class="space-y-4">
        <UFormField
          :label="`${t('tasks.processStart.comment')} (${t('tasks.processStart.optional')})`"
          name="comment"
        >
          <UTextarea
            v-model="comment"
            :placeholder="t('tasks.processStart.commentPlaceholder')"
            :rows="3"
            class="w-full"
          />
        </UFormField>

        <UFormField
          :label="`${t('tasks.processStart.images')} (${t('tasks.processStart.optional')})`"
          name="images"
        >
          <UFileUpload
            v-model="images"
            multiple
            accept="image/svg+xml,image/png,image/jpeg,.svg,.png,.jpg,.jpeg"
            :label="t('tasks.processStart.dropLabel')"
            :description="t('tasks.processStart.dropDescription')"
            class="w-full min-h-48"
          />
        </UFormField>
      </div>
    </template>

    <template #footer="{ close }">
      <UButton
        :label="t('tasks.form.cancel')"
        color="neutral"
        variant="outline"
        :disabled="isPending"
        @click="close()"
      />
      <UButton
        :label="t('tasks.processStart.confirm')"
        color="primary"
        :loading="isPending"
        :disabled="isPending"
        @click="onConfirm"
      />
    </template>
  </UModal>
</template>
