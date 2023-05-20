import FenceLexer from './lexer.js'
import parser from './parser.js'

const lex = (text: string) => FenceLexer.tokenize(text)

const parse = (text: string) => {
	const lexingResult = FenceLexer.tokenize(text)
	parser.input = lexingResult.tokens
	return {
		...parser.metadata(),
		lexingErrors: lexingResult.errors
	}
}

export { lex, parse }

export default parse
