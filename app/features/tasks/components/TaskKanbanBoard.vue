<script setup lang="ts">
import type { KanbanColumn, KanbanTaskMove } from '~/features/tasks/types/task.types'
import TaskKanbanColumn from '~/features/tasks/components/TaskKanbanColumn.vue'

const props = defineProps<{
  columns: KanbanColumn[]
  selectedTaskId?: number | null
  loading?: boolean
  error?: boolean
}>()

const emit = defineEmits<{
  select: [taskId: number]
  /** Emitido al soltar; listo para cablear la API de movimiento. */
  move: [payload: KanbanTaskMove]
}>()

const { t } = useI18n()
const { localColumns, moveTask } = useKanbanBoardState(() => props.columns)

const draggingTaskId = ref<number | null>(null)
const dropTargetId = ref<string | number | null>(null)

function onDragStart(payload: { taskId: number, columnId: string | number }) {
  draggingTaskId.value = payload.taskId
}

function onDragEnd() {
  draggingTaskId.value = null
  dropTargetId.value = null
}

function onDragOverColumn(columnId: string | number) {
  dropTargetId.value = columnId
}

function onDropTask(payload: KanbanTaskMove) {
  const moved = moveTask(payload)
  draggingTaskId.value = null
  dropTargetId.value = null

  if (moved) {
    // TODO: llamar al endpoint de movimiento cuando esté disponible.
    emit('move', payload)
  }
}
</script>

<template>
  <div class="px-4 py-4 overflow-x-auto">
    <div v-if="loading && !localColumns.length" class="flex items-start gap-3">
      <USkeleton v-for="n in 3" :key="n" class="h-64 w-72 shrink-0 rounded-xl" />
    </div>

    <p v-else-if="error" class="px-2 py-6 text-sm text-error">
      {{ t('tasks.loadError') }}
    </p>

    <p v-else-if="!localColumns.length" class="px-2 py-6 text-sm text-muted-foreground">
      {{ t('tasks.empty') }}
    </p>

    <div v-else class="flex items-start gap-3 min-w-max">
      <TaskKanbanColumn
        v-for="column in localColumns"
        :key="column.id"
        :column="column"
        :selected-task-id="selectedTaskId"
        :dragging-task-id="draggingTaskId"
        :drop-target-id="dropTargetId"
        @select="emit('select', $event)"
        @drag-start="onDragStart"
        @drag-end="onDragEnd"
        @drag-over-column="onDragOverColumn"
        @drop-task="onDropTask"
      />
    </div>
  </div>
</template>
