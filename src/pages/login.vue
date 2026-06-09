<template>
  <section
    class="min-h-screen px-4 flex flex-col items-center justify-center"
    style="background: #295af6"
  >
    <img
      src="/AyoSiswaSecondary.png"
      class="max-w-[148px] w-full mb-[30px]"
      alt="logo ayosiswa"
    />

    <div
      class="rounded-[14px] mb-[30px] px-5 py-[26px] bg-netral-100 border border-netral-200"
    >
      <!-- Title -->
      <div class="mb-5">
        <h1 class="font-bold font-sans text-heading-s text-netral-800 mb-1">
          Masuk
        </h1>
        <p class="text-netral-600 text-s">
          Silahkan masukkan email dan katas sandi Anda untuk melakukan pendataan
        </p>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit">
        <div class="grid grid-cols-1 gap-2 mb-5">
          <!-- EMAIL -->
          <InputText
            v-model="form.email"
            :is-required="true"
            label="Email"
            placeholder="Contoh: email@provider.com"
            :error="errors.email"
          >
            <template #icon>
              <Icon
                name="heroicons:envelope-16-solid"
                size="20"
                class="text-primary"
              />
            </template>
          </InputText>

          <!-- PASSWORD -->
          <InputText
            v-model="form.password"
            :is-required="true"
            label="Kata Sandi"
            :type-input="showPassword ? 'text' : 'password'"
            placeholder="Sandi****"
            :error="errors.password"
          >
            <template #icon>
              <button
                tabindex="-1"
                type="button"
                @click="showPassword = !showPassword"
              >
                <Icon
                  :name="
                    showPassword
                      ? 'heroicons:eye-slash-20-solid'
                      : 'heroicons:eye-20-solid'
                  "
                  size="20"
                  class="text-netral-400 cursor-pointer"
                />
              </button>
            </template>
          </InputText>
        </div>

        <button
          class="button bg-primary disabled:bg-netral-200 disabled:cursor-not-allowed text-netral-100 hover:bg-primary-hover duration-150"
          type="submit"
        >
          Login
        </button>
      </form>
    </div>
  </section>
</template>

<script setup>
import { ref, reactive } from "vue";
import InputText from "../components/InputText.vue";
import { useRouter } from "vue-router";

const showPassword = ref(false);
const router = useRouter();
const form = reactive({
  email: "",
  password: "",
  gudep_id: "",
});

// --- ERROR STATE ---
const errors = reactive({
  email: "",
  password: "",
});

const handleSubmit = async () => {
  errors.email = "";
  errors.password = "";

  if (!form.email) errors.email = "Email wajib diisi";
  if (!form.password) errors.password = "Password wajib diisi";
  if (errors.email || errors.password) return;

  try {
    // ================= LOGIN =================
    const res = await fetch(
      `https://api-belajar.ayosatu.xyz/api/auth/email-login?email=${form.email}&password=${form.password}`,
      {
        method: "POST",
      },
    );

    const data = await res.json();
    console.log("LOGIN RESULT:", data);

    if (!res.ok) {
      alert(data.message || "Login gagal");
      return;
    }

    const token = data?.data?.token;

    if (!token) {
      alert("Token tidak ditemukan");
      return;
    }

    // simpan token
    localStorage.setItem("token", token);

    // ================= GET STUDENTS =================
    const studentRes = await fetch(
      `https://api-belajar.ayosatu.xyz/api/attendance/integration/students`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const studentData = await studentRes.json();
    console.log("STUDENT RESULT:", studentData);

    if (!studentRes.ok) {
      alert("Gagal mengambil data siswa");
      return;
    }

    // optional (kalau mau dipakai nanti)
    localStorage.setItem("students", JSON.stringify(studentData.data));

    // ================= REDIRECT =================
    router.push("/");
  } catch (err) {
    console.error(err);
    alert("Terjadi kesalahan server");
  }
};
</script>
