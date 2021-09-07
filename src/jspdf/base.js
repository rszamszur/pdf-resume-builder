import { jsPDF } from "jspdf";

export class BaseTemplate {
    constructor(conf) {
        if (this.constructor == BaseTemplate) {
            throw new Error("Abstract classes can't be instantiated.");
        }

        this.doc = new jsPDF();
        this.initConf = conf;
        this.conf = conf;
        this.heightRef = this.conf.margin.top;
        if (this.conf.sidebarRight) {
            this.totalLeftMargin = this.conf.margin.left;
        } else {
            this.totalLeftMargin = this.conf.margin.left + this.conf.sidebarWidth;
        }
        this.currentPage = 1;
    }

    static schema() {
        return {
            type: "object",
            properties: {
                name: { type: "string" },
                lastname: { type: "string" },
                tagline: { type: "string" },
                contact: {
                    type: "object",
                    properties: {
                        email: { type: "string" },
                        phone: { type: "string" },
                        linkedin: { type: "string" },
                        github: { type: "string" },
                        website: { type: "string" },
                        twitter: { type: "string" },
                        stackoverflow: { type: "string" },
                    },
                    required: ["email", "phone"],
                },
                about: { type: "string" },
                education: {
                    type: "array",
                    minItems: 1,
                    items: {
                        type: "object",
                        properties: {
                            degree: { type: "string" },
                            university: { type: "string" },
                            time: { type: "string" },
                            details: {
                                type: "array",
                                minItems: 1,
                                items: { type: "string" },
                            },
                        },
                        required: ["degree", "university", "time"],
                    },
                },
                experience: {
                    type: "array",
                    minItems: 1,
                    items: {
                        type: "object",
                        properties: {
                            role: { type: "string" },
                            company: { type: "string" },
                            time: { type: "string" },
                            details: {
                                type: "array",
                                minItems: 1,
                                items: { type: "string" },
                            },
                        },
                        required: ["role", "company", "time"],
                    },
                },
                projects: {
                    type: "object",
                    properties: {
                        items: {
                            type: "array",
                            minItems: 1,
                            items: {
                                type: "object",
                                properties: {
                                    name: { type: "string" },
                                    tagline: { type: "string" },
                                    link: { type: "string" },
                                    details: { type: "string" },
                                },
                                required: ["name", "details"],
                            },
                        },
                    },
                    required: ["items"],
                },
                skills2Rows: {
                    type: "boolean",
                    default: true,
                },
                skills: {
                    type: "array",
                    minItems: 1,
                    items: {
                        type: "object",
                        properties: {
                            name: { type: "string" },
                            level: {
                                type: "number",
                                enum: [
                                    0.5, 1.0, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0, 4.5, 5.0,
                                ],
                            },
                        },
                        required: ["name", "level"],
                    },
                },
                languages: {
                    type: "array",
                    minItems: 1,
                    items: {
                        type: "object",
                        properties: {
                            name: { type: "string" },
                            level: { type: "string" },
                        },
                        required: ["name"],
                    },
                },
                courses: {
                    type: "array",
                    minItems: 1,
                    items: { type: "string" },
                },
                interests: {
                    type: "array",
                    minItems: 1,
                    items: {
                        type: "object",
                        properties: {
                            name: { type: "string" },
                            link: { type: "string" },
                        },
                        required: ["name"],
                    },
                },
                numPages: {
                    type: "boolean",
                    default: true,
                },
            },
            required: [
                "name",
                "lastname",
                "contact",
                "education",
                "experience",
                "skills",
            ],
            additionalProperties: false,
        };
    }

    static defaultOptions() {
        throw new Error("Method 'defaultOptions()' must be implemented.");
    }

    generatePDF() {
        throw new Error("Method 'generate(data, options = null)' must be implemented.");
    }

    _addAbout(content) {
        this._addHeader("ABOUT ME");
        this._printMultiLine(content, false);
        this.heightRef += this.conf.height.normalize; // normalize height
        this.heightRef += this.conf.margin.between;
    }

