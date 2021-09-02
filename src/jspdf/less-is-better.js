import { jsPDF } from "jspdf";
import Roboto from "../assets/fonts/Roboto-Regular-normal.js";
import RobotoBold from "../assets/fonts/Roboto-Bold-normal.js";
import HKGroteskBold from "../assets/fonts/HKGrotesk-Bold-normal.js";
import HKGroteskRegular from "../assets/fonts/HKGrotesk-Regular-normal.js";
import PoppinsLight from "../assets/fonts/Poppins-Light-normal.js";
import PoppinsBold from "../assets/fonts/Poppins-Bold-normal.js";

export class LessIsBetter {
    constructor() {
        this.doc = new jsPDF();
        this.doc.addFileToVFS("Roboto-Regular.ttf", Roboto);
        this.doc.addFileToVFS("Roboto-Bold.ttf", RobotoBold);
        this.doc.addFileToVFS("HKGrotesk-Bold.ttf", HKGroteskBold);
        this.doc.addFileToVFS("HKGrotesk-Regular.ttf", HKGroteskRegular);
        this.doc.addFileToVFS("Poppins-Light.ttf", PoppinsLight);
        this.doc.addFileToVFS("Poppins-Bold.ttf", PoppinsBold);
        this.config = {
            sidebarWidth: 70,
            text: {
                name: 35,
                tagline: 16,
                header: 18,
                sidebarContent: 12,
                subHeader: 10,
                content: 9,
            },
            margin: {
                top: 20,
                bottom: 20,
                left: 15,
                inner: 15,
                between: 10,
                list: 5,
            },
            color: {
                white: "#ffffff",
                black: "#000000",
                gray: "#4d4e53",
            },
            headerLineHeight: 8,
            lineHeight: 6,
            subLineHeight: 4,
        };
        this.heightRef = this.config.margin.top;
        this.currentPage = 1;
    }

    static schema() {
        return {
            type: "object",
            properties: {
                name: { type: "string" },
                lastname: { type: "string" },
                tagline: { type: "string" },
                email: { type: "string" },
                phone: { type: "string" },
                linkedin: { type: "string" },
                github: { type: "string" },
                website: { type: "string" },
                twitter: { type: "string" },
                stackoverflow: { type: "string" },
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
                "email",
                "phone",
                "education",
                "experience",
                "skills",
            ],
            additionalProperties: false,
        };
    }

    static defaultOptions() {
        return {
            sidebarWidth: 70,
            text: {
                name: 35,
                tagline: 16,
                header: 18,
                sidebarContent: 12,
                subHeader: 10,
                content: 9,
            },
            margin: {
                top: 20,
                bottom: 20,
                left: 15,
                inner: 15,
                between: 10,
                list: 5,
            },
            headerLineHeight: 8,
            lineHeight: 6,
            subLineHeight: 4,
        }
    }

    generatePDF(data, options = null) {
        if (options) {
            this.config = {
                ...this.config,
                ...options,
            }
            this.heightRef = this.config.margin.top;
        }

        if (data.about) {
            this._addAbout(data.about);
        }
        this._addExperience(data.experience);
        if (data.projects) {
            this._addProjects(data.projects);
        }
        this._addSkills(data.skills, data.skills2Rows);
        this._addEducation(data.education);
        if (data.courses) {
            this._addCourses(data.courses);
        }

        const pages = this.doc.getNumberOfPages();

        if (pages == 1) {
            this._addSidebar(data, true, true);
        } else {
            for (let j = 1; j < pages + 1; j++) {
                this._setPage(j);
                if (j == 1) {
                    this._addSidebar(data, true, false);
                } else if (j == 2) {
                    this._addSidebar(data, false, true);
                } else {
                    this._addSidebar(data, false, false);
                }

                if (data.numPages) {
                    this.doc.setFont("Roboto-Regular", "normal");
                    this.doc.setFontSize(8);
                    this.doc.setTextColor(this.config.color.gray);
                    this.doc.text(
                        `${j} / ${pages}`,
                        this.config.margin.left,
                        this.doc.internal.pageSize.height - 6
                    ); 1
                }
            }
        }
        this.doc.save("resume.pdf");
        this._reset();
    }

