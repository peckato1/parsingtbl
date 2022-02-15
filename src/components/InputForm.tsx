interface Props {
	onChange: (event: any) => void;
	error?: string;
	height: number
}

export default function GrammarForm({onChange, error, height}: Props) {
	return (
		<div className="form-floating">
			<textarea
				className={"form-control " + (error ? "is-invalid" : "is-valid")}
				placeholder="CFG rules"
				id="grammarInput"
				style={{ height: height + "px"}}
				onChange={onChange}
			></textarea>
			<label htmlFor="grammarInput">Enter CFG production rules</label>
			<div className="invalid-feedback">
				Could not parse the input: {error}
			</div>
			<div className="form-text">
					Please enter the rules in the form <code>A -&gt; B c Alpha</code>.
					Leave right hand side empty for <code>A -&gt; &epsilon;</code>.
					Symbols must be separated by a space (otherwise they are considered as one symbol).
					Symbols starting with uppercase letter are considered as nonterminals.
					Left hand side of the first rule defines the initial symbol.
			</div>
		</div>
	   );
}
