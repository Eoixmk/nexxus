<script setup lang="ts">
import type { ReviewDecisionStatus } from '~/features/tasks/types/task.types'
import { useCloseTaskProcess } from '~/features/tasks/composables/form/useCloseTaskProcess'
import { useRejectTaskProcess } from '~/features/tasks/composables/form/useRejectTaskProcess'

const open = defineModel<boolean>('open', { default: false })

const props = defineProps<{
  taskId: number
  targetStatus: ReviewDecisionStatus
}>()

const emit = defineEmits<{
  success: []
}>()

const { t } = useI18n()
const { mutateAsync: closeProcess, isPending: isClosePending } = useCloseTaskProcess()
const { mutateAsync: rejectProcess, isPending: isRejectPending } = useRejectTaskProcess()

const comment = ref('')
// TODO: reactivar cuando Cloudinary esté listo
// const images = ref<File[] | null | undefined>(null)

const isPending = computed(() => isClosePending.value || isRejectPending.value)

const modalTitle = computed(() =>
  props.targetStatus === 'rejected'
    ? t('tasks.processReview.modalTitleRejected')
    : t('tasks.processReview.modalTitleComplete'),
)

const confirmLabel = computed(() =>
  props.targetStatus === 'rejected'
    ? t('tasks.processReview.confirmRejected')
    : t('tasks.processReview.confirmComplete'),
)

const confirmColor = computed(() =>
  props.targetStatus === 'rejected' ? 'error' : 'primary',
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
  const trimmedComment = comment.value.trim() || undefined

  try {
    if (props.targetStatus === 'rejected') {
      await rejectProcess({
        task: props.taskId,
        comment: trimmedComment,
      })
    }
    else {
      await closeProcess({
        task: props.taskId,
        status: 'complete',
        comment: trimmedComment,
      })
    }
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
    :description="t('tasks.processReview.modalDescription')"
    :ui="{
      content: 'sm:max-w-lg',
      footer: 'justify-end',
    }"
  >
    <template #body>
      <div class="space-y-4">
        <UFormField
          :label="`${t('tasks.processReview.comment')} (${t('tasks.processReview.optional')})`"
          name="comment"
        >
          <UTextarea
            v-model="comment"
            :placeholder="t('tasks.processReview.commentPlaceholder')"
            :rows="3"
            class="w-full"
          />
        </UFormField>

        <!-- TODO: reactivar cuando Cloudinary esté listo
        <UFormField
          :label="`${t('tasks.processReview.images')} (${t('tasks.processReview.optional')})`"
          name="images"
        >
          <UFileUpload
            v-model="images"
            multiple
            accept="image/svg+xml,image/png,image/jpeg,.svg,.png,.jpg,.jpeg"
            :label="t('tasks.processReview.dropLabel')"
            :description="t('tasks.processReview.dropDescription')"
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
        :color="confirmColor"
        :loading="isPending"
        :disabled="isPending"
        @click="onConfirm"
      />
    </template>
  </UModal>
</template>
