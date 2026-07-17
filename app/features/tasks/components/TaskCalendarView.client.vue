<script setup lang="ts">
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import esLocale from '@fullcalendar/core/locales/es'
import type { CalendarApi, CalendarOptions, DatesSetArg, DayHeaderContentArg } from '@fullcalendar/core'
import { useCalendarTasks } from '~/features/tasks/composables/useCalendarTasks'
import type { TaskListFilters } from '~/features/tasks/types/task.types'
import { extractResults } from '~/features/tasks/utils/task-api.util'
import { tasksToCalendarEvents } from '~/features/tasks/utils/task-calendar.util'

const props = defineProps<{
  filters: TaskListFilters
}>()

const now = new Date()
const visibleMonth = ref({
  year: now.getFullYear(),
  month: now.getMonth() + 1,
})

const { tasks } = useCalendarTasks(visibleMonth, () => props.filters)

const calendarRef = ref<{ getApi: () => CalendarApi } | null>(null)

const dayLetters = ['D', 'L', 'M', 'X', 'J', 'V', 'S'] as const

function dayHeaderContent(arg: DayHeaderContentArg) {
  return dayLetters[arg.date.getDay()] ?? ''
}

function setVisibleMonth(date: Date) {
  const next = {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
  }

  if (
    visibleMonth.value.year === next.year
    && visibleMonth.value.month === next.month
  ) {
    return
  }

  visibleMonth.value = next
}

function syncFromDatesSet(arg: DatesSetArg) {
  setVisibleMonth(arg.view.currentStart)
}

function navigateMonth(direction: 'prev' | 'next' | 'today') {
  const api = calendarRef.value?.getApi()
  if (!api) {
    return
  }

  if (direction === 'prev') {
    api.prev()
  }
  else if (direction === 'next') {
    api.next()
  }
  else {
    api.today()
  }

  setVisibleMonth(api.getDate())
}

const calendarOptions = reactive<CalendarOptions>({
  plugins: [dayGridPlugin, interactionPlugin],
  initialView: 'dayGridMonth',
  locale: esLocale,
  weekends: true,
  editable: false,
  selectable: false,
  height: 'auto',
  fixedWeekCount: false,
  dayMaxEvents: true,
  customButtons: {
    prevMonth: {
      icon: 'chevron-left',
      click: () => navigateMonth('prev'),
    },
    nextMonth: {
      icon: 'chevron-right',
      click: () => navigateMonth('next'),
    },
    goToday: {
      text: 'Hoy',
      click: () => navigateMonth('today'),
    },
  },
  headerToolbar: {
    left: 'title',
    center: '',
    right: 'prevMonth,goToday,nextMonth',
  },
  titleFormat: {
    year: 'numeric',
    month: 'long',
  },
  dayHeaderContent,
  dayHeaderFormat: { weekday: 'narrow' },
  events: [],
})

watch(
  () => tasks.data.value,
  (data) => {
    calendarOptions.events = tasksToCalendarEvents(extractResults(data))
  },
  { immediate: true },
)
</script>

<template>
  <div class="px-4 py-4">
    <div class="relative task-calendar overflow-hidden rounded-xl border border-border bg-background">
      <div
        v-if="tasks.isPending.value"
        class="absolute inset-0 z-10 flex items-center justify-center bg-background/60"
      >
        <UIcon
          name="i-lucide-loader-circle"
          class="h-6 w-6 animate-spin text-muted-foreground"
        />
      </div>

      <p
        v-else-if="tasks.isError.value"
        class="px-4 py-6 text-sm text-error"
      >
        No se pudieron cargar las tareas del calendario.
      </p>

      <FullCalendar
        ref="calendarRef"
        :options="calendarOptions"
        @dates-set="syncFromDatesSet"
      />
    </div>
  </div>
</template>

<style scoped>
.task-calendar :deep(.fc) {
  --fc-border-color: var(--border);
  --fc-page-bg-color: var(--background);
  --fc-neutral-bg-color: color-mix(in oklab, var(--muted) 80%, transparent);
  --fc-today-bg-color: transparent;
  --fc-list-event-hover-bg-color: var(--muted);
  --fc-highlight-color: color-mix(in oklab, var(--aeto-teal) 12%, transparent);
  --fc-button-bg-color: transparent;
  --fc-button-border-color: transparent;
  --fc-button-text-color: var(--muted-foreground);
  --fc-button-hover-bg-color: var(--muted);
  --fc-button-hover-border-color: transparent;
  --fc-button-active-bg-color: var(--muted);
  --fc-button-active-border-color: transparent;
  font-family: inherit;
  color: var(--foreground);
}

