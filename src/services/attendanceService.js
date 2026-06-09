import { db } from "../db/database";

export async function saveCheckin(data) {
  return db.attendance.add({
    ...data,
    checkout: null,
    synced: false,
  });
}

export async function updateCheckout(id, time) {
  return db.attendance.update(id, {
    checkout: time,
  });
}

export async function getTodayAttendance(card_id, date) {
  return db.attendance.where({ card_id, date }).first();
}

export async function getAllAttendance() {
  return db.attendance.reverse().toArray();
}
