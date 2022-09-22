import React from 'react'


// https://stackoverflow.com/questions/58442168/why-useeffect-doesnt-run-on-window-location-pathname-changes
export const useWindowHash = () => {
	const [hash, setHash] = React.useState(window.location.hash);
	const listenToHashChange = () => {
		setHash(window.location.hash);
	};
	React.useEffect(() => {
		window.addEventListener("hashchange", listenToHashChange);
		return () => {
			window.removeEventListener("hashchange", listenToHashChange);
		};
	}, []);
	return hash;
};

export const decodeHash = (hash: string) => {
	const defaultRes = { grammar: null, word: null }

	if (hash.length === 0 || (hash.length === 1 && hash[0] === '#')) {
		return defaultRes
	}

	hash = hash.slice(1)

	try {
		const decoded = window.atob(hash) // https://github.com/microsoft/TypeScript/issues/45566
		const data = JSON.parse(decoded)
		return { grammar: data.grammar, word: data.word }
	} catch (e: any) {
		return defaultRes
	}
}

export const encodeHash = (grammar: string, word: string) => {
	const data = { grammar: grammar, word: word }
	const js = JSON.stringify(data)
	return window.btoa(js)
}
