<script setup lang="ts">
import { useCreateTaskMessage } from '~/features/tasks/composables/form/useCreateTaskMessage'
import { useTaskMessages } from '~/features/tasks/composables/form/useTaskMessages'

const props = defineProps<{
  taskId: number
}>()

const { t } = useI18n()
const { user } = useAuth()

const {
  messages,
  isPending,
  isError,
  errorMessage,
} = useTaskMessages(() => props.taskId)

const { mutateAsync: createMessage, isPending: isSending } = useCreateTaskMessage()

const draft = ref('')
const listEl = ref<HTMLElement | null>(null)

const messageCount = computed(() => messages.value.length)

const countLabel = computed(() =>
  t('tasks.messenger.messageCount', { n: messageCount.value }),
)

function isOwnMessage(profileId: number, username: string) {
  const current = user.value
  if (!current) {
    return false
  }
  return current.id === profileId || current.username === username
}

function formatTime(iso: string) {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) {
    return ''
  }
  return date.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
  })
}

async function scrollToBottom() {
  await nextTick()
  if (!listEl.value) {
    return
  }
  listEl.value.scrollTop = listEl.value.scrollHeight
}

async function sendMessage() {
  const content = draft.value.trim()
  if (!content || isSending.value) {
    return
  }

  await createMessage({
    task: props.taskId,
    content,
  })
  draft.value = ''
  await scrollToBottom()
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    void sendMessage()
  }
}

watch(
  messages,
  () => {
    void scrollToBottom()
  },
  { flush: 'post' },
)
</script>

<template>
  <div class="flex h-full min-h-0 flex-col">
    <div class="flex shrink-0 items-center justify-between gap-3 border-b border-border px-4 py-3">
      <h2 class="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {{ t('tasks.messenger.title') }}
      </h2>
      <span class="text-xs text-muted-foreground">
        {{ countLabel }}
      </span>
    </div>

    <div class="flex min-h-0 flex-1 flex-col gap-3 p-4">
      <div
        ref="listEl"
        class="min-h-0 flex-1 overflow-y-auto rounded-lg border border-border bg-card p-3"
      >
        <div
          v-if="isPending"
          class="flex h-full items-center justify-center"
        >
          <UIcon
            name="i-lucide-loader-circle"
            class="h-5 w-5 animate-spin text-muted-foreground"
          />
        </div>

        <UAlert
          v-else-if="isError"
          color="error"
          variant="subtle"
          :title="t('tasks.messenger.loadError')"
          :description="errorMessage"
        />

        <div
          v-else-if="messages.length === 0"
          class="flex h-full items-center justify-center px-4 text-center text-sm text-muted-foreground"
        >
          {{ t('tasks.messenger.empty') }}
        </div>

        <ul
          v-else
          class="flex flex-col gap-2"
        >
          <li
            v-for="message in messages"
            :key="message.id"
            class="flex"
            :class="isOwnMessage(message.profile, message.profile_username) ? 'justify-end' : 'justify-start'"
          >
            <div
              class="max-w-[85%] rounded-2xl px-3 py-2 text-sm"
              :class="isOwnMessage(message.profile, message.profile_username)
                ? 'rounded-br-md border border-aeto-teal bg-aeto-teal-light text-foreground'
                : 'rounded-bl-md border border-border bg-card text-foreground'"
            >
              <p
                v-if="!isOwnMessage(message.profile, message.profile_username)"
                class="mb-0.5 text-[11px] font-semibold text-muted-foreground"
              >
                {{ message.profile_username }}
              </p>
              <p class="whitespace-pre-wrap wrap-break-word">
                {{ message.content }}
              </p>
              <p
                class="mt-1 text-[10px] text-muted-foreground"
                :class="isOwnMessage(message.profile, message.profile_username) ? 'text-right' : ''"
              >
                {{ formatTime(message.created_at) }}
              </p>
            </div>
          </li>
        </ul>
      </div>

      <div class="flex shrink-0 items-end gap-2">
        <UTextarea
          v-model="draft"
          :placeholder="t('tasks.messenger.placeholder')"
          :rows="1"
          autoresize
          :disabled="isSending"
          class="min-w-0 flex-1"
          :ui="{ base: 'max-h-28' }"
          @keydown="onKeydown"
        />
        <UButton
          icon="i-lucide-send"
          color="primary"
          size="md"
          square
          :loading="isSending"
          :disabled="!draft.trim() || isSending"
          :aria-label="t('tasks.messenger.send')"
          @click="sendMessage"
        />
      </div>
    </div>
  </div>
</template>
