import React from 'react'
import InputForm from './components/InputForm'
import FirstFollowTable from './components/FirstFollowTable'
import ParsingTable from './components/ParseTable'
import { Grammar, NonterminalSymbol, TerminalSymbol, Rule, compute } from './ll'

const isNonterminal = (ident: string) => (/^[A-Z]/).test(ident)

function parseGrammar(text: string) {
	let nonterminals: NonterminalSymbol[] = []
	let nonterminalsOrder: NonterminalSymbol[] = []
	let terminals: TerminalSymbol[] = []
	let rules: Rule[] = []

	if (!text || text.trim().length === 0) {
		throw new Error("Empty input")
	}

	for(let row of text.trim().split("\n")) {
		if (row.trim().length === 0) {
			continue
		}

		let splitted = row.split("->").map((e) => e.trim().split(" "))
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

		if (rhs.length === 1 && rhs[0] === "") {
			rules.push({lhs: lhs[0], rhs: []})
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

function App() {
	const [ grammar, setGrammar ] = React.useState<{grammar?: Grammar, error?: string}>({grammar: undefined, error: undefined})
	const onGrammarInput = (event: any) => {
		try {
			let grammar = parseGrammar(event.target.value)
			setGrammar(() => { return {grammar: grammar, error: undefined}})
		} catch (error: any) {
			setGrammar(() => { return {grammar: undefined, error: error.message}})
		}
	}

	const LL1 = grammar.grammar ? compute(grammar.grammar) : null

	return (
		<div className="row">
			<div className="col-lg-4">
				<InputForm height={250} onChange={onGrammarInput} error={grammar.error} />
			</div>
			<div className="col-lg-8">
				{grammar.grammar && (
					<React.Fragment>
						<FirstFollowTable grammar={grammar.grammar} firstR={LL1?.firstR!} firstN={LL1?.firstN!} followN={LL1?.followN!} />
						<hr />
						<ParsingTable grammar={grammar.grammar} parseTable={LL1?.parsingTable!} />
					</React.Fragment>)}
			</div>
		</div>
	   );
}

export default App;