.task-calendar :deep(.fc .fc-toolbar) {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin: 0;
  padding: 0.875rem 1rem;
  border-bottom: 1px solid var(--border);
}

.task-calendar :deep(.fc .fc-toolbar-chunk) {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.task-calendar :deep(.fc .fc-toolbar-title) {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  letter-spacing: -0.01em;
  color: var(--foreground);
  text-transform: capitalize;
}

.task-calendar :deep(.fc .fc-button) {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 1.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: 0.375rem;
  box-shadow: none !important;
  font-size: 0.8125rem;
  font-weight: 500;
  text-transform: none;
}

.task-calendar :deep(.fc .fc-button-primary:not(:disabled).fc-button-active),
.task-calendar :deep(.fc .fc-button-primary:not(:disabled):active) {
  background: var(--muted);
  border-color: transparent;
  color: var(--foreground);
}

.task-calendar :deep(.fc .fc-prevMonth-button),
.task-calendar :deep(.fc .fc-nextMonth-button) {
  width: 1.75rem;
  padding-inline: 0;
  color: var(--muted-foreground);
}

.task-calendar :deep(.fc .fc-goToday-button) {
  color: var(--muted-foreground);
}

.task-calendar :deep(.fc .fc-goToday-button:disabled) {
  opacity: 0.45;
}

.task-calendar :deep(.fc .fc-scrollgrid),
.task-calendar :deep(.fc .fc-scrollgrid table),
.task-calendar :deep(.fc .fc-scrollgrid td),
.task-calendar :deep(.fc .fc-scrollgrid th) {
  border-color: var(--border) !important;
}

.task-calendar :deep(.fc .fc-scrollgrid) {
  border-left: 0;
  border-right: 0;
  border-bottom: 0;
}

.task-calendar :deep(.fc .fc-col-header-cell) {
  background: transparent;
  border-bottom-color: var(--border);
  padding: 0.5rem 0.5rem 0.375rem;
}

.task-calendar :deep(.fc .fc-col-header-cell-cushion) {
  display: block;
  padding: 0;
  font-size: 0.6875rem;
  font-weight: 500;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--muted-foreground);
  text-align: left;
}

.task-calendar :deep(.fc .fc-daygrid-day) {
  background: var(--background);
  min-height: 7.5rem;
}

.task-calendar :deep(.fc .fc-daygrid-day-frame) {
  min-height: 7.5rem;
  padding: 0.35rem 0.35rem 0.5rem;
}

.task-calendar :deep(.fc .fc-daygrid-day-top) {
  flex-direction: row;
  justify-content: flex-start;
}

.task-calendar :deep(.fc .fc-daygrid-day-number) {
  padding: 0.15rem 0.35rem;
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--muted-foreground);
}

.task-calendar :deep(.fc .fc-day-other) {
  background: color-mix(in oklab, var(--muted) 70%, var(--background));
}

.task-calendar :deep(.fc .fc-day-other .fc-daygrid-day-number) {
  color: color-mix(in oklab, var(--muted-foreground) 55%, transparent);
}

.task-calendar :deep(.fc .fc-day-today .fc-daygrid-day-number) {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 1.5rem;
  height: 1.5rem;
  border-radius: 9999px;
  background: #7c3aed;
  color: #fff;
  font-weight: 600;
}

.task-calendar :deep(.fc .fc-daygrid-event) {
  margin-block: 0.15rem;
  border: 0;
  border-left: 3px solid var(--fc-event-border-color);
  border-radius: 0.375rem;
  background: var(--fc-event-bg-color);
  box-shadow: none;
}

.task-calendar :deep(.fc .fc-daygrid-event .fc-event-main) {
  color: var(--fc-event-text-color);
}

.task-calendar :deep(.fc .fc-daygrid-block-event .fc-event-title) {
  padding: 0.2rem 0.4rem;
  font-size: 0.6875rem;
  font-weight: 600;
  line-height: 1.25;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.task-calendar :deep(.fc .fc-daygrid-day-events) {
  margin-top: 0.15rem;
}

.task-calendar :deep(.fc .fc-more-link) {
  color: var(--muted-foreground);
  font-size: 0.6875rem;
  font-weight: 500;
}
</style>
