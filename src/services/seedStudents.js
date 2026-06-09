import { db } from "../db/database";

export async function seedStudents() {
  const count = await db.students.count();

  if (count > 0) return;

  const students = [
    { id: 1, name: "Ahmad", class: "7A", rfid: "111111" },
    { id: 2, name: "Budi", class: "7D", rfid: "2932721883" },
    { id: 3, name: "Citra", class: "7B", rfid: "3333" },
  ];

  await db.students.bulkPut(students);

  console.log("Dummy students inserted");
}
