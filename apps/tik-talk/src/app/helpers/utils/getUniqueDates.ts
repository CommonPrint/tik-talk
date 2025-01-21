export function getUniqueDates(messages: { createdAt: string }[]): string[] {
  const dates = messages.map((msg) => msg.createdAt.split('T')[0]); // Извлекаем только дату
  return [...new Set(dates)]; // Убираем дубликаты с помощью Set
}
