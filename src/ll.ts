export type TerminalSymbol = string
export type NonterminalSymbol = string

export type Epsilon = null
export const epsilon: Epsilon = null

export type GrammarSymbol = TerminalSymbol | NonterminalSymbol
export type GrammarSymbolOrEpsilon = GrammarSymbol | Epsilon

export interface Rule {
	lhs: NonterminalSymbol,
	rhs: GrammarSymbol[],
}

export interface Grammar {
	initialSymbol: NonterminalSymbol,
	nonterminals: NonterminalSymbol[],
	terminals: TerminalSymbol[],
	rules: Rule[],
}

function update(m: Map<NonterminalSymbol, Set<GrammarSymbolOrEpsilon>>, key: NonterminalSymbol, val: (GrammarSymbolOrEpsilon[]) | Set<GrammarSymbolOrEpsilon>): boolean {
	let s = m.get(key)!
	let changed = false

	val.forEach((e) => {
		if (!s.has(e)) {
			changed = true;
			s.add(e);
		}
	})

	return changed
}

function validateGrammar(grammar: Grammar) {
	if (! grammar.nonterminals.every((symbol) => !grammar.terminals.includes(symbol))) {
		throw new Error("Nonterminals and terminals are not disjunct")
	}
	if (! grammar.rules.every((rule) => grammar.nonterminals.includes(rule.lhs))) {
		throw new Error("Rule LHS in not a nonterminal symbol")
	}
	if (! grammar.rules.every((rule) => rule.rhs.every((symbol) => grammar.nonterminals.includes(symbol) || grammar.terminals.includes(symbol)))) {
		throw new Error("Rule RHS contains an invalid symbol")
	}
}

function firstSeq(grammar: Grammar, firstN: Map<NonterminalSymbol, Set<GrammarSymbolOrEpsilon>>, rhs: GrammarSymbol[]) : Set<GrammarSymbolOrEpsilon>{
	const terminal = (symbol: GrammarSymbol) => grammar.terminals.includes(symbol)

	if (rhs.length === 0) {
		return new Set([epsilon])
	} else if (terminal(rhs[0])) {
		return new Set([rhs[0]])
	} else {
		let first = firstN.get(rhs[0])!
		if (first.has(epsilon)) { // contains epsilon -> check next element
			return new Set([...[...first].filter(e => e !== epsilon), ...firstSeq(grammar, firstN, rhs.slice(1))])
		} else {
			return first
		}
	}
}

function firstNonterminals(grammar: Grammar) : Map<NonterminalSymbol, Set<GrammarSymbolOrEpsilon>> {
	let firstN = new Map(grammar.nonterminals.map((symbol) => [symbol, new Set<GrammarSymbolOrEpsilon>()]))
	let changed = true

	while (changed) {
		changed = false

		let newFirstN = new Map(Array.from(firstN))

		for (let rule of grammar.rules) {
			const { lhs, rhs } = rule
			if (update(newFirstN, lhs, firstSeq(grammar, firstN, rhs))) {
				changed = true
			}
		}

		firstN = newFirstN
	}

	return firstN
}

function follow(grammar: Grammar, firstN: Map<NonterminalSymbol, Set<GrammarSymbolOrEpsilon>>): Map<NonterminalSymbol, Set<GrammarSymbolOrEpsilon>> {
	let followN = new Map(grammar.nonterminals.map((symbol) => [symbol, new Set<GrammarSymbolOrEpsilon>()]))
	let changed = true

	followN.set(grammar.initialSymbol, new Set([epsilon]))

	while (changed) {
		changed = false
		let newFollowN = new Map(Array.from(followN))

		for (let rule of grammar.rules) {
			changed = false
			const { lhs, rhs } = rule

			for (let index = 0; index < rhs.length; ++index) {
				let symbol = rhs[index];
				if (grammar.terminals.includes(symbol)) {
					continue
				}

				const beta = rhs.slice(index + 1)
				const firstBeta = firstSeq(grammar, firstN, beta)

				if (update(newFollowN, symbol, [...firstBeta].filter((e) => e !== epsilon))) {
					changed = true
				}

				if (firstBeta.has(epsilon)) {
					if (update(newFollowN, symbol, followN.get(lhs)!)) {
						changed = true
					}
				}
			}

			followN = newFollowN
		}
	}

	return followN
}

function parsingTable(grammar: Grammar, firstR: Set<GrammarSymbolOrEpsilon>[], followN: Map<NonterminalSymbol, Set<GrammarSymbolOrEpsilon>>) {
	let res = new Map<NonterminalSymbol, Map<TerminalSymbol|Epsilon, Set<number>>>()

	const addToRes = (N: NonterminalSymbol, T: TerminalSymbol|Epsilon, val: number) => {
		if (!res.has(N)) {
			res.set(N, new Map<TerminalSymbol|Epsilon, Set<number>>())
		}

		let inner = res.get(N)!
		if (inner.has(T)) {
			inner.get(T)!.add(val)
		} else {
			inner.set(T, new Set([val]))
		}
	}

	grammar.rules.forEach((rule, i) => {
		firstR[i].forEach((firstSymb) => {
			if (firstSymb !== epsilon) {
				addToRes(rule.lhs, firstSymb, i)
			}
		})

		if (firstR[i].has(epsilon)) {
			followN.get(rule.lhs)!.forEach((followSymb) => {
				addToRes(rule.lhs, followSymb, i)
			})
		}
	})

	return res
}

export function compute(grammar: Grammar) {
	validateGrammar(grammar)

	let firstN = firstNonterminals(grammar)
	let firstR = grammar.rules.map((rule) => firstSeq(grammar, firstN, rule.rhs))
	let followN = follow(grammar, firstN)
	let table = parsingTable(grammar, firstR, followN)
	return {
		firstN: firstN,
		firstR: firstR,
		followN: followN,
		parsingTable: table,
	}
}
