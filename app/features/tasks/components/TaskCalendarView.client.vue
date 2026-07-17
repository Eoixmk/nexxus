<script setup lang="ts">
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import esLocale from '@fullcalendar/core/locales/es'

const calendarOptions = {
  plugins: [dayGridPlugin, interactionPlugin],
  initialView: 'dayGridMonth',
  locale: esLocale,
  weekends: true,
  editable: false,
  selectable: true,
  height: 'auto',
  headerToolbar: {
    left: 'prev,next today',
    center: 'title',
    right: 'dayGridMonth',
  },
  buttonText: {
    today: 'Hoy',
    month: 'Mes',
  },
  events: [
    {
      id: 'todo-1',
      title: 'Revisar pendientes del sprint',
      start: new Date().toISOString().slice(0, 10),
    },
    {
      id: 'todo-2',
      title: 'Preparar propuesta para cliente',
      start: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    },
  ],
}
</script>

<template>
  <div class="px-4 py-4">
    <div class="rounded-xl border border-border bg-card p-4 shadow-sm">
      <FullCalendar :options="calendarOptions" />
    </div>
  </div>
</template>
