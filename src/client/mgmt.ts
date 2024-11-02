export async function resetSession(): Promise<string> {
  return (await fetch(`api/reset-session`, { method: 'POST' })).text();
}