    _addSidebar(data, withContact, withExtras) {
        var docHeight = this.doc.internal.pageSize.height;
        var docWidth = this.doc.internal.pageSize.width;

        this.doc.rect(docWidth - this.config.sidebarWidth, 0, docWidth, docHeight, "F");
        this.doc.setFont("HKGrotesk-Bold", "normal");
        this.doc.setFontSize(this.config.text.name);
        this.doc.setTextColor(this.config.color.white);

        this.doc.text(data.name.toUpperCase(), 182, this.config.margin.top - 5, {
            angle: -90,
            charSpace: 1,
        });
        this.doc.text(data.lastname.toUpperCase(), 170, this.config.margin.top - 5, {
            angle: -90,
            charSpace: 1,
        });
        this.doc.setFont("Poppins-Light", "normal");
        this.doc.setFontSize(this.config.text.tagline);
        this.doc.text(data.tagline.toUpperCase(), 162, this.config.margin.top - 4, {
            angle: -90,
            charSpace: 1,
        });

        var sidebarHeightRef = docHeight - this.config.margin.bottom;
        var sidebarMargin = (docWidth - this.config.sidebarWidth) + this.config.margin.inner;

        if (withContact) {
            this.doc.setFontSize(this.config.text.sidebarContent);
            sidebarHeightRef -= 7; // normalize height

            if (data.stackoverflow) {
                var stackOverflow = new Image();
                stackOverflow.src = require("../assets/icons/stack-overflow-white.png");
                this.doc.addImage(stackOverflow, sidebarMargin, sidebarHeightRef, 7, 7);
                this.doc.textWithLink(
                    "stackoverflow",
                    sidebarMargin + 8,
                    sidebarHeightRef + 5,
                    {
                        url: data.stackoverflow,
                    }
                );

                sidebarHeightRef -= this.config.headerLineHeight;
            }

            if (data.twitter) {
                var twitter = new Image();
                twitter.src = require("../assets/icons/twitter-white.png");
                this.doc.addImage(twitter, sidebarMargin, sidebarHeightRef, 7, 7);
                this.doc.textWithLink(
                    data.twitter,
                    sidebarMargin + 8,
                    sidebarHeightRef + 5,
                    {
                        url: `https://twitter.com/${data.twitter}`,
                    }
                );

                sidebarHeightRef -= this.config.headerLineHeight;
            }

            if (data.website) {
                var website = new Image();
                website.src = require("../assets/icons/web-white.png");
                this.doc.addImage(website, sidebarMargin, sidebarHeightRef, 7, 7);
                this.doc.textWithLink(
                    data.website,
                    sidebarMargin + 8,
                    sidebarHeightRef + 5,
                    {
                        url: `https://${data.website}`,
                    }
                );

                sidebarHeightRef -= this.config.headerLineHeight;
            }


            if (data.linkedin) {
                var linkedin = new Image();
                linkedin.src = require("../assets/icons/linkedin-white.png");
                this.doc.addImage(linkedin, sidebarMargin, sidebarHeightRef, 7, 7);
                this.doc.textWithLink(
                    data.linkedin,
                    sidebarMargin + 8,
                    sidebarHeightRef + 5,
                    {
                        url: `https://linkedin.com/in/${data.linkedin}`,
                    }
                );

                sidebarHeightRef -= this.config.headerLineHeight;
            }

            if (data.github) {
                var github = new Image();
                github.src = require("../assets/icons/github-white.png");
                this.doc.addImage(github, sidebarMargin, sidebarHeightRef, 7, 7);
                this.doc.textWithLink(
                    data.github,
                    sidebarMargin + 8,
                    sidebarHeightRef + 5,
                    {
                        url: `https://github.com/${data.github}`,
                    }
                );

                sidebarHeightRef -= this.config.headerLineHeight;
            }

            var phone = new Image();
            phone.src = require("../assets/icons/phone-white.png");
            this.doc.addImage(phone, sidebarMargin, sidebarHeightRef, 7, 7);
            this.doc.text(data.phone, sidebarMargin + 8, sidebarHeightRef + 5);

            sidebarHeightRef -= this.config.headerLineHeight;

            var email = new Image();
            email.src = require("../assets/icons/email-white.png");
            this.doc.addImage(email, sidebarMargin, sidebarHeightRef, 7, 7);
            this.doc.text(data.email, sidebarMargin + 8, sidebarHeightRef + 5);

            sidebarHeightRef -= this.config.subLineHeight;
            this.doc.setFont("Roboto-Bold", "normal");
            this.doc.setFontSize(this.config.text.header);
            this.doc.text("CONTACT", sidebarMargin, sidebarHeightRef);
            sidebarHeightRef -= this.config.headerLineHeight * 2;
        }

        if (withExtras) {
            if (data.languages) {
                this.doc.setFont("Poppins-Light", "normal");
                this.doc.setFontSize(this.config.text.sidebarContent);
                data.languages.reverse().forEach(lang => {
                    this.doc.text(`${lang.name} (${lang.level})`, sidebarMargin, sidebarHeightRef);
                    sidebarHeightRef -= this.config.headerLineHeight;
                });

                this.doc.setFont("Roboto-Bold", "normal");
                this.doc.setFontSize(this.config.text.header);
                this.doc.text("LANGUAGES", sidebarMargin, sidebarHeightRef);
                sidebarHeightRef -= this.config.headerLineHeight * 2;
            }

            if (data.interests) {
                this.doc.setFont("Poppins-Light", "normal");
                this.doc.setFontSize(this.config.text.sidebarContent);
                data.interests.reverse().forEach(item => {
                    if (item.link) {
                        this.doc.textWithLink(item.name, sidebarMargin, sidebarHeightRef, {
                            url: item.link,
                        });
                    } else {
                        this.doc.text(item.name, sidebarMargin, sidebarHeightRef);
                    }
                    sidebarHeightRef -= this.config.headerLineHeight;
                });

                this.doc.setFont("Roboto-Bold", "normal");
                this.doc.setFontSize(this.config.text.header);
                this.doc.text("INTERESTS", sidebarMargin, sidebarHeightRef);
                sidebarHeightRef -= this.config.headerLineHeight * 2;
            }
        }
    }

