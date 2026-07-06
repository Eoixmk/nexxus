<script setup lang="ts">
defineOptions({ inheritAttrs: false })

const attrs = useAttrs()
const colorMode = useColorMode()

const isDark = computed({
  get() {
    return colorMode.value === 'dark'
  },
  set(_isDark) {
    colorMode.preference = _isDark ? 'dark' : 'light'
  },
})

interface Props {
  collapsed?: boolean
}

withDefaults(defineProps<Props>(), {
  collapsed: false,
})
</script>

<template>
  <ClientOnly>
    <template #fallback>
      <USkeleton
        :class="[
          'rounded-lg h-6',
          { 'w-[140px]': !collapsed, 'w-8': collapsed },
        ]"
      />
    </template>

    <div
      v-bind="attrs"
      class="flex items-center gap-3"
    >
      <svg
        id="nexxus-mark"
        xmlns="http://www.w3.org/2000/svg"
        version="1.1"
        viewBox="0 0 720 579"
        class="h-10 w-auto shrink-0"
        aria-hidden="true"
      >
        <g>
          <path
            :class="{ st0_dark: isDark, st0_light: !isDark }"
            d="M268.53,102.99l161.87,229.58h110.42L351.08,65.33s-.04-.05-.06-.08l30.89-30.11c-44.15,9.04-84.24,32.84-113.38,67.85Z"
          />
          <path
            :class="{ st0_dark: isDark, st0_light: !isDark }"
            d="M495.66,476.85l-161.17-228.59h-110.42l189.73,267.25s.04.05.06.07l-28.5,27.78c42.86-9.32,81.74-32.59,110.29-66.51Z"
          />
          <polygon
            :class="{ st1_dark: isDark, st1_light: !isDark }"
            points="540.81 361.13 449.01 361.13 513.63 452.79 578.99 361.13 540.81 361.13"
          />
          <polygon
            :class="{ st1_dark: isDark, st1_light: !isDark }"
            points="315.88 219.7 250.61 127.13 184.59 219.7 224.07 219.7 315.88 219.7"
          />
          <polygon
            :class="{ st1_dark: isDark, st1_light: !isDark }"
            points="200.79 264.79 176.66 230.81 110.1 324.15 269.79 530.31 283.44 547.93 339.76 547.93 358.87 529.31 376.43 512.19 200.79 264.79"
          />
          <polygon
            :class="{ st1_dark: isDark, st1_light: !isDark }"
            points="495.09 49.38 480.91 31.07 427 31.07 406.02 51.52 388.45 68.64 564.1 316.05 587.57 349.11 654.53 255.21 495.09 49.38"
          />
          <polygon
            :class="{ st0_dark: isDark, st0_light: !isDark }"
            points="665.44 93.97 665.13 94.21 625.6 43.18 616.53 31.62 517.67 31.9 671.84 230.94 719.96 163.47 665.44 93.97"
          />
          <polygon
            :class="{ st0_dark: isDark, st0_light: !isDark }"
            points="92.79 348.43 44.89 415.59 99.73 485.5 99.76 485.48 103.46 490.26 148.69 547.93 200.7 547.93 247.22 547.8 92.79 348.43"
          />
        </g>
      </svg>

      <span
        v-if="!collapsed"
        class="text-2xl font-semibold tracking-tight"
        :class="isDark ? 'text-white' : 'text-neutral-900'"
      >
        Nexxus
      </span>
    </div>
  </ClientOnly>
</template>

<style scoped>
.st0_dark {
  fill: #fff;
}

.st1_dark {
  fill: #28ceab;
}

.st0_light {
  fill: #1c1c1c;
}

.st1_light {
  fill: #28ceab;
}
</style>
