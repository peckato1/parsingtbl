import React from 'react'
import { Grammar, NonterminalSymbol, TerminalSymbol, Epsilon, epsilon} from '../ll'


function groups(row: Map<TerminalSymbol|Epsilon, Set<number>>) {
	let tmp = new Map<number, Set<TerminalSymbol|Epsilon>>();
	if (!row)
		return tmp;

	row.forEach((rules, symbol) => {
		rules.forEach((ruleNumber) => {
			if (!tmp.has(ruleNumber)) {
				tmp.set(ruleNumber, new Set())
			}

			tmp.get(ruleNumber)!.add(symbol)
		})
	})

	return tmp;
}

function sourceCode(grammar: Grammar, nonterminal: NonterminalSymbol, parseTable: any) {
	let res: string;
	res = `void ${nonterminal}()\n{\n`
	res = res.concat("    switch(lookahead) {\n")

	groups(parseTable.get(nonterminal)!).forEach((terminals, ruleNumber) => {
		terminals.forEach(c => {
			if (c !== epsilon) {
				res = res.concat(`    case '${c}':\n`)
			} else {
				res = res.concat(`    case EOF:\n`)
			}
		})
		res = res.concat(`        /* rule ${ruleNumber + 1}: ${grammar.rules[ruleNumber].lhs} -> ${grammar.rules[ruleNumber].rhs.join(" ")} */\n`)
		grammar.rules[ruleNumber].rhs.forEach(symb => {
			if (grammar.terminals.includes(symb)) {
				res = res.concat(`        match('${symb}');\n`)
			} else {
				res = res.concat(`        ${symb}();\n`)
			}
		})
		res = res.concat("        break;\n");
	})
	res = res.concat("    }\n")
	res = res.concat("}")
	return res;
}

function codeBlock(grammar: Grammar, nonterminal: NonterminalSymbol, parseTable: any) {
	return (
		<div className="col">
			<div className="card">
				<div className="card-body">
        			<h5 className="card-title">{nonterminal}</h5>
						<pre className="card-text"><code>{sourceCode(grammar, nonterminal, parseTable)}</code></pre>
				</div>
			</div>
		</div>
	)
}

function checkConflict(parseTable: Map<NonterminalSymbol, Map<TerminalSymbol|Epsilon, Set<number>>>) {
	for (let t of parseTable.values()) {
		for (let vals of t.values()) {
			if (vals.size > 1) {
				return true;
			}
		}
	}

	return false;
}

interface Props {
	grammar: Grammar;
	parseTable: Map<NonterminalSymbol, Map<TerminalSymbol|Epsilon, Set<number>>>;
}
export default function ParserCode({grammar, parseTable}: Props) {
	if (checkConflict(parseTable)) {
		return <React.Fragment />
	}

	return (
	<div className="row row-cols-1 row-cols-md-2 g-4">
		{grammar.nonterminals.map(nonterminal => codeBlock(grammar, nonterminal, parseTable))}
	</div>
	)
}

