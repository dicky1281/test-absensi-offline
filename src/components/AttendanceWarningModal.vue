<script setup>
import { defineProps, defineEmits } from "vue";

const props = defineProps({
  modelValue: Boolean,
});

const emit = defineEmits(["update:modelValue"]);

function close() {
  emit("update:modelValue", false);
}
</script>

<template>
  <transition
    enter-active-class="transition duration-300"
    enter-from-class="opacity-0 scale-90"
    enter-to-class="opacity-100 scale-100"
    leave-active-class="transition duration-200"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="modelValue"
      class="fixed inset-0 flex items-center justify-center bg-black/40 z-50"
    >
      <div class="bg-white w-[420px] rounded-xl p-8 text-center shadow-xl">
        <!-- ICON -->
        <div class="flex justify-center mb-6">
          <div
            class="w-[80px] h-[80px] rounded-full bg-yellow-500 flex items-center justify-center text-white text-4xl"
          >
            i
          </div>
        </div>

        <!-- TITLE -->
        <h3 class="font-semibold text-lg mb-2">Anda Sudah Melakukan Absensi</h3>

        <p class="text-sm text-gray-500">
          Kehadiran Anda untuk hari ini sudah tercatat sebelumnya.
        </p>
      </div>
    </div>
  </transition>
</template>
