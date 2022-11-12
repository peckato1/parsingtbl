import { useCallback } from 'react'
import _debounce from 'lodash.debounce'

interface Props {
	onInputChange: (text: string) => void
	error?: string
	height?: number
	initialValue?: string
}

function useEventDebouncer(delay: number, cb: any) {
	const debounceFn = _debounce((input: string) => cb(input), delay)
	const debouncer = useCallback(debounceFn, [cb, delay, debounceFn])
	return (event: any) => debouncer(event.target.value)
}

export function GrammarForm({initialValue, onInputChange, error, height}: Props) {
	const eventDebouncer = useEventDebouncer(300, onInputChange)

	return (
		<div className="form-floating">
			<textarea
				className={"form-control " + (error ? "is-invalid" : "is-valid")}
				placeholder="CFG rules"
				id="grammarInput"
				style={{ height: (height || "200") + "px"}}
				onChange={eventDebouncer}
				defaultValue={initialValue}
			></textarea>
			<label htmlFor="grammarInput">Enter CFG production rules</label>
			<div className="invalid-feedback">
				Could not parse the input: {error}
			</div>
			<div className="form-text">
					Please enter the rules in the form <code>A -&gt; B c Alpha</code> and place each rule on new line.
					Leave right hand side empty or use &epsilon; for <code>A -&gt; &epsilon;</code> rule.
					Symbols must be separated by a space (otherwise they are considered as one symbol).
					Symbols starting with uppercase letter are considered as nonterminals.
					Left hand side of the first rule defines the initial symbol.
					Lines starting with <code>#</code> are comments and do not take part in the computation.
			</div>
		</div>
	   );
}

export function WordForm({initialValue, onInputChange}: Props) {
	const eventDebouncer = useEventDebouncer(300, onInputChange)

	return (
		<div className="form-floating">
			<input type="text"
				className="form-control"
				placeholder="Input word"
				id="wordInput"
				onChange={eventDebouncer}
				defaultValue={initialValue}
			/>
			<label htmlFor="wordInput">Enter input word to analyze</label>
			<div className="form-text">
				Enter the input word to analyze.
				Symbols must be separated by a space (otherwise they are considered as one symbol).
			</div>
		</div>
	   );
}

