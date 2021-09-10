import { jsPDF } from "jspdf";
import { BaseTemplate } from "./base.js";
import Roboto from "../assets/fonts/Roboto-Regular-normal.js";
import RobotoBold from "../assets/fonts/Roboto-Bold-normal.js";
import MontserratMedium from "../assets/fonts/Montserrat-Medium-normal.js";

export class LetsTalkAboutIt extends BaseTemplate {
    constructor() {
        const conf = {
            text: {
                name: 35,
                title: 16,
                header: 16,
                subHeader: 14,
                tagline: 11,
                iconline: 10,
                content: 10,
            },
            font: {
                pageNumber: "Roboto-Regular",
                content: "Roboto-Regular",
                contentBold: "Roboto-Bold",
            },
            margin: {
                top: 20,
                bottom: 15,
                left: 10,
                right: 10,
                between: 4,
                list: 2,
                column: 5,
                content: 10,
            },
            color: {
                white: "#ffffff",
                black: "#000000",
                pageNum: "#4d4e53",
                subHeader: "#000000",
                content: "#3D3D3D",
                secondary: "#A7A9AC",
                primary: "#0462F6",
            },
            height: {
                name: 8,
                title: 8,
                header: 18,
                subHeader: 5,
                tagline: 5,
                iconline: 5,
                content: 4,
                normalize: -4,
            },
        }
        super(conf);
        this.doc.addFileToVFS("Roboto-Regular.ttf", Roboto);
        this.doc.addFileToVFS("Roboto-Bold.ttf", RobotoBold);
        this.doc.addFileToVFS("Montserrat-Medium.ttf", MontserratMedium);
        this.center = this.doc.internal.pageSize.width / 2;
        this.y = this.conf.margin.top;
        this.x = this.conf.margin.left + this.conf.margin.content;
        this.max_x = this.center - this.conf.margin.column;
        this.rowLeft = true;
        this.currentPage = 1;
        this.currentHeader = null;
        this.currentIcon = null;
    }

