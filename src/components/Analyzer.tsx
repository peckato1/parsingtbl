import { Grammar, NonterminalSymbol, TerminalSymbol, Epsilon, epsilon, GrammarSymbolOrEpsilon } from '../ll'

const htmlEps = String.fromCharCode(949)
const show = (inp: GrammarSymbolOrEpsilon[] | Set<GrammarSymbolOrEpsilon>) => {
	let vals = [...inp]
	return vals.length > 0 ? vals.map((e) => e === epsilon ? htmlEps : e).join(" ") : [htmlEps]
}

interface Step {
	input: TerminalSymbol[];
	stack: GrammarSymbolOrEpsilon[];
	parse: number[];
}

function parse(grammar: Grammar, parseTable: Map<NonterminalSymbol, Map<TerminalSymbol|Epsilon, Set<number>>>, word: TerminalSymbol[]) : Step[] {
	let input = [...word]
	let stack = [grammar.initialSymbol]
	let parse: number[] = []

	let res: Step[] = [{input: [...input], stack: [...stack], parse: [...parse]}]

	while (stack.length > 0) {
		let last = stack[0]

		if (grammar.nonterminals.includes(last)) {
			let rules = parseTable.get(last)?.get(input.length > 0 ? input[0] : epsilon)
			if (!rules || rules.size !== 1) {
				break
			}

			let rule = [...rules][0]
			stack.shift()
			stack = [...grammar.rules[rule].rhs].concat(stack)

			parse.push(rule)
		} else if (input.length > 0 && last && last === input[0]) { // match
			stack.shift()
			input.shift()
		} else {
			break
		}

		res.push({input: [...input], stack: [...stack], parse: [...parse]})
	}
	return res
}

interface Props {
	grammar: Grammar;
	parseTable: Map<NonterminalSymbol, Map<TerminalSymbol|Epsilon, Set<number>>>;
	word: TerminalSymbol[];
}
export default function Analyzer({grammar, parseTable, word}: Props) {
	return (
		<table className="table table-bordered table-sm table-striped row-counter">
			<caption>Sequence of steps of the LL1 analyzer for the word <code>{show(word)}</code></caption>
			<thead className="table-light">
				<tr>
					<th>Step</th>
					<th>Input</th>
					<th>Stack</th>
					<th>Left parse</th>
				</tr>
			</thead>
			<tbody>
				{parse(grammar, parseTable, word).map((step, i, array) => {
					const {input, stack, parse} = step
					const className = (i === array.length - 1) ? (stack.length === 0 && input.length === 0 ? "table-success" : "table-danger") : ""
					return (
						<tr className={className}>
							<td></td>
							<td><code>{show(input)}</code></td>
							<td><code>{show(stack)}</code></td>
							<td>{parse.map(i => i + 1).join(", ")}</td>
						</tr>
					)
				})}
			</tbody>
		</table>
		)
}
