import React from 'react'

interface Props {
	word?: string;
	grammar?: string;
}

function addComponent(url: string, key: string, value?: string) {
	if (value && value.length > 0) {
		return url.concat(`&${key}=`).concat(encodeURIComponent(value))
	} else {
		return url;
	}
}

export default function ShareLink({grammar, word}: Props) {
	const onClick = React.useCallback(() => {
		let url = `${window.location.protocol}//${window.location.host}${window.location.pathname}`

		// pagesFIT don't work well with query strings in the url if there is no ".html" in the path, work around for a while
		if (window.location.pathname.startsWith("/peckato1/parsingtbl") && !window.location.pathname.endsWith("index.html")) {
			if (!window.location.pathname.endsWith("/")) {
				url = url.concat("/")
			}

			url = url.concat("index.html")
		}

		url = url.concat("?")
		url = addComponent(url, "g", grammar)
		url = addComponent(url, "w", word)
		navigator.clipboard.writeText(url)
	}, [grammar, word])

	return (
		<button type="button" className="btn btn-primary" onClick={onClick}>Copy link to clipboard</button>
	)
}
