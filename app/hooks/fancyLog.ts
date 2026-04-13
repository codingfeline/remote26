export function fancyLog(txt: string, background: string, colour = '#5f5f5e'): void {
  const now = new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString()

  console.log(
    '%c' + txt + ' ' + now,
    `color: ${colour}; background:${background}; padding: 10px; border-radius:8px; font-size: 24px; font-family: 'Consolas', monospace;`,
  )
}
