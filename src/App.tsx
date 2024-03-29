import React from 'react'
import { useWindowHash, decodeHash } from './utils/hash'
import { GrammarForm, WordForm } from './components/InputForm'
import FirstFollowTable from './components/FirstFollowTable'
import ParsingTable from './components/ParseTable'
import Analyzer from './components/Analyzer'
import ParserCode from './components/ParserCode'
import ShareLink from './components/ShareLink'
import { NonterminalSymbol, TerminalSymbol, Rule, compute } from './ll'

const isNonterminal = (ident: string) => (/^[A-Z]/).test(ident)
const epsilonStr = "ε"

function parseGrammar(text: string | undefined) {
	let nonterminals: NonterminalSymbol[] = []
	let nonterminalsOrder: NonterminalSymbol[] = []
	let terminals: TerminalSymbol[] = []
	let rules: Rule[] = []

	if (!text || text.trim().length === 0) {
		throw new Error("Empty input")
	}

	let rows = text.trim().split("\n").filter(row => !row.trim().startsWith("#"))

	if (rows.length === 0) {
		throw new Error("Empty input")
	}

	for(let row of rows) {
		if (row.trim().length === 0) {
			continue
		}

		let splitted = row.split("->").map((e) => e.trim().split(" ").filter(e => e.length > 0))
		if (splitted.length !== 2) {
			throw new Error("Unable to decompose rule. None or multiple '->' on one line")
		}

		let [lhs, rhs] = splitted
		if (isNonterminal(lhs[0])) {
			nonterminals.push(lhs[0])
			nonterminalsOrder.push(lhs[0])
		} else if (lhs[0] === "") {
			throw new Error("LHS missing")
		} else {
			throw new Error("LHS is not a nonterminal symbol")
		}

		if (rhs.length === 1 && (rhs[0] === "" || rhs[0] === epsilonStr)) {
			rules.push({lhs: lhs[0], rhs: []})
		} else if (rhs.includes(epsilonStr)) {
			throw new Error(`Found ${epsilonStr} in the RHS of the rule but the rule was not in the form A -> ${epsilonStr}`)
		} else {
			rhs.forEach((symb) => {
				if (isNonterminal(symb)) {
					nonterminals.push(symb)
				} else {
					terminals.push(symb)
				}
			})
			rules.push({lhs: lhs[0], rhs: rhs})
		}

	}

	return {
		nonterminals: [...new Set<NonterminalSymbol>(nonterminalsOrder.concat(nonterminals))],
		terminals: [...new Set<TerminalSymbol>(terminals)].sort(),
		initialSymbol: rules[0].lhs,
		rules: rules.sort((a, b) => nonterminalsOrder.indexOf(a.lhs) - nonterminalsOrder.indexOf(b.lhs))
	}
}

function parseWord(input: string): string[] {
	let i = input = input.trim()
	if (i === "") {
		return []
	} else {
		return i.split(" ").filter(e => e.length > 0)
	}
}

function App() {
	const [ grammar, setGrammar ] = React.useState<string>("")
	const [ word, setWord ] = React.useState<string>("")
	const hash = useWindowHash()

	React.useEffect(() => {
		const { grammar, word } = decodeHash(hash)
		setGrammar(() => grammar ?? "")
		setWord(() => word ?? "")
	}, [hash])

	let domLL: any = undefined
	let grammarParseError: string | undefined = undefined

	try {
		let g = parseGrammar(grammar)
		const LL1 = g ? compute(g) : undefined
		domLL = (
			<React.Fragment>
				<FirstFollowTable grammar={g} firstR={LL1?.firstR!} firstN={LL1?.firstN!} followN={LL1?.followN!} />
				<hr />
				<ParsingTable grammar={g} parseTable={LL1?.parsingTable!} />
				<hr />
				<Analyzer grammar={g} parseTable={LL1?.parsingTable!} word={parseWord(word)} />
				<hr />
				<ParserCode grammar={g} parseTable={LL1?.parsingTable!} />
			</React.Fragment>
		)
	} catch(error: any) {
		grammarParseError = error.message
	}

	return (
		<div className="row">
			<div className="col-lg-4">
				<GrammarForm height={250} onInputChange={(text: string) => setGrammar(text)} error={grammarParseError} initialValue={grammar} />
				<hr />
				<WordForm onInputChange={(text: string) => setWord(text)} initialValue={word} />
				<hr />
				<ShareLink grammar={grammar} word={word} />
			</div>
			<div className="col-lg-8">
				{domLL}
			</div>
		</div>
	   );
}

export default App;