    _addHeader(name) {
        this.doc.setFont("HKGrotesk-Bold", "normal");
        this.doc.setTextColor(this.config.color.black);
        this.doc.setFontSize(this.config.text.header);
        this._isEnoughSpace(this.config.headerLineHeight);
        this.doc.text(name, this.config.margin.left, this.heightRef);
        this.heightRef += this.config.headerLineHeight;
    }

    _addAbout(content) {
        this._addHeader("ABOUT ME");
        this._printMultiLine(content, false);
        this.heightRef += 2; //normalize height
        this.heightRef += this.config.margin.between;
    }

    _addEducation(items) {
        this._addHeader("EDUCATION");

        items.forEach(item => {
            this.doc.setFont("HKGrotesk-Bold", "normal");
            this.doc.setTextColor(this.config.color.black);
            this.doc.setFontSize(this.config.text.subHeader);
            this._isEnoughSpace(this.config.subLineHeight);
            this.doc.text(item.degree, this.config.margin.left, this.heightRef);
            this.heightRef += this.config.subLineHeight;
            this.doc.setFont("HKGrotesk-Regular", "normal");
            this.doc.setFontSize(this.config.text.subHeader);
            this._isEnoughSpace(this.config.subLineHeight);
            this.doc.text(`${item.time} | ${item.university}`, this.config.margin.left, this.heightRef);
            this.heightRef += this.config.subLineHeight;
            this.heightRef += 1; //normalize height
            if (item.details) {
                item.details.forEach(detail => {
                    this._printMultiLine(detail, true);
                });
                this.heightRef += 2; //normalize height
            } else {
                this.heightRef += 1; //normalize height
            }
        });
        this.heightRef += this.config.margin.between;
    }

    _addExperience(jobs) {
        this._addHeader("EXPERIENCE");

        jobs.forEach(job => {
            this.doc.setFont("HKGrotesk-Bold", "normal");
            this.doc.setTextColor(this.config.color.black);
            this.doc.setFontSize(this.config.text.subHeader);
            this._isEnoughSpace(this.config.subLineHeight);
            this.doc.text(job.role, this.config.margin.left, this.heightRef);
            this.heightRef += this.config.subLineHeight;
            this.doc.setFont("HKGrotesk-Regular", "normal");
            this.doc.setFontSize(this.config.text.subHeader);
            this._isEnoughSpace(this.config.subLineHeight);
            this.doc.text(`${job.time} | ${job.company}`, this.config.margin.left, this.heightRef);
            this.heightRef += this.config.subLineHeight;
            this.heightRef += 1; //normalize height
            if (job.details) {
                job.details.forEach(detail => {
                    this._printMultiLine(detail, true);
                });
                this.heightRef += 2; //normalize height
            } else {
                this.heightRef += 1; //normalize height
            }
        });
        this.heightRef += this.config.margin.between;
    }

    _addProjects(projects) {
        this._addHeader("PROJECTS");

        if (projects.details) {
            this._printMultiLine(projects.details, false);
            this.heightRef += 2; //normalize height
        }
        projects.items.forEach(project => {
            this.doc.setFont("HKGrotesk-Bold", "normal");
            this.doc.setTextColor(this.config.color.black);
            this.doc.setFontSize(this.config.text.subHeader);
            this._isEnoughSpace(this.config.subLineHeight);
            if (project.link) {
                this.doc.textWithLink(project.name, this.config.margin.left, this.heightRef, {
                    url: project.link,
                });
            } else {
                this.doc.text(project.name, this.config.margin.left, this.heightRef);
            }
            this.heightRef += this.config.subLineHeight;
            this.doc.setFont("HKGrotesk-Regular", "normal");
            this.doc.setFontSize(this.config.text.subHeader);
            this._isEnoughSpace(this.config.subLineHeight);
            this.doc.text(project.tagline, this.config.margin.left, this.heightRef);
            this.heightRef += this.config.subLineHeight;
            this.heightRef += 1; //normalize height
            this._printMultiLine(project.details, true);
            this.heightRef += 2; //normalize height
        });
        this.heightRef += this.config.margin.between;
    }

