import { jsPDF } from "jspdf";

export class BaseTemplate {
    constructor(conf) {
        if (this.constructor == BaseTemplate) {
            throw new Error("Abstract classes can't be instantiated.");
        }

        this.doc = new jsPDF();
        this.initConf = conf;
        this.conf = conf;
        this.y = this.conf.margin.top;
        this.x = this.conf.margin.left;
        this.max_x = this.doc.internal.pageSize.width - this.conf.margin.right;
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

    static editableOptions() {
        throw new Error("Method 'editableOptions()' must be implemented.");
    }

    generatePDF() {
        throw new Error("Method 'generate(data, options = null)' must be implemented.");
    }

    _addSectionHeader() {
        throw new Error("Method '_addSectionHeader(name)' must be implemented.");
    }

    _addAbout(content) {
        this._addSectionHeader("ABOUT ME");
        this._printMultiLine(content, false);
        this.y += this.conf.height.normalize; // normalize height
        this.y += this.conf.margin.section;
    }

    _addExperience(jobs) {
        this._addSectionHeader("EXPERIENCE");

        jobs.forEach((job, index) => {
            this.doc.setFont(this.conf.font.header, "normal");
            this.doc.setTextColor(this.conf.color.header);
            this.doc.setFontSize(this.conf.text.header);
            this._isEnoughSpace(this.conf.height.header);
            this.doc.text(job.role, this.x, this.y);
            this.y += this.conf.height.header;
            this.doc.setFont(this.conf.font.subheader, "normal");
            this.doc.setFontSize(this.conf.text.subheader);
            this._isEnoughSpace(this.conf.height.subheader);
            this.doc.text(`${job.time} | ${job.company}`, this.x, this.y);
            this.y += this.conf.height.subheader;
            if (job.details) {
                job.details.forEach(detail => {
                    this._printMultiLine(detail, true);
                });
            } else {
                this.y -= (this.conf.height.subheader - this.conf.height.content);  // normalize height
            }

            if (index != jobs.length - 1) {
                this.y += this.conf.height.content;
            }
        });
        this.y += this.conf.height.normalize; // normalize height
        this.y += this.conf.margin.section;
    }

    _addProjects(projects) {
        this._addSectionHeader("PROJECTS");

        if (projects.details) {
            this._printMultiLine(projects.details, false);
            this.y += this.conf.height.content; //normalize height
        }
        projects.items.forEach((project, index) => {
            this.doc.setFont(this.conf.font.header, "normal");
            this.doc.setTextColor(this.conf.color.header);
            this.doc.setFontSize(this.conf.text.header);
            this._isEnoughSpace(this.conf.height.header);
            if (project.link) {
                this.doc.textWithLink(project.name, this.x, this.y, {
                    url: project.link,
                });
            } else {
                this.doc.text(project.name, this.x, this.y);
            }
            this.y += this.conf.height.header;
            this.doc.setFont(this.conf.font.subheader, "normal");
            this.doc.setFontSize(this.conf.text.subheader);
            this._isEnoughSpace(this.conf.height.subheader);
            this.doc.text(project.tagline, this.x, this.y);
            this.y += this.conf.height.subheader;
            this._printMultiLine(project.details, true);
            if (index != projects.items.length - 1) {
                this.y += this.conf.height.content; //normalize height
            }
        });
        this.y += this.conf.height.normalize; // normalize height
        this.y += this.conf.margin.section;
    }

    _addSkills(skills, twoRows) {
        this._addSectionHeader("SKILLS");
        const initHeightRef = this.y;
        const initPage = this.currentPage;

        if (twoRows) {
            const half = Math.ceil(skills.length / 2);

            const firstRow = skills.slice(0, half);
            const secondRow = skills.slice(-half);
            this._addSkillsRow(firstRow, this.x);
            if (initPage != this.currentPage) {
                this._setPage(initPage);
            }
            this.y = initHeightRef;
            const secondRowOfset = ((this.doc.internal.pageSize.width - this.conf.margin.right - this.conf.margin.left - this.conf.sidebarWidth) / 2) + this.x;
            this._addSkillsRow(secondRow, secondRowOfset);
        } else {
            this._addSkillsRow(skills, this.x);
        }
        this.y += this.conf.height.normalize; //normalize height
        this.y += this.conf.margin.section;
    }

    _addSkillsRow(skills, offset) {
        this.doc.setFont(this.conf.font.content, "normal");
        this.doc.setTextColor(this.conf.color.content);
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
            this.doc.setTextColor(this.conf.color.content);
            this._isEnoughSpace(this.conf.height.content);
            this.doc.text(skill.name, offset, this.y);


            var fullCircles = Math.floor(skill.level);
            var halfCircle = ((skill.level % fullCircles) == 0.0) ? false : true;
            var emptyCircles = 5 - Math.ceil(skill.level);

            var startX = maxNameWidth + 5 + offset;
            for (let i = 0; i < fullCircles; i++) {
                this.doc.addImage(fullCircleIcon, startX, this.y - 3, 4, 4);
                startX += 5;
            }
            if (halfCircle) {
                this.doc.addImage(halfCircleIcon, startX, this.y - 3, 4, 4);
                startX += 5;
            }
            for (let i = 0; i < emptyCircles; i++) {
                this.doc.addImage(emptyCircleIcon, startX, this.y - 3, 4, 4);
                startX += 5;
            }

            this.y += this.conf.height.content;
        });
    }

    _addEducation(items) {
        this._addSectionHeader("EDUCATION");

        items.forEach((item, index) => {
            this.doc.setFont(this.conf.font.header, "normal");
            this.doc.setTextColor(this.conf.color.header);
            this.doc.setFontSize(this.conf.text.header);
            this._isEnoughSpace(this.conf.height.header);
            this.doc.text(item.degree, this.x, this.y);
            this.y += this.conf.height.header;
            this.doc.setFont(this.conf.font.subheader, "normal");
            this.doc.setFontSize(this.conf.text.subheader);
            this._isEnoughSpace(this.conf.height.subheader);
            this.doc.text(`${item.time} | ${item.university}`, this.x, this.y);
            this.y += this.conf.height.subheader;
            if (item.details) {
                item.details.forEach(detail => {
                    this._printMultiLine(detail, true);
                });
            } else {
                this.y -= (this.conf.height.subheader - this.conf.height.content);  // normalize height
            }

            if (index != items.length - 1) {
                this.y += this.conf.height.content;
            }
        });
        this.y += this.conf.height.normalize; // normalize height
        this.y += this.conf.margin.section;
    }

    _addCourses(courses) {
        this._addSectionHeader("COURSES");

        courses.forEach(course => {
            this._printMultiLine(course, true)
        });
        this.y += this.conf.height.normalize; // normalize height
        this.y += this.conf.margin.section;
    }

    _printMultiLine(line, isListElement) {
        const boldRegex = /(\*{2})+/g;
        const splitRegex = /(\*{2}[^*]*\*{2})/g;
        this.doc.setFont(this.conf.font.content, "normal");
        this.doc.setFontSize(this.conf.text.content);
        this.doc.setTextColor(this.conf.color.content);
        var init_x = this.x;
        var max_x = this.max_x;

        if (isListElement) {
            this.doc.text("\u2022", init_x + this.conf.margin.list - 2, this.y)
            init_x += this.conf.margin.list;
        }

        var currentX = init_x;
        const splitByBolds = line.split(splitRegex);

        splitByBolds.forEach(part => {
            if (!part.startsWith(" ") && currentX != init_x) {
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

                if ((widthNedeed + currentX) > max_x) {
                    if (this._isEnoughSpace(this.conf.height.content)) {
                        this.y += this.conf.height.content;
                    } else {
                        init_x = this.x;
                        max_x = this.max_x;
                    }
                    currentX = init_x;
                }
                this.doc.text(word, currentX, this.y);
                currentX += widthNedeed;
                currentX += this.doc.getStringUnitWidth(" ") * 3;
            });
        });
        this.y += this.conf.height.content;
    }

    _isEnoughSpace(heightNedeed) {
        if ((this.y + heightNedeed) > (this.doc.internal.pageSize.height - this.conf.margin.bottom)) {
            this._setPage(this.currentPage + 1);
            return false;
        }
        return true;
    }

    _setPage(page) {
        const pages = this.doc.getNumberOfPages();
        if (pages >= page) {
            this.doc.setPage(page);
        } else {
            this.doc.addPage();
        }
        this.currentPage = page;
        this.y = this.conf.margin.top;
    }

    _numberPages(right = true) {
        const pages = this.doc.getNumberOfPages();
        var aligin = "left"
        var x = this.conf.margin.left;

        if (right) {
            aligin = "right"
            x = this.doc.internal.pageSize.width - this.conf.margin.right;
        }

        for (let j = 1; j < pages + 1; j++) {
            this._setPage(j);

            this.doc.setFont(this.conf.font.pageNumber, "normal");
            this.doc.setFontSize(8);
            this.doc.setTextColor(this.conf.color.pageNum);
            this.doc.text(
                `${j} / ${pages}`,
                x,
                this.doc.internal.pageSize.height - 6,
                aligin
            );
        }
    }

    _reset() {
        this.doc = new jsPDF();
        this.conf = this.initConf;
        this.y = this.conf.margin.top;
        this.currentPage = 1;
    }
}