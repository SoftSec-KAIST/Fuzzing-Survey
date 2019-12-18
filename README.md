Fuzzing Tools and Literature Database
===

This is a repository for maintaining the genealogy database of fuzzers and
relevant papers. This is the continuation of the initial effort made by Manes et
al.: "The Art, Science, and Engineering of Fuzzing: A Survey", *IEEE
Transactions on Software Engineering*. You can visit https://fuzzing-survey.org
to understand what this repository is for.

### What Does the Survey about?

It is about fuzzers and relevant literature. Since the term `fuzzing` is a
largely overloaded term, we preciesely define what fuzzing is, and
split its process into several steps to systematically categorize fuzzers into
groups. This repository maintains one of its outcomes, which is a genealogy
graph of fuzzers.

### How Does the Graph Render?

It uses a [force-directed graph layout
algorithm](https://en.wikipedia.org/wiki/Force-directed_graph_drawing) with
several tweaks. At a high-level, each node tends to be vertically sorted by its
published year, and nodes with links would tend to be clustered.

### Contribution

The website is initially built based on our original paper. Therefore it may
miss recent papers and tools. But you can contribute to this project to keep it
up-to-date. Please see the [contribution guideline](CONTRIBUTING.md) carefully
before you make a PR.

### Maintenance

This database is currently maintained by
- [Cyber Security Research Center (CSRC) at KAIST](https://csrc.kaist.ac.kr/)
- [SoftSec Lab. at KAIST](https://softsec.kaist.ac.kr/)

### Citation

If you plan to refer to our work, please consider citing our
[paper](https://softsec.kaist.ac.kr/~sangkilc/papers/manes-tse19.pdf):

```bibtex
@ARTICLE{manes:tse:2019,
  author = {Valentin J. M. Man{\`{e}}s and HyungSeok Han and Choongwoo Han and Sang Kil Cha and Manuel Egele and Edward J. Schwartz and Maverick Woo},
  title = {The Art, Science, and Engineering of Fuzzing: A Survey},
  journal = {{IEEE} Transactions on Software Engineering},
  doi={10.1109/TSE.2019.2946563},
  year = 2019
}
```
