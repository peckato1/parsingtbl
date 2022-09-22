import React from 'react'
import { encodeHash } from '../utils/hash'

interface Props {
	word: string;
	grammar: string;
}

export default function ShareLink({grammar, word}: Props) {
	const onClick = React.useCallback(() => {
		const newHash = encodeHash(grammar, word)

		window.location.hash = '#' + newHash

		navigator.clipboard.writeText(window.location.toString())
	}, [grammar, word])

	return (
		<button type="button" className="btn btn-primary" onClick={onClick}>Copy link to clipboard</button>
	)
}
