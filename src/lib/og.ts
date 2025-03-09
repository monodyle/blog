import init, { type CanvasKit, type Font } from 'canvaskit-wasm'
import { readFile } from 'node:fs/promises'

let canvasKit: CanvasKit | null = null
const bgImageData = await readFile('./public/assets/template.jpg')
const ebGaramond = await readFile(
  './public/assets/fonts/EBGaramond-Regular.ttf',
)
const ibmPlexSans = await readFile(
  './public/assets/fonts/IBMPlexSans-SemiBold.ttf',
)

async function getCanvasKit() {
  if (!canvasKit) {
    canvasKit = await init()
  }
  return canvasKit
}

function measureText(text: string, font: Font): number {
  const glyphs = font.getGlyphIDs(text)
  const widths = font.getGlyphWidths(glyphs)
  return widths.reduce((a, b) => a + b, 0)
}

type LineBreak = {
  text: string
  width: number
}

function findBalancedBreaks(
  text: string,
  font: Font,
  maxWidth: number,
): string[] {
  const words = text.split(' ')
  if (words.length <= 1) return [text]

  const wordMeasures = words.map((word) => ({
    text: word,
    width: measureText(word, font),
  }))

  const spaceWidth = measureText(' ', font)
  const totalWidth =
    wordMeasures.reduce((sum, word) => sum + word.width, 0) +
    (words.length - 1) * spaceWidth

  const idealNumLines = Math.ceil(totalWidth / maxWidth)
  const idealLineWidth = totalWidth / idealNumLines

  const lines: string[] = []
  let currentLine: LineBreak[] = []
  let currentWidth = 0

  for (let i = 0; i < wordMeasures.length; i++) {
    const word = wordMeasures[i]
    const wordWidth = word.width
    const newWidth =
      currentWidth + (currentWidth > 0 ? spaceWidth : 0) + wordWidth

    if (newWidth > maxWidth) {
      const nextWord = wordMeasures[i + 1]
      if (
        lines.length < idealNumLines - 1 &&
        nextWord &&
        Math.abs(currentWidth - idealLineWidth) >
          Math.abs(newWidth - idealLineWidth) &&
        newWidth <= maxWidth * 1.1
      ) {
        currentLine.push(word)
        currentWidth = newWidth
      } else {
        lines.push(currentLine.map((w) => w.text).join(' '))
        currentLine = [word]
        currentWidth = wordWidth
      }
    } else {
      currentLine.push(word)
      currentWidth = newWidth
    }
  }

  if (currentLine.length > 0) {
    lines.push(currentLine.map((w) => w.text).join(' '))
  }

  return lines
}

export async function buildImage({
  title,
  type,
}: { title: string; type: string }) {
  const canvasKit = await getCanvasKit()

  const surface = canvasKit.MakeSurface(1200, 630)
  if (!surface) {
    throw new Error('Failed to create surface')
  }

  const canvas = surface.getCanvas()

  const bgImage = canvasKit.MakeImageFromEncoded(new Uint8Array(bgImageData))
  if (!bgImage) {
    throw new Error('Failed to load background image')
  }

  const ebGaramondTypeface = canvasKit.Typeface.MakeFreeTypeFaceFromData(
    new Uint8Array(ebGaramond).buffer,
  )
  if (!ebGaramondTypeface) {
    throw new Error('Failed to load font')
  }

  const ibmPlexSansTypeface = canvasKit.Typeface.MakeFreeTypeFaceFromData(
    new Uint8Array(ibmPlexSans).buffer,
  )
  if (!ibmPlexSansTypeface) {
    throw new Error('Failed to load font')
  }

  const bgPaint = new canvasKit.Paint()
  canvas.drawImageRect(
    bgImage,
    canvasKit.XYWHRect(0, 0, bgImage.width(), bgImage.height()),
    canvasKit.XYWHRect(0, 0, 1200, 630),
    bgPaint,
  )

  const typePaint = new canvasKit.Paint()
  typePaint.setColor(canvasKit.Color(10, 10, 10, 1))
  typePaint.setAntiAlias(true)
  const typeFont = new canvasKit.Font(ibmPlexSansTypeface, 11)
  const blob = canvasKit.TextBlob.MakeFromText(type.toUpperCase(), typeFont)
  if (blob) {
    const width = measureText(type, typeFont)
    const x = (1200 - width) / 2
    const y = 280
    canvas.drawTextBlob(blob, x, y, typePaint)
    blob.delete()
  }

  const fontSize = 40
  const titleFont = new canvasKit.Font(ebGaramondTypeface, fontSize)
  const textPaint = new canvasKit.Paint()
  textPaint.setColor(canvasKit.Color(10, 10, 10, 1))
  textPaint.setAntiAlias(true)

  const maxWidth = 720 // 1200 - 240*2 for padding
  const lines = findBalancedBreaks(title, titleFont, maxWidth)

  const lineHeight = fontSize * 1.2
  const totalHeight = lineHeight * (lines.length - 1)
  const startY = (660 - totalHeight) / 2
  lines.forEach((line, index) => {
    const blob = canvasKit.TextBlob.MakeFromText(line, titleFont)
    if (blob) {
      const width = measureText(line, titleFont)
      const x = (1200 - width) / 2
      const y = startY + index * lineHeight
      canvas.drawTextBlob(blob, x, y, textPaint)
      blob.delete()
    }
  })

  const image = surface.makeImageSnapshot()
  const pngData = image.encodeToBytes()

  surface.delete()
  bgImage.delete()
  bgPaint.delete()
  textPaint.delete()
  titleFont.delete()
  ebGaramondTypeface.delete()
  ibmPlexSansTypeface.delete()

  return pngData
}
