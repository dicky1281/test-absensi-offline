<script setup>
import { ref, onMounted } from "vue";
import { db } from "../db/database";

const attendance = ref([]);
const total = ref(0);

const currentDate = new Date().toLocaleDateString("id-ID", {
  weekday: "long",
  day: "2-digit",
  month: "long",
  year: "numeric",
});

async function loadData() {
  const rows = await db.attendance.toArray();

  const result = [];

  for (const item of rows) {
    const student = await db.students.get(item.student_id);

    result.push({
      ...item,
      name: student?.name,
      kelas: student?.kelas,
    });
  }

  attendance.value = result;
  total.value = result.length;
}

onMounted(() => {
  loadData();
});
</script>

<template>
  <div class="min-h-screen bg-white flex flex-col">
    <!-- HEADER -->
    <div
      class="bg-white h-[72px] max-w-screen-xl mx-auto w-full flex items-center justify-between"
    >
      <img
        @click="$router.push('/')"
        src="/AyoSiswaPrimary.png"
        class="h-[30px]"
      />

      <h2 class="font-semibold text-gray-700">SMA Negeri 1 Rancaekek</h2>

      <div class="text-sm text-gray-600">
        {{ currentDate }}
      </div>
    </div>

    <!-- BLUE BACKGROUND -->
    <div class="bg-gradient-to-r from-blue-600 to-blue-500 h-[180px]" />

    <!-- CONTENT -->
    <div class="-mt-28 flex justify-center px-6">
      <div
        class="bg-white rounded-2xl shadow-md w-full max-w-screen-xl p-6 border border-[#F0F0F0]"
      >
        <!-- TITLE -->
        <div class="flex items-center gap-2 mb-4 text-gray-700">
          <span class="text-lg font-semibold"> Riwayat Kehadiran </span>
        </div>

        <!-- TABLE -->
        <div class="overflow-hidden rounded-lg border border-[#F0F0F0]">
          <table class="w-full text-sm">
            <thead class="bg-blue-600 text-white">
              <tr>
                <th class="py-3 px-4 text-left">No</th>
                <th class="text-left">Nama</th>
                <th class="text-left">Kelas</th>
                <th class="text-left">Jam Clock-in</th>
                <th class="text-left">Jam Clock-out</th>
              </tr>
            </thead>

            <tbody>
              <tr
                v-for="(item, i) in attendance"
                :key="item.id"
                class="odd:bg-gray-50"
              >
                <td class="py-3 px-4 text-gray-600">
                  {{ i + 1 }}
                </td>

                <td class="text-gray-700">
                  {{ item.name }}
                </td>

                <td class="text-gray-600">
                  {{ item.kelas }}
                </td>

                <td class="text-gray-600">
                  {{ item.checkin || "-" }}
                </td>

                <td class="text-gray-600">
                  {{ item.checkout || "-" }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- FOOTER -->
        <div
          class="flex justify-between items-center mt-4 text-sm text-gray-600"
        >
          <div>Total {{ total }}</div>

          <div class="flex items-center gap-2">
            <span>Tampilan</span>

            <select class="border rounded px-2 py-1 text-sm">
              <option>9</option>
            </select>

            <button class="px-2 text-gray-500">&lt;</button>

            <button
              class="w-7 h-7 flex items-center justify-center rounded bg-blue-600 text-white"
            >
              1
            </button>

            <span>...</span>

            <button class="px-2 text-gray-500">&gt;</button>
          </div>
        </div>
      </div>
    </div>

    <!-- FOOTER -->
    <div class="mt-auto bg-blue-600 text-center text-white py-4 text-sm">
      © 2026 AyoSiswa. All right reserved
    </div>
  </div>
</template>