    _addExperience(jobs) {
        this._addHeader("EXPERIENCE");
        console.log(jobs);
        jobs.forEach((job, index) => {
            this.doc.setFont(this.conf.font.subHeader, "normal");
            this.doc.setTextColor(this.conf.color.primary);
            this.doc.setFontSize(this.conf.text.subHeader);
            this._isEnoughSpace(this.conf.height.subHeader);
            this.doc.text(job.role, this.totalLeftMargin, this.heightRef);
            this.heightRef += this.conf.height.subHeader;
            this.doc.setFont(this.conf.font.subHeaderTagline, "normal");
            this.doc.setFontSize(this.conf.text.subHeader);
            this._isEnoughSpace(this.conf.height.subHeader);
            this.doc.text(`${job.time} | ${job.company}`, this.totalLeftMargin, this.heightRef);
            this.heightRef += this.conf.height.subHeader;
            if (job.details) {
                job.details.forEach(detail => {
                    this._printMultiLine(detail, true);
                });
            } else {
                this.heightRef -= (this.conf.height.subHeader - this.conf.height.content);  // normalize height
            }

            if (index != jobs.length - 1) {
                this.heightRef += this.conf.height.content;
            }
        });
        this.heightRef += this.conf.height.normalize; // normalize height
        this.heightRef += this.conf.margin.between;
    }

    _addProjects(projects) {
        this._addHeader("PROJECTS");

        if (projects.details) {
            this._printMultiLine(projects.details, false);
            this.heightRef += this.conf.height.content; //normalize height
        }
        projects.items.forEach((project, index) => {
            this.doc.setFont(this.conf.font.subHeader, "normal");
            this.doc.setTextColor(this.conf.color.primary);
            this.doc.setFontSize(this.conf.text.subHeader);
            this._isEnoughSpace(this.conf.height.subHeader);
            if (project.link) {
                this.doc.textWithLink(project.name, this.totalLeftMargin, this.heightRef, {
                    url: project.link,
                });
            } else {
                this.doc.text(project.name, this.totalLeftMargin, this.heightRef);
            }
            this.heightRef += this.conf.height.subHeader;
            this.doc.setFont(this.conf.font.subHeaderTagline, "normal");
            this.doc.setFontSize(this.conf.text.subHeader);
            this._isEnoughSpace(this.conf.height.subHeader);
            this.doc.text(project.tagline, this.totalLeftMargin, this.heightRef);
            this.heightRef += this.conf.height.subHeader;
            this._printMultiLine(project.details, true);
            if (index != projects.items.length - 1) {
                this.heightRef += this.conf.height.content; //normalize height
            }
        });
        this.heightRef += this.conf.height.normalize; // normalize height
        this.heightRef += this.conf.margin.between;
    }

    _addSkills(skills, twoRows) {
        this._addHeader("SKILLS");
        const initHeightRef = this.heightRef;
        const initPage = this.currentPage;

        if (twoRows) {
            const half = Math.ceil(skills.length / 2);

            const firstRow = skills.slice(0, half);
            const secondRow = skills.slice(-half);
            this._addSkillsRow(firstRow, this.totalLeftMargin);
            if (initPage != this.currentPage) {
                this._setPage(initPage);
            }
            this.heightRef = initHeightRef;
            const secondRowOfset = ((this.doc.internal.pageSize.width - this.conf.margin.right - this.conf.margin.left - this.conf.sidebarWidth) / 2) + this.totalLeftMargin;
            this._addSkillsRow(secondRow, secondRowOfset);
        } else {
            this._addSkillsRow(skills, this.totalLeftMargin);
        }
        this.heightRef += this.conf.height.normalize; //normalize height
        this.heightRef += this.conf.margin.between;
    }

    _addSkillsRow(skills, offset) {
        this.doc.setFont(this.conf.font.content, "normal");
        this.doc.setTextColor(this.conf.color.primary);
        this.doc.setFontSize(this.conf.text.content);

        var fullCircleIcon = new Image();
        fullCircleIcon.src = require("../assets/icons/circle.png");
        var halfCircleIcon = new Image();
        halfCircleIcon.src = require("../assets/icons/circle-half-full.png");
        var emptyCircleIcon = new Image();
        emptyCircleIcon.src = require("../assets/icons/circle-outline.png");
        var maxNameWidth = 0;

        skills.forEach(skill => {
            var widthNedeed = this.doc.getTextWidth(skill.name);
            if (widthNedeed > maxNameWidth) {
                maxNameWidth = widthNedeed;
            }
        });

        skills.forEach(skill => {
            this.doc.setTextColor(this.conf.color.primary);
            this._isEnoughSpace(this.conf.height.content);
            this.doc.text(skill.name, offset, this.heightRef);


            var fullCircles = Math.floor(skill.level);
            var halfCircle = ((skill.level % fullCircles) == 0.0) ? false : true;
            var emptyCircles = 5 - Math.ceil(skill.level);

            var startX = maxNameWidth + 5 + offset;
            for (let i = 0; i < fullCircles; i++) {
                this.doc.addImage(fullCircleIcon, startX, this.heightRef - 3, 4, 4);
                startX += 5;
            }
            if (halfCircle) {
                this.doc.addImage(halfCircleIcon, startX, this.heightRef - 3, 4, 4);
                startX += 5;
            }
            for (let i = 0; i < emptyCircles; i++) {
                this.doc.addImage(emptyCircleIcon, startX, this.heightRef - 3, 4, 4);
                startX += 5;
            }

            this.heightRef += this.conf.height.content;
        });
    }

