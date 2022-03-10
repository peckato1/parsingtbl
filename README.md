# parsingtbl
![GitLab CI badge](https://gitlab.fit.cvut.cz/peckato1/parsingtbl/badges/master/pipeline.svg "GitLab CI badge")

Client-side JS application for [LL(1) parsing](https://en.wikipedia.org/wiki/LL_parser).
You define a context-free grammar (and possibly also a word) and the app will show:
 * First and Follow functions for each nonterminal/rule,
 * a parsing table for the grammar,
 * a sequence of steps performed by the pushdown automaton analysing the input word, and
 * sample implementation of the parser using recursive descent if there are no conflicts in the parsing table.

The application was originally implemented for the purposes of [Programming Languages and Compilers](https://bilakniha.cvut.cz/en/predmet6704406.html) course at [Faculty of Information Technology](https://fit.cvut.cz/en), [CTU in Prague](https://www.cvut.cz/en).

## Live version
The app is auto-deployed [here](https://pages.fit.cvut.cz/peckato1/parsingtbl/).

## Repository
* [gitlab.fit.cvut.cz](https://gitlab.fit.cvut.cz/peckato1/parsingtbl)
* [GitHub](https://github.com/peckato1/parsingtbl) (mirrored)


## Authors
Tomáš Pecka (FIT CTU in Prague)
