import { Grammar, NonterminalSymbol, TerminalSymbol, Epsilon, epsilon } from '../ll'

const htmlEps = String.fromCharCode(949)

interface Props {
	grammar: Grammar;
	parseTable: Map<NonterminalSymbol, Map<TerminalSymbol|Epsilon, Set<number>>>;
}
export default function ParsingTable({grammar, parseTable}: Props) {
	return (
		<table className="table table-bordered table-sm">
			<caption>LL1 parsing table</caption>
			<thead className="table-light">
				<tr>
					<th></th>
					{grammar.terminals.map((symb) => (<th><code>{symb}</code></th>))}
					<th><code>{htmlEps}</code></th>
				</tr>
			</thead>
			<tbody>
				{grammar.nonterminals.map(N => (
					<tr key={N}>
						<th className="table-light"><code>{N}</code></th>
						{[...grammar.terminals, epsilon].map(T => {
							let entries = parseTable.get(N)?.get(T)
							if (entries) {
								return (
									<td className={entries.size > 1 ? "table-danger" : ""}>
										{[...entries].map((val: number) => val + 1).join(", ")}
									</td>
								)
							} else {
								return (<td></td>)
							}})}
					</tr>
				))}
			</tbody>
		</table>
		)
}
