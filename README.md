# pdf-resume-builder

![Build](https://github.com/rszamszur/pdf-resume-builder/actions/workflows/build.yml/badge.svg)

This project is a simple, stateless, single-page application for generating PDF resume from JSON data. While there are many great opensource projects which render structured data to an online cv, I couldn't found one that can generate a neat PDF as well. Moreover, probably 99% of hiring forms still require a PDF resume anyways.

For now, there are just three templates that can still be a bit buggy. Unfortunately, I don't have the resources to thoroughly test it with each possible configuration, so please feel free to submit an issue if you have some rendering problems. That being said, there are some simple template adjustments (margins, font size, etc.) provided which can overcome some problems.

## Usage

1. Choose JSON from [examples](https://github.com/rszamszur/pdf-resume-builder/tree/master/examples)
2. Fill it with your data
3. Go to [Github Pages](https://rszamszur.github.io/pdf-resume-builder/)
4. Generate your resume from chosen template

Adjust the template or play with items order if you're not entirely happy with the outcome. Last but not least, may the odds be in your favor.

NOTE! Some templates may provide more adjusting options than others. 

## Templates

| [LessIsBetter](https://github.com/rszamszur/pdf-resume-builder/tree/master/examples/LessIsBetter) | [ShineLikeDiamond](https://github.com/rszamszur/pdf-resume-builder/tree/master/examples/ShineLikeDiamond) | [LetsTalkAboutIt](https://github.com/rszamszur/pdf-resume-builder/tree/master/examples/LetsTalkAboutIt) |
|---------|---------|---------|
| <img src="https://github.com/rszamszur/pdf-resume-builder/blob/master/src/assets/LessIsBetter.png?raw=true" width="300"/> | <img src="https://github.com/rszamszur/pdf-resume-builder/blob/master/src/assets/ShineLikeDiamond.png?raw=true" width="300"/> | <img src="https://github.com/rszamszur/pdf-resume-builder/blob/master/src/assets/LetsTalkAboutIt.png?raw=true" width="300"/> |

## Contributing

Questions, comments or improvements? Please create an issue on Github. I do my best to include every contribution proposed in any way that I can.

## License

[MIT](https://github.com/rszamszur/pdf-resume-builder/blob/master/LICENSE)
