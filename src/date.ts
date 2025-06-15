export const getToday = () => {
  const now = new Date();
  const offset = now.getTime() + 9 * 60 * 60 * 1000;
  const kstDate = new Date(offset);
  return kstDate.toISOString().slice(0, 10);
};
