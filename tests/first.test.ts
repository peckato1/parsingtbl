import { assert } from 'chai';
import { Grammar, computeFirstForEveryRule, epsilon } from '../lib/main'

describe('First computation', () => {
	it('PJP Slides', () => {
		let g : Grammar = {
			nonterminals: ["S", "A", "B"],
			terminals: ["a", "b", "c", "d", "f"],
			initialSymbol: "S",
			rules: [
				{ lhs: "S", rhs: ["A", "a"] },
				{ lhs: "S", rhs: ["b", "S"] },
				{ lhs: "A", rhs: ["c", "A", "d"] },
				{ lhs: "A", rhs: ["B"] },
				{ lhs: "B", rhs: ["f", "S"] },
				{ lhs: "B", rhs: [] }
			]}

		assert.deepEqual(computeFirstForEveryRule(g), [
			["c", "f", "a"],
			["b"],
			["c"],
			["f", epsilon],
			["f"],
			[epsilon]
		]);
	});

	it('Arithmetic expressions', () => {
		let g : Grammar = {
			nonterminals: ["E", "T", "F"],
			terminals: ["+", "*", "(", ")", "a"],
			initialSymbol: "E",
			rules: [
				{ lhs: "E", rhs: ["E", "+", "T"] },
				{ lhs: "E", rhs: ["T"] },
				{ lhs: "T", rhs: ["T", "*", "F"] },
				{ lhs: "T", rhs: ["F"] },
				{ lhs: "F", rhs: ["a"] },
				{ lhs: "F", rhs: ["(", "E", ")"] },
			]}

		assert.deepEqual(computeFirstForEveryRule(g), [
			["a", "("],
			["a", "("],
			["a", "("],
			["a", "("],
			["a"],
			["("],
		]);
	});

	it('Some grammar I', () => {
		let g : Grammar = {
			nonterminals: ["S", "A", "B"],
			terminals: ["a", "b", "c", "d"],
			initialSymbol: "S",
			rules: [
				{ lhs: "S", rhs: ["A", "a", "S"] },
				{ lhs: "S", rhs: ["B", "c"] },
				{ lhs: "S", rhs: [] },
				{ lhs: "A", rhs: ["b", "S"] },
				{ lhs: "B", rhs: ["d", "B", "a"] },
				{ lhs: "B", rhs: [] },
			]}

		assert.deepEqual(computeFirstForEveryRule(g), [
			["b"],
			["d", "c"],
			[epsilon],
			["b"],
			["d"],
			[epsilon],
		]);
	});

	it('Some grammar II', () => {
		let g : Grammar = {
			nonterminals: ["S", "A", "B", "C", "D", "E", "F"],
			terminals: ["a", "b", "c", "d", "e"],
			initialSymbol: "S",
			rules: [
				{ lhs: "S", rhs: ["A", "a", "S", "a", "A", "d"] },
				{ lhs: "S", rhs: ["d", "d", "B"] },
				{ lhs: "A", rhs: ["b", "b", "c", "e", "D"] },
				{ lhs: "A", rhs: ["e", "D"] },
				{ lhs: "A", rhs: [] },
				{ lhs: "B", rhs: ["b", "e", "A"] },
				{ lhs: "B", rhs: [] },
				{ lhs: "B", rhs: ["c", "C", "c"] },
				{ lhs: "C", rhs: ["b", "b", "F"] },
				{ lhs: "C", rhs: ["e", "D"] },
				{ lhs: "D", rhs: ["b", "E"] },
				{ lhs: "D", rhs: ["E"] },
				{ lhs: "E", rhs: ["e", "D"] },
				{ lhs: "E", rhs: [] },
				{ lhs: "F", rhs: ["a", "D"] },
				{ lhs: "F", rhs: ["b", "F"] },
				{ lhs: "F", rhs: [] },
			]}

		assert.deepEqual(computeFirstForEveryRule(g), [
			["b", "e", "a"],
			["d"],
			["b"],
			["e"],
			[epsilon],
			["b"],
			[epsilon],
			["c"],
			["b"],
			["e"],
			["b"],
			["e", epsilon],
			["e"],
			[epsilon],
			["a"],
			["b"],
			[epsilon],
		]);
	});
});
