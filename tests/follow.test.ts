import { assert } from 'chai';
import { Grammar, computeFollow, epsilon } from '../lib/main'

describe('FollowComputation', () => {
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

		assert.deepEqual(computeFollow(g), [
			[epsilon, "a", "d"],
			["a", "d"],
			["a", "d"],
		]);
	});
});
