<template>
  <div class="relative">
    <label
      class="text-s font-bold font-sans mb-1.5"
      :class="{
        'text-danger': error,
        'text-netral-800': !error,
      }"
    >
      {{ label }}<span v-if="isRequired" class="text-danger">*</span>
    </label>

    <div class="relative">
      <!-- Icon Slot -->
      <div
        v-if="$slots.icon"
        class="absolute right-0 top-1/2 -translate-y-1/2 pr-1 flex items-center"
      >
        <slot name="icon" />
      </div>

      <input
        :type="typeInput"
        :placeholder="placeholder"
        :required="isRequired"
        v-model="model"
        :class="{
          'border-danger': error,
          'border-netral-200': !error,
          'pr-8': $slots.icon,
        }"
        class="block w-full border-0 border-b text-m bg-transparent focus:border-primary focus:ring-0 transition-colors duration-200 outline-none py-1.5 text-base text-netral-800 placeholder-netral-400"
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
      />
    </div>

    <p v-if="error" class="text-danger text-xs mt-1.5">{{ error }}</p>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: "",
  },
  label: {
    type: String,
    default: "this is label",
  },
  isRequired: {
    type: Boolean,
    default: false,
  },
  placeholder: {
    type: String,
    default: "type this",
  },
  typeInput: {
    type: String,
    default: "text",
  },
  error: {
    type: String,
    default: "",
  },
  numbersOnly: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:modelValue", "focus", "blur"]);

const model = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});

// === INPUT HANDLER ===
function handleInput(e) {
  if (!props.numbersOnly) return;

  const clean = e.target.value.replace(/\D/g, "");
  model.value = clean;
}

// === FOCUS HANDLER ===
function handleFocus(event) {
  emit("focus", event);
}

// === BLUR HANDLER ===
function handleBlur(event) {
  emit("blur", event);
}
</script>