    static schema() {
        return {
            type: "object",
            properties: {
                name: { type: "string" },
                lastname: { type: "string" },
                title: { type: "string" },
                contact: {
                    type: "object",
                    properties: {
                        email: { type: "string" },
                        phone: { type: "string" },
                        github: { type: "string" },
                        website: { type: "string" },
                    },
                    required: ["email", "phone"],
                },
                about: {
                    type: "object",
                    properties: {
                        displayName: { type: "string" },
                        content: { type: "string" },
                    },
                    required: ["displayName", "content"],
                },
                education: {
                    type: "object",
                    properties: {
                        displayName: { type: "string" },
                        items: {
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
                    },
                    required: ["displayName", "items"],
                },
                experience: {
                    type: "object",
                    properties: {
                        displayName: { type: "string" },
                        items: {
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
                    },
                    required: ["displayName", "items"],
                },
                projects: {
                    type: "object",
                    properties: {
                        displayName: { type: "string" },
                        details: { type: "string" },
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
                    required: ["displayName", "items"],
                },
                skills: {
                    type: "object",
                    properties: {
                        displayName: { type: "string" },
                        items: {
                            type: "array",
                            minItems: 1,
                            items: {
                                type: "object",
                                properties: {
                                    displayName: { type: "string" },
                                    items: {
                                        type: "array",
                                        minItems: 1,
                                        items: {
                                            type: "object",
                                            properties: {
                                                name: { type: "string" },
                                                level: { type: "string" },
                                            },
                                            required: ["name", "level"],
                                        },
                                    },
                                },
                                required: ["displayName", "items"],
                            },
                        },
                    },
                    required: ["displayName", "items"],
                },
                courses: {
                    type: "object",
                    properties: {
                        displayName: { type: "string" },
                        items: {
                            type: "array",
                            minItems: 1,
                            items: { type: "string" },
                        },
                    },
                    required: ["displayName", "items"],
                },
                numerPages: {
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
        return {
            model: {
                text: {
                    name: 35,
                    subHeader: 14,
                    content: 10,
                },
                margin: {
                    top: 20,
                    bottom: 15,
                    left: 10,
                    right: 10,
                    between: 4,
                    list: 2,
                    column: 5,
                    content: 10,
                },
                height: {
                    name: 8,
                    subHeader: 5,
                    content: 4,
                },
            },
            text: [
                {
                    label: "Name",
                    key: "name",
                    min: 20,
                    max: 45,
                },
                {
                    label: "Subheader",
                    key: "subHeader",
                    min: 10,
                    max: 15,
                },
                {
                    label: "Content",
                    key: "content",
                    min: 8,
                    max: 12,
                }
            ],
            margin: [
                {
                    label: "Top",
                    key: "top",
                    min: 5,
                    max: 30,
                },
                {
                    label: "Bottom",
                    key: "bottom",
                    min: 5,
                    max: 30,
                },
                {
                    label: "Left",
                    key: "left",
                    min: 5,
                    max: 25,
                },
                {
                    label: "Right",
                    key: "right",
                    min: 5,
                    max: 25,
                },
                {
                    label: "Sidebar",
                    key: "sidebar",
                    min: 1,
                    max: 20,
                },
                {
                    label: "Between",
                    key: "between",
                    min: 1,
                    max: 15,
                },
                {
                    label: "List",
                    key: "list",
                    min: 2,
                    max: 10,
                },
            ],
            height: [
                {
                    label: "Name",
                    key: "name",
                    min: 6,
                    max: 14,
                },
                {
                    label: "Subheader",
                    key: "subHeader",
                    min: 3,
                    max: 8,
                },
                {
                    label: "Content",
                    key: "content",
                    min: 3,
                    max: 6,
                }
            ]
        }
    }

    generatePDF(data, options = null) {
        if (options) {
            this.conf.text = {
                ...this.conf.text,
                ...options.text,
            }
            this.conf.margin = {
                ...this.conf.margin,
                ...options.margin,
            }
            this.conf.height = {
                ...this.conf.height,
                ...options.height,
            }
            this.y = this.conf.margin.top;
            this.x = this.conf.margin.left + this.conf.margin.content;
            this.max_x = this.center - this.conf.margin.column;
        }

        this._addTitle(data);
        this.row_1_start_y = this.y;
        if (data.about) {
            this._addAbout(data.about.content, data.about.displayName);
        }
        this._addExperience(data.experience.items, data.experience.displayName);
        if (data.projects) {
            this._addProjects(data.projects, data.projects.displayName);
        }
        this._addSkills(data.skills.items, data.skills.displayName);
        this._addEducation(data.education.items, data.education.displayName);
        if (data.courses) {
            this._addCourses(data.courses.items, data.courses.displayName);
        }
        if (data.numerPages) {
            this._numberPages();
        }
        this.doc.save("resume.pdf");
        this._reset();
    }

    _addTitle(data) {
        this.doc.setFont("Roboto-Bold", "normal");
        this.doc.setFontSize(this.conf.text.name);
        this.doc.setTextColor(this.conf.color.black);
        this.doc.text(`${data.name} ${data.lastname}`, this.x, this.y);
        this.y += this.conf.height.name;

        this.doc.setFontSize(this.conf.text.content);
        this.doc.text("Phone number:", this.x, this.y);
        var temp_x = this.doc.getTextWidth("Phone number: ")
        this.doc.setFont("Roboto-Regular", "normal");
        this.doc.setTextColor(this.conf.color.content);
        this.doc.text(data.contact.phone, this.x + temp_x, this.y);
        this.y += this.conf.height.content;

        this.doc.setFont("Roboto-Bold", "normal");
        this.doc.setTextColor(this.conf.color.black);
        this.doc.text("Email address:", this.x, this.y);
        temp_x = this.doc.getTextWidth("Email address: ")
        this.doc.setFont("Roboto-Regular", "normal");
        this.doc.setTextColor(this.conf.color.content);
        this.doc.text(data.contact.email, this.x + temp_x, this.y);

        if (data.contact.github) {
            this.y += this.conf.height.content;
            this.doc.setFont("Roboto-Bold", "normal");
            this.doc.setTextColor(this.conf.color.black);
            this.doc.text("GitHub:", this.x, this.y);
            temp_x = this.doc.getTextWidth("GitHub: ")
            this.doc.setFont("Roboto-Regular", "normal");
            this.doc.setTextColor(this.conf.color.content);
            this.doc.textWithLink(
                data.contact.github, this.x + temp_x, this.y,
                { url: `https://github.com/${data.contact.github}`, }
            );
        }

        if (data.contact.website) {
            this.y += this.conf.height.content;
            this.doc.setFont("Roboto-Bold", "normal");
            this.doc.setTextColor(this.conf.color.black);
            this.doc.text("Website:", this.x, this.y);
            temp_x = this.doc.getTextWidth("Website: ")
            this.doc.setFont("Roboto-Regular", "normal");
            this.doc.setTextColor(this.conf.color.content);
            this.doc.textWithLink(
                data.contact.website, this.x + temp_x, this.y,
                { url: `https://${data.contact.website}`, }
            );
        }

        const rectHeight = 10;
        this.y -= (rectHeight + 4);
        this.doc.setFont("Roboto-Bold", "normal");
        this.doc.setFontSize(this.conf.text.title);
        this.doc.setTextColor(this.conf.color.white);
        var len;
        if (data.title) {
            len = this.doc.getTextWidth(data.title);
        } else {
            len = 15;
        }
        const rectWidth = len + 6;
        const x = this.doc.internal.pageSize.width - this.conf.margin.right - rectWidth;
        this.doc.setFillColor("#0462F6");
        this.doc.triangle(
            x + 5, this.y + rectHeight - 1,
            x + 10, this.y + rectHeight - 1,
            x + 5, this.y + rectHeight + 4,
            "F"
        );
        this.doc.roundedRect(
            x, this.y,
            rectWidth, rectHeight,
            3, 3, "F"
        );
        if (data.title) {
            this.doc.text(data.title, x + 3, this.y + 7);
        }

        this.y += rectHeight + 4;
        this.y += this.conf.height.title;
    }

    _addHeader(name, icon, left) {
        this.currentHeader = name;
        this.currentIcon = icon;
        if (!this._isEnoughSpace(this.conf.height.header)) {
            return
        }

        const rectHeight = 10;
        var x;
        var rectWidth;

        if (left) {
            this.doc.setFillColor(this.conf.color.primary);
            rectWidth = this.center - this.conf.margin.column - this.conf.margin.left;
            x = this.conf.margin.left;
            this.doc.triangle(
                x + 5, this.y + rectHeight - 1,
                x + 10, this.y + rectHeight - 1,
                x + 5, this.y + rectHeight + 4,
                "F"
            );
        } else {
            this.doc.setFillColor(this.conf.color.secondary);
            rectWidth = this.center - this.conf.margin.column - this.conf.margin.right;
            x = this.center + this.conf.margin.column;
            this.doc.triangle(
                x + rectWidth - 5, this.y + rectHeight - 1,
                x + rectWidth - 10, this.y + rectHeight - 1,
                x + rectWidth - 5, this.y + rectHeight + 4,
                "F"
            );
        }

        this.doc.roundedRect(
            x, this.y,
            rectWidth, rectHeight,
            3, 3, "F"
        );

        this.doc.setFont("Roboto-Bold", "normal");
        this.doc.setFontSize(this.conf.text.header);
        this.doc.setTextColor(this.conf.color.white);
        this.doc.text(name, x + 10, this.y + 7);
        this.doc.addImage(icon, x + 2, this.y + 2, 6, 6);

        this.y += this.conf.height.header;
    }

    _addAbout(content, name = "Profile") {
        var icon = new Image();
        icon.src = require("../assets/icons/account-white.png");
        this._addHeader(name, icon, this.rowLeft);
        this._printMultiLine(content, false);
        this.y += this.conf.height.normalize; // normalize height
        this.y += this.conf.margin.between;
    }

    _addExperience(jobs, name = "Experience") {
        var icon = new Image();
        icon.src = require("../assets/icons/briefcase-white.png");
        this._addHeader(name, icon, this.rowLeft);

        var calendar = new Image();
        calendar.src = require("../assets/icons/calendar-range.png");
        var office = new Image();
        office.src = require("../assets/icons/office.png");


        jobs.forEach((job, index) => {
            this.doc.setFont("Montserrat-Medium", "normal");
            this.doc.setFontSize(this.conf.text.iconline);
            this.doc.setTextColor(this.conf.color.black);
            var temp_x = this.doc.getTextWidth(job.time) + 5.5 + 2;
            var splitLine = (this.x + temp_x + 5.5 + this.doc.getTextWidth(job.company)) > this.max_x;

            if (splitLine) {
                this._isEnoughSpace(
                    (this.conf.height.iconline * 2) + this.conf.height.subHeader
                )
                this.doc.addImage(calendar, this.x - 0.5, this.y - 3.75, 5, 5);
                this.doc.text(job.time, this.x + 5.5, this.y);
                this.y += this.conf.height.iconline;
                this.doc.addImage(office, this.x - 0.5, this.y - 3.75, 5, 5);
                this.doc.text(job.company.toUpperCase(), this.x + 5.5, this.y);
            } else {
                this._isEnoughSpace(
                    this.conf.height.iconline + this.conf.height.subHeader
                )
                this.doc.addImage(calendar, this.x - 0.5, this.y - 3.75, 5, 5);
                this.doc.text(job.time, this.x + 5.5, this.y);
                this.doc.addImage(office, this.x + temp_x - 0.5, this.y - 3.75, 5, 5);
                this.doc.text(job.company.toUpperCase(), this.x + temp_x + 5.5, this.y);
            }
            this.y += this.conf.height.iconline;
            this.y += 1; // normalize height
            this.doc.setFont("Roboto-Bold", "normal");
            this.doc.setFontSize(this.conf.text.subHeader);
            this.doc.text(job.role, this.x, this.y);
            this.y += this.conf.height.subHeader;
            if (job.details) {
                job.details.forEach(detail => {
                    this._printMultiLine(detail, true);
                });
            } else {
                this.y -= (this.conf.height.subHeader - this.conf.height.content);  // normalize height
            }

            if (index != jobs.length - 1) {
                this.y += this.conf.height.content;
            }
        });
        this.y += this.conf.height.normalize; // normalize height
        this.y += this.conf.margin.between;
    }

    _addEducation(items, name = "Education") {
        var icon = new Image();
        icon.src = require("../assets/icons/school-white.png");
        this._addHeader(name, icon, this.rowLeft);

        var calendar = new Image();
        calendar.src = require("../assets/icons/calendar-range.png");
        var location = new Image();
        location.src = require("../assets/icons/map-marker.png");

        items.forEach((item, index) => {
            this.doc.setFont("Montserrat-Medium", "normal");
            this.doc.setFontSize(this.conf.text.iconline);
            this.doc.setTextColor(this.conf.color.black);
            var temp_x = this.doc.getTextWidth(item.time) + 5.5 + 2;
            var splitLine = (this.x + temp_x + 5.5 + this.doc.getTextWidth(item.university)) > this.max_x;

            if (splitLine) {
                this._isEnoughSpace(
                    (this.conf.height.iconline * 2) + this.conf.height.subHeader
                );
                this.doc.addImage(calendar, this.x - 0.5, this.y - 3.75, 5, 5);
                this.doc.text(item.time, this.x + 5.5, this.y);
                this.y += this.conf.height.iconline;
                this.doc.addImage(location, this.x - 0.5, this.y - 3.75, 5, 5);
                this.doc.text(item.university.toUpperCase(), this.x + 5.5, this.y);
            } else {
                this._isEnoughSpace(
                    this.conf.height.iconline + this.conf.height.subHeader
                );
                this.doc.addImage(calendar, this.x - 0.5, this.y - 3.75, 5, 5);
                this.doc.text(item.time, this.x + 5.5, this.y);
                this.doc.addImage(location, this.x + temp_x - 0.5, this.y - 3.75, 5, 5);
                this.doc.text(item.university.toUpperCase(), this.x + temp_x + 5.5, this.y);
            }
            this.y += this.conf.height.iconline;
            this.y += 1; // normalize height
            this.doc.setFont("Roboto-Bold", "normal");
            this.doc.setFontSize(this.conf.text.subHeader);
            this.doc.text(item.degree, this.x, this.y);
            this.y += this.conf.height.subHeader;
            if (item.details) {
                item.details.forEach(detail => {
                    this._printMultiLine(detail, true);
                });
            } else {
                this.y -= (this.conf.height.subHeader - this.conf.height.content);  // normalize height
            }

            if (index != items.length - 1) {
                this.y += this.conf.height.content;
            }
        });
        this.y += this.conf.height.normalize; // normalize height
        this.y += this.conf.margin.between;
    }

    _addProjects(projects, name = "Projects") {
        var icon = new Image();
        icon.src = require("../assets/icons/console-white.png");
        this._addHeader(name, icon, this.rowLeft);

        if (projects.details) {
            this._printMultiLine(projects.details, false);
            this.y += this.conf.height.content; //normalize height
        }

        var github = new Image();
        github.src = require("../assets/icons/github.png");
        var link = new Image();
        link.src = require("../assets/icons/link.png");

        projects.items.forEach((project, index) => {
            this._isEnoughSpace(
                this.conf.height.subHeader + this.conf.height.tagline
            );
            this.doc.setFont("Roboto-Bold", "normal");
            this.doc.setTextColor(this.conf.color.black);
            this.doc.setFontSize(this.conf.text.subHeader);
            if (project.link) {
                if (project.link.startsWith("https://github.com")) {
                    this.doc.addImage(github, this.x - 0.5, this.y - 3.75, 5, 5);
                } else {
                    this.doc.addImage(link, this.x - 0.5, this.y - 3.75, 5, 5);
                }

                this.doc.textWithLink(project.name, this.x + 5.5, this.y, {
                    url: project.link,
                });
            } else {
                this.doc.text(project.name, this.x, this.y);
            }
            this.y += this.conf.height.subHeader;

            this.doc.setFont("Montserrat-Medium", "normal");
            this.doc.setFontSize(this.conf.text.tagline);
            this.doc.text(project.tagline, this.x, this.y);
            this.y += this.conf.height.tagline

            this._printMultiLine(project.details, false);
            if (index != projects.items.length - 1) {
                this.y += this.conf.height.content; //normalize height
            }
        });
        this.y += this.conf.height.normalize; // normalize height
        this.y += this.conf.margin.between;
    }

    _addSkills(skills, name = "Skills") {
        var icon = new Image();
        icon.src = require("../assets/icons/toolbox-white.png");
        this._addHeader(name, icon, this.rowLeft);

        var info = new Image();
        info.src = require("../assets/icons/info.png");

        skills.forEach((set, index) => {
            this._isEnoughSpace(this.conf.text.content * 2);
            this.doc.setFont("Roboto-Bold", "normal");
            this.doc.setFontSize(this.conf.text.content);
            this.doc.setTextColor(this.conf.color.black);
            this.doc.addImage(info, this.x - 0.5, this.y - 3.75, 5, 5);
            this.doc.text(set.displayName.toUpperCase(), this.x + 5.5, this.y);
            this.y += this.conf.height.content;
            this.y += 1; // normalize height
            set.items.forEach(item => {
                this._isEnoughSpace(this.conf.text.content);
                this.doc.setFont("Roboto-Bold", "normal");
                this.doc.setFontSize(this.conf.text.content);
                this.doc.setTextColor(this.conf.color.content);
                this.doc.text(item.name, this.x, this.y);
                this.doc.setTextColor(this.conf.color.primary);
                this.doc.text(item.level, this.x + 40, this.y);
                this.y += this.conf.height.content;
            });

            if (index != skills.length - 1) {
                this.y += this.conf.height.content; //normalize height
            }
        });

        this.y += this.conf.height.normalize; // normalize height
        this.y += this.conf.margin.between;
    }

    _addCourses(items, name = "Courses") {
        var icon = new Image();
        icon.src = require("../assets/icons/book-education-white.png");
        this._addHeader(name, icon, this.rowLeft);

        items.forEach(item => {
            this._printMultiLine(item, true);
        });
    }

    _isEnoughSpace(heightNedeed) {
        if ((this.y + heightNedeed) > (this.doc.internal.pageSize.height - this.conf.margin.bottom)) {
            if (this.rowLeft) {
                this.rowLeft = false;
                this.x = this.conf.margin.content + this.center;
                this.max_x = this.doc.internal.pageSize.width - this.conf.margin.right;
                this.y = this.row_1_start_y;
            } else {
                this._setPage(this.currentPage + 1);
            }
            var font = this.doc.getFont();
            var size = this.doc.getFontSize();
            var color = this.doc.getTextColor();
            this._addHeader(this.currentHeader, this.currentIcon, this.rowLeft);
            this.doc.setFont(font.fontName, font.fontStyle);
            this.doc.setFontSize(size);
            this.doc.setTextColor(color);

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
        this.x = this.conf.margin.left + this.conf.margin.content;
        this.max_x = this.center - this.conf.margin.column;
        this.rowLeft = true;
        this.row_1_start_y = this.conf.margin.top;
    }

    _reset() {
        this.doc = new jsPDF();
        this.conf = this.initConf;
        this.y = this.conf.margin.top;
        this.x = this.conf.margin.left + this.conf.margin.content;
        this.max_x = this.center - this.conf.margin.column;
        this.rowLeft = true;
        this.currentPage = 1;
        this.currentHeader = null;
        this.currentIcon = null;
    }
}