    _addSkills(skills, twoRows) {
        this._addHeader("SKILLS");
        const initHeightRef = this.heightRef;
        const initPage = this.currentPage;

        if (twoRows) {
            const half = Math.ceil(skills.length / 2);

            const firstRow = skills.slice(0, half);
            const secondRow = skills.slice(-half);
            this._addSkillsRow(firstRow, this.config.margin.left);
            if (initPage != this.currentPage) {
                this._setPage(initPage);
            }
            this.heightRef = initHeightRef;
            const secondRowOfset = ((this.doc.internal.pageSize.width - this.config.sidebarWidth - this.config.margin.inner - this.config.margin.left) / 2) + this.config.margin.left;
            this._addSkillsRow(secondRow, secondRowOfset);
        } else {
            this._addSkillsRow(skills, this.config.margin.left);
        }
        this.heightRef += 2; //normalize height
        this.heightRef += this.config.margin.between;
    }

    _addSkillsRow(skills, offset) {
        this.doc.setFont("Poppins-Light", "normal");
        this.doc.setTextColor(this.config.color.black);
        this.doc.setFontSize(this.config.text.content);

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
            this.doc.setTextColor(this.config.color.black);
            this._isEnoughSpace(this.config.subLineHeight);
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

            this.heightRef += this.config.subLineHeight;
        });
    }

    _addCourses(courses) {
        this._addHeader("COURSES");

        // this.doc.setFont("HKGrotesk-Bold", "normal");
        // this.doc.setTextColor(this.config.color.black);
        // this.doc.setFontSize(this.config.text.subHeader);

        courses.forEach(course => {
            // this._isEnoughSpace(this.config.subLineHeight);
            // this.doc.text(course, this.config.margin.left, this.heightRef);
            // this.heightRef += this.config.subLineHeight;
            this._printMultiLine(course, true)
        });
        this.heightRef += this.config.margin.between;
    }

    _printMultiLine(line, isListElement) {
        const boldRegex = /(\*{2})+/g;
        const splitRegex = /(\*{2}[^*]*\*{2})/g;
        this.doc.setFont("Poppins-Light", "normal");
        this.doc.setTextColor(this.config.color.black);
        this.doc.setFontSize(this.config.text.content);
        var startPage = this.currentPage;
        var initStartX = null;
        var max_width = null;

        // debug
        // this.doc.setDrawColor('#ff0000');
        // this.doc.setLineWidth(1);
        // this.doc.line(initStartX, 0, initStartX, 270);
        // this.doc.line(max_width, 0, max_width, 270);

        if (isListElement) {
            this.doc.text("\u2022", this.config.margin.left + this.config.margin.list - 2, this.heightRef)
            max_width = this.doc.internal.pageSize.width - this.config.sidebarWidth - this.config.margin.inner - this.config.margin.list;
            initStartX = this.config.margin.left + this.config.margin.list;

        } else {
            max_width = this.doc.internal.pageSize.width - this.config.sidebarWidth - this.config.margin.inner;
            initStartX = this.config.margin.left;
        }
        var currentX = initStartX;
        const splitByBolds = line.split(splitRegex);

        splitByBolds.forEach(part => {
            if (part.startsWith("**") && part.endsWith("**")) {
                part = part.replace(boldRegex, "");
                this.doc.setFont("Poppins-Bold", "normal");
            } else {
                this.doc.setFont("Poppins-Light", "normal");
            }
            var words = part.split(" ");
            words.forEach(word => {
                var widthNedeed = this.doc.getTextWidth(word);

                if ((widthNedeed + currentX) > max_width) {
                    currentX = initStartX;
                    this._isEnoughSpace(this.config.subLineHeight);
                    if (this.currentPage == startPage) {
                        this.heightRef += this.config.subLineHeight;
                    } else {
                        startPage++;
                    }
                }
                this.doc.text(word, currentX, this.heightRef);
                currentX += widthNedeed;
                currentX += this.doc.getStringUnitWidth(" ") * 3;
            });
        });
        this.heightRef += this.config.subLineHeight;
    }

    _isEnoughSpace(heightNedeed) {
        if ((this.heightRef + heightNedeed) > (this.doc.internal.pageSize.height - this.config.margin.bottom)) {
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
        this.heightRef = this.config.margin.top;
    }

    _reset() {
        this.doc = new jsPDF();
        this.heightRef = this.config.margin.top;
        this.currentPage = 1;
    }
}
