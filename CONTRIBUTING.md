Contribution Guideline
===

Please read this guideline before creating a PR (Pull Request) or an issue.

### Selection Criteria

In order to maintain the quality of the survey and to keep the graph simple, we
will have the same acceptance criteria we had in the paper.  A paper should be
published in a top-tier venue: Oakland, USENIX Security, CCS, NDSS, ICSE, FSE,
or ASE. Otherwise, an open-sourced tools should have gathered 100 stars or more.

### Git Commit Messages

We follow the convention described in [this article](https://chris.beams.io/posts/git-commit/).

### Adding a new fuzzer

Add an entry into`data/fuzzers.json` to get new element displayed in the fuzzer
tree.  The **required** fields are:

- `name` of the fuzzer. This is the key by which this fuzzer is referred to and
  must be *unique*.

- The `year` it was published.

- Possible `targets` of the fuzzer, such as `file`, `network`, `kernel`,
  `argument`, etc.

- The `color` of the fuzzer depends on its intrumentation: blackbox, greybox or
  whitebox.

Other fields are *optional*, but try to provide as much information as possible:

- The `author` of this fuzzer. When possible, spell the *full name* and not the
  initials.

- `toolurl` A link to the source (or otherwise the executable) of the fuzzer.

- If it is a published paper in a conference, provide the `title` and the
  `booktitle` of the publication venue. If it is a journal paper, then provide
  the `title` and the name of the `journal` along with its `volume` and
  `number`.

- `references` to other fuzzers `name`. It indicates this entry is
  implemented on top, or heavily inspired by these references. Try not to add
  too many entries here as the graph would become unnecessarily complex.

- Further miscellaneous links can be given in `miscurl`.

#### Basic Rules

- **No tabs**: We do *not* use `tab` for spacing.

- **Indentation = 2**: We always use two space characters for indentations.

#### Specific Rules for JSON Syntax

##### List

We prefer to have space chars for list. For example,
```json
"author": [ "foo1", "foo2" ] // Good
"author": ["foo1", "foo2"]   // Not good
```