    _addEducation(items) {
        this._addHeader("EDUCATION");

        items.forEach((item, index) => {
            this.doc.setFont(this.conf.font.subHeader, "normal");
            this.doc.setTextColor(this.conf.color.primary);
            this.doc.setFontSize(this.conf.text.subHeader);
            this._isEnoughSpace(this.conf.height.subHeader);
            this.doc.text(item.degree, this.totalLeftMargin, this.heightRef);
            this.heightRef += this.conf.height.subHeader;
            this.doc.setFont(this.conf.font.subHeaderTagline, "normal");
            this.doc.setFontSize(this.conf.text.subHeader);
            this._isEnoughSpace(this.conf.height.subHeader);
            this.doc.text(`${item.time} | ${item.university}`, this.totalLeftMargin, this.heightRef);
            this.heightRef += this.conf.height.subHeader;
            if (item.details) {
                item.details.forEach(detail => {
                    this._printMultiLine(detail, true);
                });
            } else {
                this.heightRef -= (this.conf.height.subHeader - this.conf.height.content);  // normalize height
            }

            if (index != items.length - 1) {
                this.heightRef += this.conf.height.content;
            }
        });
        this.heightRef += this.conf.height.normalize; // normalize height
        this.heightRef += this.conf.margin.between;
    }

    _addCourses(courses) {
        this._addHeader("COURSES");

        courses.forEach(course => {
            this._printMultiLine(course, true)
        });
        this.heightRef += this.conf.height.normalize; // normalize height
        this.heightRef += this.conf.margin.between;
    }

    _printMultiLine(line, isListElement) {
        const boldRegex = /(\*{2})+/g;
        const splitRegex = /(\*{2}[^*]*\*{2})/g;
        this.doc.setFont(this.conf.font.content, "normal");
        this.doc.setFontSize(this.conf.text.content);
        this.doc.setTextColor(this.conf.color.primary);
        var startPage = this.currentPage;
        var initStartX = this.totalLeftMargin;
        var max_X = null;

        if (this.conf.sidebarRight) {
            max_X = this.doc.internal.pageSize.width - this.conf.sidebarWidth - this.conf.margin.right;
        } else {
            max_X = this.doc.internal.pageSize.width - this.conf.margin.right;
        }

        if (isListElement) {
            this.doc.text("\u2022", this.totalLeftMargin + this.conf.margin.list - 2, this.heightRef)
            initStartX += this.conf.margin.list;
        }

        var currentX = initStartX;
        const splitByBolds = line.split(splitRegex);

        splitByBolds.forEach(part => {
            if (!part.startsWith(" ") && currentX != initStartX) {
                currentX -= this.doc.getStringUnitWidth(" ") * 3;
            }

            if (part.startsWith("**") && part.endsWith("**")) {
                part = part.replace(boldRegex, "");
                this.doc.setFont(this.conf.font.contentBold, "normal");
            } else {
                this.doc.setFont(this.conf.font.content, "normal");
            }
            var words = part.split(" ");
            words.forEach(word => {
                var widthNedeed = this.doc.getTextWidth(word);

                if ((widthNedeed + currentX) > max_X) {
                    currentX = initStartX;
                    this._isEnoughSpace(this.conf.height.content);
                    if (this.currentPage == startPage) {
                        this.heightRef += this.conf.height.content;
                    } else {
                        startPage++;
                    }
                }
                this.doc.text(word, currentX, this.heightRef);
                currentX += widthNedeed;
                currentX += this.doc.getStringUnitWidth(" ") * 3;
            });
        });
        this.heightRef += this.conf.height.content;
    }

    _isEnoughSpace(heightNedeed) {
        if ((this.heightRef + heightNedeed) > (this.doc.internal.pageSize.height - this.conf.margin.bottom)) {
            this._setPage(this.currentPage + 1);
        }
    }

    _setPage(page) {
        const pages = this.doc.getNumberOfPages();
        if (pages >= page) {
            this.doc.setPage(page);
        } else {
            this.doc.addPage();
        }
        this.currentPage = page;
        this.heightRef = this.conf.margin.top;
    }

    _reset() {
        this.doc = new jsPDF();
        this.conf = this.initConf;
        this.heightRef = this.conf.margin.top;
        this.currentPage = 1;
    }
}