<script setup>
import { ref, onMounted } from "vue";
import { db } from "../db/database";
import AttendanceSuccessModal from "../components/AttendanceSuccessModal.vue";
import AttendanceWarningModal from "../components/AttendanceWarningModal.vue";
import AttendanceErrorModal from "../components/AttendanceErrorModal.vue";

const inputCode = ref("");
const rfidInput = ref(null);

const currentTime = ref("");
const currentDate = ref("");

const showErrorModal = ref(false);
const showSuccessModal = ref(false);
const showWarningModal = ref(false);
const scannedStudent = ref(null);

const lastScanTime = ref(0);
const scanCooldown = 3000;

function formatTime(date) {
  const h = String(date.getHours()).padStart(2, "0");
  const m = String(date.getMinutes()).padStart(2, "0");
  return `${h}:${m}`;
}

function updateClock() {
  const now = new Date();

  currentTime.value = formatTime(now);

  currentDate.value = now.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

async function initNFC() {
  if (!("NDEFReader" in window)) {
    console.log("Web NFC tidak didukung");
    return;
  }

  try {
    const ndef = new NDEFReader();

    await ndef.scan();

    console.log("NFC aktif");

    ndef.addEventListener("reading", ({ serialNumber }) => {
      console.log("NFC:", serialNumber);

      inputCode.value = serialNumber;
      handleScan();
    });

    ndef.addEventListener("readingerror", () => {
      console.error("Gagal membaca NFC");
    });
  } catch (err) {
    console.error("NFC Error:", err);
  }
}

function focusInput() {
  setTimeout(() => {
    rfidInput.value?.focus();
  }, 100);
}

onMounted(() => {
  updateClock();
  setInterval(updateClock, 1000);

  focusInput();

  window.addEventListener("click", focusInput);

  initNFC();
});

async function handleScan() {
  if (!inputCode.value) return;

  const nowScan = Date.now();

  // anti double scan
  if (nowScan - lastScanTime.value < scanCooldown) {
    inputCode.value = "";
    return;
  }

  lastScanTime.value = nowScan;

  const rfid = inputCode.value.trim();

  const student = await db.students.where("rfid").equals(rfid).first();

  if (!student) {
    showErrorModal.value = true;

    setTimeout(() => {
      showErrorModal.value = false;
    }, 3000);

    inputCode.value = "";
    focusInput();
    return;
  }

  const now = new Date();
  const date = now.toISOString().slice(0, 10);
  const time = formatTime(now);
  const hour = now.getHours();

  const attendance = await db.attendance
    .where("[student_id+date]")
    .equals([student.id, date])
    .first();

  if (!attendance) {
    inputCode.value = "";
    focusInput();
    return;
  }

  if (hour < 12) {
    if (!attendance.checkin) {
      await db.attendance.update(attendance.id, {
        checkin: time,
      });

      scannedStudent.value = student;
      showSuccessModal.value = true;
    } else {
      showWarningModal.value = true;
    }
  } else {
    if (!attendance.checkout) {
      await db.attendance.update(attendance.id, {
        checkout: time,
      });

      scannedStudent.value = student;
      showSuccessModal.value = true;
    } else {
      showWarningModal.value = true;
    }
  }

  // auto close modal
  setTimeout(() => {
    showWarningModal.value = false;
    showSuccessModal.value = false;
  }, 10000);

  inputCode.value = "";
  focusInput();
}
</script>

<template>
  <div
    class="min-h-screen bg-[#295AF6] flex items-center justify-center relative"
  >
    <div class="flex flex-col items-center gap-[42px]">
      <img src="/AyoSiswaSecondary.png" class="w-[172px]" />

      <div
        class="w-[738px] overflow-hidden relative flex flex-col border border-[#718FFF] rounded-[30px] min-h-[561px] bg-white"
      >
        <!-- HEADER SHAPE -->
        <svg
          width="738"
          height="218"
          viewBox="0 0 738 218"
          fill="none"
          class="absolute"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0 0H738V218C738 218 513.865 192.011 369.505 191.984C224.752 191.956 0 218 0 218V0Z"
            fill="url(#paint0_linear)"
          />
          <defs>
            <linearGradient
              id="paint0_linear"
              x1="368"
              y1="484"
              x2="368"
              y2="12"
              gradientUnits="userSpaceOnUse"
            >
              <stop stop-color="#4B74F9" />
              <stop offset="1" stop-color="#1841C2" />
            </linearGradient>
          </defs>
        </svg>

        <!-- HEADER -->
        <div
          class="flex relative mt-[45px] flex-col items-center justify-center gap-2.5"
        >
          <h2 class="text-base font-medium text-white">
            SMA Negeri 1 Rancaekek
          </h2>

          <span class="text-[30px] font-bold text-white">
            Silakan Tap Kartu Sakti Anda
          </span>

          <h2 class="text-base font-medium text-white">
            {{ currentTime }} | {{ currentDate }}
          </h2>
        </div>

        <!-- TAP AREA -->
        <div class="flex-1 flex flex-col items-center justify-center gap-6">
          <div class="relative w-[450px]">
            <img
              src="/circle.png"
              class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[208px]"
            />

            <img src="/tap.png" class="relative z-10 w-[520px]" />
          </div>

          <!-- RFID INPUT -->
          <input
            v-model="inputCode"
            @keyup.enter="handleScan"
            type="text"
            ref="rfidInput"
            autofocus
            class="absolute opacity-0"
          />
        </div>
        <div class="w-[300px] my-5 mx-auto">
          <button
            @click="$router.push('/riwayat')"
            class="button border border-primary text-primary w-[200px]"
          >
            Lihat Riwayat
          </button>
        </div>
      </div>

      <div
        class="py-4 px-6 rounded-[16px] bg-[#1C48D5] text-white border border-[#396FEF]"
      >
        Mohon dekatkan Kartu Sakti Anda pada alat Absensi. Pastikan Kehadiran
        Anda tercatat untuk hari ini
      </div>
    </div>

    <!-- MODAL SUCCESS -->
    <AttendanceSuccessModal
      v-model="showSuccessModal"
      :student="scannedStudent"
    />

    <AttendanceWarningModal v-model="showWarningModal" />

    <AttendanceErrorModal v-model="showErrorModal" />
  </div>
</template>
