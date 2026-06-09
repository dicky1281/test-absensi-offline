import { db } from "../db/database";

export async function syncAttendance() {
  const data = await db.attendance.where("synced").equals(false).toArray();

  if (!data.length) {
    console.log("Tidak ada data untuk sync");
    return;
  }

  console.log("Data absensi yang akan dikirim:", data);
}
