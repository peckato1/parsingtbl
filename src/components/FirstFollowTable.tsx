import React from 'react'
import { epsilon, NonterminalSymbol, Grammar, GrammarSymbolOrEpsilon } from '../ll'
import './FirstFollowTable.css'

const htmlAlpha = String.fromCharCode(945)
const htmlEps = String.fromCharCode(949)
const htmlArrow = String.fromCharCode(10230)

const show = (inp: GrammarSymbolOrEpsilon[] | Set<GrammarSymbolOrEpsilon>) => {
	let vals = [...inp]
	return vals.length > 0 ? vals.map((e) => e === epsilon ? htmlEps : e).join(" ") : [htmlEps]
}

const firstFollowN = (rowSpan: number, first: any, follow: any) => {
	return (
		<React.Fragment>
			<td rowSpan={rowSpan}><code>{show(first)}</code></td>
			<td rowSpan={rowSpan}><code>{show(follow)}</code></td>
		</React.Fragment>
	)
}

interface Props {
	grammar: Grammar;
	firstN: any;
	followN: any;
	firstR: any;
}
export default function FirstFollowTable({grammar, firstN, followN, firstR}: Props) {
	const rhsCnt = new Map<NonterminalSymbol, number>(grammar.nonterminals.map(symb => [symb, grammar.rules.filter(rule => rule.lhs === symb).length]))

	return (
		<table className="table table-sm table-bordered">
			<caption>LL1 first and follow sets</caption>
			<thead className="table-light">
				<tr>
					<th></th>
					<th>Rule (A {htmlArrow} {htmlAlpha})</th>
					<th>First({htmlAlpha})</th>
					<th>first[A]</th>
					<th>Follow(A)</th>
				</tr>
			</thead>
			<tbody>
				{grammar.rules.map((rule, i) => (
					<tr key={i}>
						<td className={grammar.initialSymbol === rule.lhs ? "table-light content-asterisk" : "table-light"}>{i + 1}</td>
						<td><code>{rule.lhs}</code> {htmlArrow} <code>{show(rule.rhs)}</code></td>
						<td><code>{show(firstR[i])}</code></td>
						{ (i === 0 || rule.lhs !== grammar.rules[i - 1].lhs) &&
							firstFollowN(rhsCnt.get(rule.lhs)!, firstN.get(rule.lhs)!, followN.get(rule.lhs)!)}
					</tr>
				))}
			</tbody>
		</table>
	);
}
