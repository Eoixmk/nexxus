<script setup lang="ts">
import type { Task } from '~/features/tasks/types/task.types'

const props = withDefaults(
  defineProps<{
    task: Task
    columnId: string | number
    selected?: boolean
    dragging?: boolean
  }>(),
  {
    selected: false,
    dragging: false,
  },
)

const emit = defineEmits<{
  select: [taskId: number]
  dragStart: [payload: { taskId: number, columnId: string | number }]
  dragEnd: []
}>()

const { t, locale } = useI18n()

const typeMeta = computed(() => taskTypeMeta(props.task.type))
const priorityMeta = computed(() => taskPriorityMeta(props.task.priority))
const barColor = computed(() => taskBarColor(props.task))
const requiresAttention = computed(() => taskRequiresAttention(props.task))

const dueDiff = computed(() => diffInDays(props.task.limit_date))
const isOverdue = computed(() => dueDiff.value !== null && dueDiff.value < 0)

const dueLabel = computed(() => {
  const diff = dueDiff.value
  if (diff === null) {
    return ''
  }
  if (diff === 0) {
    return t('tasks.due.today')
  }
  if (diff === 1) {
    return t('tasks.due.tomorrow')
  }
  if (diff === -1) {
    return t('tasks.due.yesterday')
  }
  if (diff > 1 && diff <= 30) {
    return t('tasks.due.inDays', { n: diff })
  }
  return formatShortDate(props.task.limit_date, locale.value)
})

const didDrag = ref(false)

function onSelect() {
  if (didDrag.value) {
    didDrag.value = false
    return
  }
  emit('select', props.task.id)
}

function onDragStart(event: DragEvent) {
  didDrag.value = true
  if (!event.dataTransfer) {
    return
  }
  event.dataTransfer.setData('application/x-nexxus-task', String(props.task.id))
  event.dataTransfer.setData('application/x-nexxus-from-column', String(props.columnId))
  event.dataTransfer.effectAllowed = 'move'
  emit('dragStart', { taskId: props.task.id, columnId: props.columnId })
}

function onDragEnd() {
  emit('dragEnd')
}
</script>

<template>
  <div
    draggable="true"
    class="cursor-grab active:cursor-grabbing"
    :class="dragging ? 'opacity-40' : ''"
    @dragstart="onDragStart"
    @dragend="onDragEnd"
  >
    <button
      type="button"
      class="w-full text-left rounded-lg border border-border bg-card p-3 shadow-sm hover:bg-muted/40 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
      :class="selected ? 'ring-2 ring-aeto-teal/50' : ''"
      @click="onSelect"
    >
      <div class="flex items-start gap-2">
        <span
          class="mt-0.5 h-8 w-1 shrink-0 rounded-full"
          :style="{ backgroundColor: barColor }"
        />
        <div class="min-w-0 flex-1 space-y-2">
          <p class="text-sm font-medium text-foreground leading-snug line-clamp-2">
            {{ task.short_description }}
          </p>

          <div class="flex flex-wrap items-center gap-1.5">
            <UBadge
              :icon="typeMeta.icon"
              :label="t(typeMeta.labelKey)"
              color="neutral"
              variant="soft"
              size="sm"
            />
            <UBadge
              v-if="priorityMeta"
              :label="t(priorityMeta.labelKey)"
              :color="priorityMeta.color"
              variant="soft"
              size="sm"
            />
            <UBadge
              v-if="requiresAttention"
              icon="i-lucide-triangle-alert"
              :label="t('tasks.requiresAttention')"
              color="error"
              variant="soft"
              size="sm"
            />
          </div>

          <p
            v-if="dueLabel"
            class="text-xs"
            :class="isOverdue ? 'text-error font-medium' : 'text-muted-foreground'"
          >
            {{ dueLabel }}
          </p>
        </div>
      </div>
    </button>
  </div>
</template>
