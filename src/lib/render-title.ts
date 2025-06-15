import gradient from 'gradient-string'

const TITLE_TEXT = `
██████╗ ██╗ ██████╗     ███████╗████████╗ █████╗  ██████╗██╗  ██╗
██╔══██╗██║██╔════╝     ██╔════╝╚══██╔══╝██╔══██╗██╔════╝██║ ██╔╝
██████╔╝██║██║          ███████╗   ██║   ███████║██║     █████╔╝ 
██╔═══╝ ██║██║          ╚════██║   ██║   ██╔══██║██║     ██╔═██╗ 
██║     ██║╚██████╗     ███████║   ██║   ██║  ██║╚██████╗██║  ██╗
╚═╝     ╚═╝ ╚═════╝     ╚══════╝   ╚═╝   ╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝
`
const neonTheme = ['#00f0ff', '#7b2ff7', '#f107a3']
const SIMPLIFIED_TITLE = `
╔══════════════╗
║  PIC STACK   ║
╚══════════════╝
`

export const renderTitle = () => {
  const terminalWidth = process.stdout.columns || 80
  const titleLines = TITLE_TEXT.split('\n')
  const titleWidth = Math.max(...titleLines.map((line) => line.length))

  if (terminalWidth < titleWidth) {
    console.log(gradient(neonTheme).multiline(SIMPLIFIED_TITLE))
    return
  }
  console.log(gradient(neonTheme).multiline(TITLE_TEXT))
}
