Contribution Guideline
===

Please read this guideline before creating a PR (Pull Request) or an issue.

### Git Commit Messages

We follow the convention described in [this article](https://chris.beams.io/posts/git-commit/).

- Split the subject line and the body (if needed).
- Start the subject line with a capital letter.
- Do not use a period at the end of the subject line.
- The body is optional: subject-only commit is okay.
- The body should explain *why* you made this commit.
- The subject line is limited to maximum 50 characters.
- Each line in the body is limited to maximum 72 characters.

### Adding a new fuzzer
Add an entry into`data/fuzzers.json` to get new element displayed in the fuzzer
tree.
The **required** fields are:
- `name` of the fuzzer. This is the key by which this fuzzer is referred to and
  must be *unique*.
- The `year` it was published.
- Possible `targets` of the fuzzer.
- The `color` of the fuzzer depends on its intrumentation: blackbox, greybox or
  whitebox.

Other fields are *optional*, but try to provide as much information as
possible:
- The `author` of this fuzzer. When possible, spell the full name and not the
  initials.
- `toolurl` A link to the source (or otherwise the executable) of the fuzzer.
- If it is a published paper, provide the `title` and the `booktitle` of the
  publication venue.
- `references` to other fuzzers `name`. It indicates this entry is
  implemented on top, or heavily inspired by these references.
- Further miscellaneous links can be given in `miscurl`.

#### Basic Rules

- **No tabs**: We do *not* use `tab` for spacing.
- **Indentation = 2**: We always use two space characters for indentations.

#### Specific Rules

##### List

We prefer to have space chars for list. For example,
```json
"author": [ "foo1", "foo2" ] // Good
"author": ["foo1", "foo2"]   // Not good
```
