import Dexie from "dexie";

export const db = new Dexie("absensiDB");

db.version(1).stores({
  students: "++id, name, rfid, kelas",
  attendance:
    "++id, student_id, date, checkin, checkout, synced, [student_id+date]",
});

async function seedDatabase() {
  const count = await db.students.count();

  if (count === 0) {
    const studentId = await db.students.add({
      name: "Budi Gunawan",
      rfid: "2932721883",
      kelas: "Kelas 1",
    });

    const today = new Date().toISOString().slice(0, 10);

    await db.attendance.add({
      student_id: studentId,
      date: today,
      checkin: null,
      checkout: null,
      synced: false,
    });

    console.log("Dummy data inserted");
  }
}

seedDatabase();
