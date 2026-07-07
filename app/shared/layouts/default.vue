<template>
  <div class="h-screen flex overflow-hidden bg-background text-foreground">
    <AppSidebar />

    <div class="flex-1 flex flex-col min-w-0">
      <AppToolbar />
      <main class="flex-1 overflow-y-auto">
        <slot />
      </main>
    </div>
  </div>
</template>
