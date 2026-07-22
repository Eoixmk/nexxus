<script setup lang="ts">
import type { CloseTaskProcessStatus } from '~/features/tasks/types/task.types'
import { useCloseTaskProcess } from '~/features/tasks/composables/form/useCloseTaskProcess'

const open = defineModel<boolean>('open', { default: false })

const props = defineProps<{
  taskId: number
  targetStatus: CloseTaskProcessStatus
}>()

const emit = defineEmits<{
  success: []
}>()

const { t } = useI18n()
const { mutateAsync: closeProcess, isPending } = useCloseTaskProcess()

const comment = ref('')
// TODO: reactivar cuando Cloudinary esté listo
// const images = ref<File[] | null | undefined>(null)

const modalTitle = computed(() =>
  props.targetStatus === 'complete'
    ? t('tasks.processClose.modalTitleComplete')
    : t('tasks.processClose.modalTitleInReview'),
)

const confirmLabel = computed(() =>
  props.targetStatus === 'complete'
    ? t('tasks.processClose.confirmComplete')
    : t('tasks.processClose.confirmInReview'),
)

function reset() {
  comment.value = ''
  // images.value = null
}

watch(open, (isOpen) => {
  if (!isOpen) {
    reset()
  }
})

async function onConfirm() {
  // TODO: reactivar imágenes cuando Cloudinary esté listo
  // const files = Array.isArray(images.value)
  //   ? images.value
  //   : images.value
  //     ? [images.value]
  //     : []

  try {
    await closeProcess({
      task: props.taskId,
      status: props.targetStatus,
      comment: comment.value.trim() || undefined,
      // images: files.length ? files : undefined,
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
    :title="modalTitle"
    :description="t('tasks.processClose.modalDescription')"
    :ui="{
      content: 'sm:max-w-lg',
      footer: 'justify-end',
    }"
  >
    <template #body>
      <div class="space-y-4">
        <UFormField
          :label="`${t('tasks.processClose.comment')} (${t('tasks.processClose.optional')})`"
          name="comment"
        >
          <UTextarea
            v-model="comment"
            :placeholder="t('tasks.processClose.commentPlaceholder')"
            :rows="3"
            class="w-full"
          />
        </UFormField>

        <!-- TODO: reactivar cuando Cloudinary esté listo
        <UFormField
          :label="`${t('tasks.processClose.images')} (${t('tasks.processClose.optional')})`"
          name="images"
        >
          <UFileUpload
            v-model="images"
            multiple
            accept="image/svg+xml,image/png,image/jpeg,.svg,.png,.jpg,.jpeg"
            :label="t('tasks.processClose.dropLabel')"
            :description="t('tasks.processClose.dropDescription')"
            class="w-full min-h-48"
          />
        </UFormField>
        -->
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
        :label="confirmLabel"
        color="primary"
        :loading="isPending"
        :disabled="isPending"
        @click="onConfirm"
      />
    </template>
  </UModal>
</template>
