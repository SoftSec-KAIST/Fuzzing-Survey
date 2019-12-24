# Contribution Guideline

Please read this guideline before creating a pull request (PR) or an issue on
this repository.

## Inclusion Criteria

In order to ensure the quality of our database and to keep the genealogy graph
simple, we adopt the inclusion criteria we used in our survey. For a conference
paper, it should have been published in one of the following top-tier venues:

* ASE
* CCS
* FSE
* ICSE
* NDSS
* PLDI
* S&P
* USENIX Security

For an open-sourced tool, it should either have gathered at least 100 stars in
GitHub/GitLab or have been presented at Black Hat or DefCon. We do *not* include
papers that present only theoretical aspects without implementing a fuzzing tool
because this database is about the lineage of fuzzing tools. For example, our
[survey](https://ieeexplore.ieee.org/document/8863940) itself should not be
included in this database.

## Git Commit Messages

We follow the convention described in [this
article](https://chris.beams.io/posts/git-commit/).

## Adding a New Fuzzer

The database is stored in [`/data/fuzzers.json`](/data/fuzzers.json) using the
following schema. The **required** fields of each entry are:

- `name`: The name of this fuzzer. This is the key by which this fuzzer is
  referred to and must be *unique*.

- `year`: The year when this fuzzer was published.

- `targets`: The supported targets of this fuzzer. Examples include `file`,
  `network`, `kernel`, `argument`, etc.

- `color`: The degree of instrumentation of this fuzzer---blackbox, greybox, or
  whitebox.

The following fields are *optional*, but please try to provide as much
information as possible:

- `author`: The author(s) of this fuzzer. When possible, please spell the *full
  name(s)* and not just the initials.

- `toolurl`: A URL to the source (preferred) or the executable of this fuzzer.

- `title`: The title of the conference publication/talk or the journal
  publication that presented this fuzzer.

- `booktitle`: The book title of the conference proceedings if this fuzzer first
  appeared at a conference.

- `journal`, `volume`, `number`: The journal title, volume, and number of the
  publication if this fuzzer first appeared in a journal.

- `references`: The `name`(s) of highly-related fuzzers, meaning other fuzzers
  that this fuzzer was implemented on top of or was heavily inspired by. To
  maintain simplicity, we limit this field to **two** entries in our database.

- `miscurl`: Miscellaneous links, e.g., URLs to papers or presentations.

## Basic Rules for JSON

- For effective version control, please format `/data/fuzzers.json` with the
  following [`jq`](https://stedolan.github.io/jq/) command:
  ```
  jq "sort_by(.name)" fuzzers.json
  ```
