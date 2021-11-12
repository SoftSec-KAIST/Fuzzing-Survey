# Genealogy Database of Fuzzers

This repository is our attempt to maintain an up-to-date genealogy database of
fuzzers and relevant papers. It is the continuation of an initial effort made by
Manès et al. in ["The Art, Science, and Engineering of Fuzzing: A
Survey"](https://ieeexplore.ieee.org/document/8863940), published in 2019 in
*IEEE Transactions on Software Engineering*. You can visit
https://fuzzing-survey.org to see an interactive site backed by this database.

## What is this survey about?

Our survey is about fuzzers and the relevant literature. Since "fuzzing" is a
largely overloaded term, a primary goal of our survey is to precisely define
what fuzzing is and to characterize various fuzzers. To this end, we split the
process of fuzzing into several steps and use them to systematically categorize
fuzzers based on their features. This repository maintains one of the major
outcomes of this effort, namely a genealogy graph of fuzzers.

## How is this genealogy graph rendered?

We use a [force-directed graph layout
algorithm](https://en.wikipedia.org/wiki/Force-directed_graph_drawing) with
several tweaks. In our current layout, nodes tend to be sorted vertically based
on their year of publication and inter-linked nodes tend to be spatially
clustered together.

## How can I contribute?

We have seeded this repository with the data we collected for our 2019 survey.
Due to the rapid development in fuzzing, we realize our database will quickly
become outdated due to missing papers and tools. It is our hope that, by hosting
this repository in public, you can contribute to this database and help keep it
up-to-date. Please proceed to the [contribution guideline](CONTRIBUTING.md) if
you wish to contribute.

## Who are the maintainers of this database?

This database is currently maintained by:
- [Cyber Security Research Center (CSRC) at KAIST](https://csrc.kaist.ac.kr/)
- [SoftSec Lab. at KAIST](https://softsec.kaist.ac.kr/)

## How do I cite this work?

If you plan to refer to this work, please consider citing our 2019 survey using
the following BibTeX entry. Thank you!

(We are hosting a [pre-print of our
survey](https://softsec.kaist.ac.kr/~sangkilc/papers/manes-tse19.pdf) until the
final version is published at IEEE.)

```bibtex
@ARTICLE{manes:tse:2021,
  author = {Valentin J. M. Man{\`{e}}s and HyungSeok Han and Choongwoo Han and Sang Kil Cha and Manuel Egele and Edward J. Schwartz and Maverick Woo},
  title = {The Art, Science, and Engineering of Fuzzing: A Survey},
  journal = {IEEE Transactions on Software Engineering},
  volume = {47},
  number = {11},
  pages = {2312--2331},
  year = 2021
}
```
