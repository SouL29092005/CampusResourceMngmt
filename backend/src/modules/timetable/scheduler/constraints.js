export function checkHardConstraints({
  facultyId,
  classId,
  room,
  slot,
  state,
}) {
  if (state.faculty[facultyId]?.has(slot)) return false;
  if (state.batch[classId]?.has(slot)) return false;
  if (state.room[room]?.has(slot)) return false;

  // consecutive class checks
  if (state.facultyConsecutive[facultyId]?.[slot] >= 2) return false;
  if (state.batchConsecutive[classId]?.[slot] >= 3) return false;

  return true;
}
