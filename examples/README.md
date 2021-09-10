## Templates

| [LessIsBetter](https://github.com/rszamszur/pdf-resume-builder/tree/master/examples/LessIsBetter) | [ShineLikeDiamond](https://github.com/rszamszur/pdf-resume-builder/tree/master/examples/ShineLikeDiamond) | [LetsTalkAboutIt](https://github.com/rszamszur/pdf-resume-builder/tree/master/examples/LetsTalkAboutIt) |
|---------|---------|---------|
| <img src="https://github.com/rszamszur/pdf-resume-builder/blob/master/src/assets/LessIsBetter.png?raw=true" width="300"/> | <img src="https://github.com/rszamszur/pdf-resume-builder/blob/master/src/assets/ShineLikeDiamond.png?raw=true" width="300"/> | <img src="https://github.com/rszamszur/pdf-resume-builder/blob/master/src/assets/LetsTalkAboutIt.png?raw=true" width="300"/> |

## Common adjusting options

### Margins

Each template has the following set of base margins:
* top
* bottom
* left
* right
* section
* list

However, for each template, adjusting range as well as margin "placement" can be different. They're explained in detail in each template README. Moreover, some templates may provide additional margins (ex. sidebar), of which some may also be adjustable.

### Typography

Font sizes similar to margins also have a constant set of values for each template:
* name
* tagline
* section
* header
* subheader
* content

Although, they're much more limited in terms of adjusting values. This is due to the fact that a change in one font size affects the whole document in a cascade, whereas margins move sections independently. Moreover, with each font size change, its line height must be adjusted at some point to prevent text from overlapping. That's why options Font Size and Line Height are in pairs.

### How font size and line height works?

![typography](https://github.com/rszamszur/pdf-resume-builder/blob/assets/typography.png?raw=true)