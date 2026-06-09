<script setup>
import { defineProps, defineEmits } from "vue";

const props = defineProps({
  modelValue: Boolean,
  student: Object,
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
      class="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
    >
      <div class="bg-white w-[332px] rounded-xl p-5 text-center shadow-xl">
        <!-- ICON -->
        <div class="flex justify-center mb-4">
          <img src="/check-circle.png" alt="corcle logo" class="size-[106px]" />
        </div>

        <!-- STUDENT -->
        <div
          class="border border-blue-400 rounded-lg p-[10px] flex items-center gap-3 mb-6"
        >
          <img src="/Avatars.png" class="size-[39px]" alt="" />

          <div class="text-left">
            <div class="font-medium">
              {{ student?.name }}
            </div>

            <div class="text-sm text-gray-500">
              {{ student?.rfid }}
            </div>
          </div>
        </div>

        <!-- TITLE -->
        <h3 class="font-bold text-[18px] mb-1">Berhasil melakukan Absensi</h3>

        <p class="text-sm text-[#6C6E75] mb-6">
          Silahkan melakukan pembelajaran hingga selesai ya!
        </p>
      </div>
    </div>
  </transition>
</template>
