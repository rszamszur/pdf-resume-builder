import { jsPDF } from "jspdf";
import MontserratBlack from "../assets/fonts/Montserrat-Black-normal.js";
import MontserratExtraBold from "../assets/fonts/Montserrat-ExtraBold-normal.js";
import MontserratBold from "../assets/fonts/Montserrat-Bold-normal.js";
import MontserratSemiBold from "../assets/fonts/Montserrat-SemiBold-normal.js";
import MontserratMedium from "../assets/fonts/Montserrat-Medium-normal.js";
import MontserratRegular from "../assets/fonts/Montserrat-Regular-normal.js";

export class ShineLikeDiamond {
    constructor() {
        this.doc = new jsPDF();
        this.doc.addFileToVFS("Montserrat-Black.ttf", MontserratBlack);
        this.doc.addFileToVFS("Montserrat-ExtraBold.ttf", MontserratExtraBold);
        this.doc.addFileToVFS("Montserrat-Bold.ttf", MontserratBold);
        this.doc.addFileToVFS("Montserrat-SemiBold.ttf", MontserratSemiBold);
        this.doc.addFileToVFS("Montserrat-Medium.ttf", MontserratMedium);
        this.doc.addFileToVFS("Montserrat-Regular.ttf", MontserratRegular);
        this.conf = {
            sidebarWidth: 60,
            text: {
                name: 35,
                tagline: 18,
                header: 16,
                subHeader: 12,
                sidebarHeader: 16,
                sidebarContent: 10,
                content: 10,
            },
            margin: {
                top: 20,
                bottom: 20,
                left: 15,
                right: 15,
                sidebar: 12,
                between: 8,
                list: 5,
            },
            color: {
                white: "#ffffff",
                black: "#000000",
                gray: "#4d4e53",
                secondary: "#8D8D8D",
                primary: "#1A1A1A"
            },
            height: {
                name: 12,
                tagline: 8,
                header: 20,
                subHeader: 5,
                content: 4,
            },
        };
        this.heightRef = this.conf.margin.top;
        this.contentMargin = this.conf.margin.left + this.conf.sidebarWidth;
        this.currentPage = 1;
    }

    static schema() {
        return {}
    }

    static defaultOptions() {
        return {}
    }

    generatePDF(data) {
        this._addSidebar(data);

        this._addTitle(data.name, data.lastname, data.tagline);
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
            this._addSidebar(data);
        } else {
            for (let j = 1; j < pages + 1; j++) {
                this._setPage(j);
                if (j == 1) {
                    this._addSidebar(data);
                } else {
                    this._addSidebarInverse(data);
                }

                if (data.numPages) {
                    this.doc.setFont("Montserrat-Regular", "normal");
                    this.doc.setFontSize(8);
                    this.doc.setTextColor(this.conf.color.gray);
                    this.doc.text(
                        `${j} / ${pages}`,
                        this.doc.internal.pageSize.width - this.conf.margin.right,
                        this.doc.internal.pageSize.height - 6,
                        "right"
                    ); 1
                }
            }
        }
        this._addSidebarInverse(data);
        this.doc.save("resume.pdf");
    }

    _addTitle(name, lastname, tagline) {
        this.heightRef = 33;
        this.doc.setFont("Montserrat-ExtraBold", "normal");
        this.doc.setTextColor(this.conf.color.primary);
        this.doc.setFontSize(this.conf.text.name);
        this.doc.text(name.toUpperCase(), this.contentMargin, this.heightRef, { charSpace: 1 });
        this.heightRef += this.conf.height.name;
        this.doc.text(lastname.toUpperCase(), this.contentMargin, this.heightRef, { charSpace: 1 });
        this.heightRef += this.conf.height.tagline;
        this.doc.setFont("Montserrat-SemiBold", "normal");
        this.doc.setFontSize(this.conf.text.tagline);
        this.doc.setTextColor(this.conf.color.secondary);
        this.doc.text(tagline.toUpperCase(), this.contentMargin, this.heightRef, { charSpace: 0.5 });
        this.heightRef += this.conf.margin.between;
    }

    _addSidebar(data) {
        const docHeight = this.doc.internal.pageSize.height;
        var sidebarHeightRef = 111;

        this.doc.triangle(0, 70, 60, 60, 0, 111, "F");
        this.doc.triangle(0, 70, 60, 60, 60, 19, "F");
        this.doc.line(0, 70, 60, 60, "F");

        this.doc.setFont("Montserrat-Black", "normal");
        this.doc.setTextColor(this.conf.color.white);
        this.doc.setFontSize(115);
        this.doc.text("CV", -2, 82, {
            charSpace: 2,
        });

        this.doc.setFont("Montserrat-Medium", "normal");
        this.doc.setTextColor(this.conf.color.primary);
        this.doc.setFontSize(this.conf.text.sidebarHeader);
        this.doc.text("CONTACT", this.conf.margin.sidebar, sidebarHeightRef, { charSpace: 0.5 });
        sidebarHeightRef += 6;

        this.doc.setFont("Montserrat-Regular", "normal");
        this.doc.setFontSize(this.conf.text.sidebarContent);
        this.doc.setTextColor(this.conf.color.primary);

        var email = new Image();
        email.src = require("../assets/icons/email.png");
        this.doc.addImage(email, this.conf.margin.sidebar, sidebarHeightRef, 6, 6);
        this.doc.text(data.contact.email, this.conf.margin.sidebar + 8, sidebarHeightRef + 4);
        sidebarHeightRef += 8;

        var phone = new Image();
        phone.src = require("../assets/icons/phone.png");
        this.doc.addImage(phone, this.conf.margin.sidebar, sidebarHeightRef, 6, 6);
        this.doc.text(data.contact.phone, this.conf.margin.sidebar + 8, sidebarHeightRef + 4);
        sidebarHeightRef += 8;

        if (data.contact.github) {
            var github = new Image();
            github.src = require("../assets/icons/github.png");
            this.doc.addImage(github, this.conf.margin.sidebar, sidebarHeightRef, 6, 6);
            this.doc.textWithLink(
                data.contact.github,
                this.conf.margin.sidebar + 8,
                sidebarHeightRef + 4,
                {
                    url: `https://github.com/${data.contact.github}`,
                }
            );

            sidebarHeightRef += 8;
        }

        if (data.contact.linkedin) {
            var linkedin = new Image();
            linkedin.src = require("../assets/icons/linkedin.png");
            this.doc.addImage(linkedin, this.conf.margin.sidebar, sidebarHeightRef, 6, 6);
            this.doc.textWithLink(
                data.contact.linkedin,
                this.conf.margin.sidebar + 8,
                sidebarHeightRef + 4,
                {
                    url: `https://linkedin.com/in/${data.contact.linkedin}`,
                }
            );

            sidebarHeightRef += 8;
        }

        if (data.contact.website) {
            var website = new Image();
            website.src = require("../assets/icons/web.png");
            this.doc.addImage(website, this.conf.margin.sidebar, sidebarHeightRef, 6, 6);
            this.doc.textWithLink(
                data.contact.website,
                this.conf.margin.sidebar + 8,
                sidebarHeightRef + 4,
                {
                    url: `https://${data.contact.website}`,
                }
            );

            sidebarHeightRef += 8;
        }

        if (data.contact.twitter) {
            var twitter = new Image();
            twitter.src = require("../assets/icons/twitter.png");
            this.doc.addImage(twitter, this.conf.margin.sidebar, sidebarHeightRef, 6, 6);
            this.doc.textWithLink(
                data.contact.twitter,
                this.conf.margin.sidebar + 8,
                sidebarHeightRef + 4,
                {
                    url: `https://twitter.com/${data.contact.twitter}`,
                }
            );

            sidebarHeightRef += 8;
        }

        if (data.contact.stackoverflow) {
            var stackOverflow = new Image();
            stackOverflow.src = require("../assets/icons/stack-overflow.png");
            this.doc.addImage(stackOverflow, this.conf.margin.sidebar, sidebarHeightRef, 6, 6);
            this.doc.textWithLink(
                "stackoverflow",
                this.conf.margin.sidebar + 8,
                sidebarHeightRef + 4,
                {
                    url: data.contact.stackoverflow,
                }
            );
        }

        sidebarHeightRef = 200;
        const count = Object.keys(data.contact).length - 1;

        if (count > 4) {
            sidebarHeightRef += (count - 4) * 8;
        }

        //calculated line equation
        const y = ((-(6 / 7) * this.conf.sidebarWidth) + sidebarHeightRef);

        this.doc.setFillColor("#1A1A1A");
        this.doc.setDrawColor("#1A1A1A");
        this.doc.triangle(0, sidebarHeightRef, 60, docHeight, 60, y, "F");
        this.doc.rect(0, sidebarHeightRef, 60, docHeight, "F");

        if (data.languages) {
            this.doc.setFont("Montserrat-Medium", "normal");
            this.doc.setTextColor(this.conf.color.white);
            this.doc.setFontSize(this.conf.text.sidebarHeader);
            this.doc.text("LANGUAGES", this.conf.margin.sidebar, sidebarHeightRef, { charSpace: 0.5 });
            sidebarHeightRef += 6;

            this.doc.setFontSize(this.conf.text.sidebarContent);
            data.languages.forEach(lang => {
                this.doc.text(`${lang.name} (${lang.level})`, this.conf.margin.sidebar, sidebarHeightRef);
                sidebarHeightRef += 6;
            });

            sidebarHeightRef += 6;
        }

        if (data.interests) {
            this.doc.setFont("Montserrat-Medium", "normal");
            this.doc.setTextColor(this.conf.color.white);
            this.doc.setFontSize(this.conf.text.sidebarHeader);
            this.doc.text("INTERESTS", this.conf.margin.sidebar, sidebarHeightRef, { charSpace: 0.5 });
            sidebarHeightRef += 6;

            this.doc.setFontSize(this.conf.text.sidebarContent);
            data.interests.forEach(item => {
                if (item.link) {
                    this.doc.textWithLink(item.name, this.conf.margin.sidebar, sidebarHeightRef, {
                        url: item.link,
                    });
                } else {
                    this.doc.text(item.name, this.conf.margin.sidebar, sidebarHeightRef);
                }
                sidebarHeightRef += 6;
            });

        }
    }

    _addSidebarInverse(data) {
        var sidebarHeightRef = 200;
        const count = Object.keys(data.contact).length - 1;

        if (count > 4) {
            sidebarHeightRef += (count - 4) * 8;
        }

        //calculated line equation
        const y = ((-(6 / 7) * this.conf.sidebarWidth) + sidebarHeightRef);

        this.doc.setFillColor(this.conf.color.primary);
        this.doc.setDrawColor(this.conf.color.primary);
        this.doc.triangle(0, 111, 60, y, 60, 60, "F");
        this.doc.triangle(0, 111, 60, y, 0, sidebarHeightRef, "F");
        this.doc.line(0, 111, 60, y, "F");

        sidebarHeightRef = 111;

        this.doc.setFont("Montserrat-Medium", "normal");
        this.doc.setTextColor(this.conf.color.white);
        this.doc.setFontSize(this.conf.text.sidebarHeader);
        this.doc.text("CONTACT", this.conf.margin.sidebar, sidebarHeightRef, { charSpace: 0.5 });
        sidebarHeightRef += 6;

        this.doc.setFont("Montserrat-Regular", "normal");
        this.doc.setFontSize(this.conf.text.sidebarContent);
        this.doc.setTextColor(this.conf.color.white);

        var email = new Image();
        email.src = require("../assets/icons/email-white.png");
        this.doc.addImage(email, this.conf.margin.sidebar, sidebarHeightRef, 6, 6);
        this.doc.text(data.contact.email, this.conf.margin.sidebar + 8, sidebarHeightRef + 4);
        sidebarHeightRef += 8;

        var phone = new Image();
        phone.src = require("../assets/icons/phone-white.png");
        this.doc.addImage(phone, this.conf.margin.sidebar, sidebarHeightRef, 6, 6);
        this.doc.text(data.contact.phone, this.conf.margin.sidebar + 8, sidebarHeightRef + 4);
        sidebarHeightRef += 8;

        if (data.contact.github) {
            var github = new Image();
            github.src = require("../assets/icons/github-white.png");
            this.doc.addImage(github, this.conf.margin.sidebar, sidebarHeightRef, 6, 6);
            this.doc.textWithLink(
                data.contact.github,
                this.conf.margin.sidebar + 8,
                sidebarHeightRef + 4,
                {
                    url: `https://github.com/${data.contact.github}`,
                }
            );

            sidebarHeightRef += 8;
        }

        if (data.contact.linkedin) {
            var linkedin = new Image();
            linkedin.src = require("../assets/icons/linkedin-white.png");
            this.doc.addImage(linkedin, this.conf.margin.sidebar, sidebarHeightRef, 6, 6);
            this.doc.textWithLink(
                data.contact.linkedin,
                this.conf.margin.sidebar + 8,
                sidebarHeightRef + 4,
                {
                    url: `https://linkedin.com/in/${data.contact.linkedin}`,
                }
            );

            sidebarHeightRef += 8;
        }

        if (data.contact.website) {
            var website = new Image();
            website.src = require("../assets/icons/web-white.png");
            this.doc.addImage(website, this.conf.margin.sidebar, sidebarHeightRef, 6, 6);
            this.doc.textWithLink(
                data.contact.website,
                this.conf.margin.sidebar + 8,
                sidebarHeightRef + 4,
                {
                    url: `https://${data.contact.website}`,
                }
            );

            sidebarHeightRef += 8;
        }

        if (data.contact.twitter) {
            var twitter = new Image();
            twitter.src = require("../assets/icons/twitter-white.png");
            this.doc.addImage(twitter, this.conf.margin.sidebar, sidebarHeightRef, 6, 6);
            this.doc.textWithLink(
                data.contact.twitter,
                this.conf.margin.sidebar + 8,
                sidebarHeightRef + 4,
                {
                    url: `https://twitter.com/${data.contact.twitter}`,
                }
            );

            sidebarHeightRef += 8;
        }

        if (data.contact.stackoverflow) {
            var stackOverflow = new Image();
            stackOverflow.src = require("../assets/icons/stack-overflow-white.png");
            this.doc.addImage(stackOverflow, this.conf.margin.sidebar, sidebarHeightRef, 6, 6);
            this.doc.textWithLink(
                "stackoverflow",
                this.conf.margin.sidebar + 8,
                sidebarHeightRef + 4,
                {
                    url: data.contact.stackoverflow,
                }
            );

        }
    }

    _addAbout(content) {
        this._addHeader("ABOUT ME");
        this._printMultiLine(content, false);
        this.heightRef -= this.conf.height.content; // normalize height
        this.heightRef += this.conf.margin.between;
    }

    _addExperience(jobs) {
        this._addHeader("EXPERIENCE");
        console.log(jobs);
        jobs.forEach((job, index) => {
            this.doc.setFont("Montserrat-Medium", "normal");
            this.doc.setTextColor(this.conf.color.primary);
            this.doc.setFontSize(this.conf.text.subHeader);
            this._isEnoughSpace(this.conf.height.subHeader);
            this.doc.text(job.role, this.contentMargin, this.heightRef);
            this.heightRef += this.conf.height.subHeader;
            this.doc.setFont("Montserrat-Regular", "normal");
            this.doc.setFontSize(this.conf.text.subHeader);
            this._isEnoughSpace(this.conf.height.subHeader);
            this.doc.text(`${job.time} | ${job.company}`, this.contentMargin, this.heightRef);
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
        this.heightRef -= this.conf.height.content; // normalize height
        this.heightRef += this.conf.margin.between;
    }

    _addProjects(projects) {
        this._addHeader("PROJECTS");

        if (projects.details) {
            this._printMultiLine(projects.details, false);
            this.heightRef += this.conf.height.content; //normalize height
        }
        projects.items.forEach((project, index) => {
            this.doc.setFont("Montserrat-Medium", "normal");
            this.doc.setTextColor(this.conf.color.primary);
            this.doc.setFontSize(this.conf.text.subHeader);
            this._isEnoughSpace(this.conf.height.subHeader);
            if (project.link) {
                this.doc.textWithLink(project.name, this.contentMargin, this.heightRef, {
                    url: project.link,
                });
            } else {
                this.doc.text(project.name, this.contentMargin, this.heightRef);
            }
            this.heightRef += this.conf.height.subHeader;
            this.doc.setFont("Montserrat-Regular", "normal");
            this.doc.setFontSize(this.conf.text.subHeader);
            this._isEnoughSpace(this.conf.height.subHeader);
            this.doc.text(project.tagline, this.contentMargin, this.heightRef);
            this.heightRef += this.conf.height.subHeader;
            this._printMultiLine(project.details, true);
            if (index != projects.items.length - 1) {
                this.heightRef += this.conf.height.content; //normalize height
            }
        });
        this.heightRef -= this.conf.height.content; // normalize height
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
            this._addSkillsRow(firstRow, this.contentMargin);
            if (initPage != this.currentPage) {
                this._setPage(initPage);
            }
            this.heightRef = initHeightRef;
            const secondRowOfset = ((this.doc.internal.pageSize.width - this.conf.margin.right - this.contentMargin) / 2) + this.contentMargin;
            this._addSkillsRow(secondRow, secondRowOfset);
        } else {
            this._addSkillsRow(skills, this.contentMargin);
        }
        this.heightRef -= this.conf.height.content; //normalize height
        this.heightRef += this.conf.margin.between;
    }

    _addSkillsRow(skills, offset) {
        this.doc.setFont("Montserrat-Regular", "normal");
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
            this.doc.setFont("Montserrat-Medium", "normal");
            this.doc.setTextColor(this.conf.color.primary);
            this.doc.setFontSize(this.conf.text.subHeader);
            this._isEnoughSpace(this.conf.height.subHeader);
            this.doc.text(item.degree, this.contentMargin, this.heightRef);
            this.heightRef += this.conf.height.subHeader;
            this.doc.setFont("Montserrat-Regular", "normal");
            this.doc.setFontSize(this.conf.text.subHeader);
            this._isEnoughSpace(this.conf.height.subHeader);
            this.doc.text(`${item.time} | ${item.university}`, this.contentMargin, this.heightRef);
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
        this.heightRef -= this.conf.height.content; // normalize height
        this.heightRef += this.conf.margin.between;
    }

    _addCourses(courses) {
        this._addHeader("COURSES");

        courses.forEach(course => {
            this._printMultiLine(course, true)
        });
        this.heightRef -= this.conf.height.content; // normalize height
        this.heightRef += this.conf.margin.between;
    }

    _addHeader(name) {
        this._isEnoughSpace(this.conf.height.header);
        this.doc.setFillColor("#1A1A1A");
        this.doc.setDrawColor("#1A1A1A");
        this.doc.triangle(this.contentMargin, this.heightRef + 6, this.contentMargin + 6, this.heightRef + 9, this.contentMargin + 6, this.heightRef, "F");
        this.doc.triangle(this.contentMargin, this.heightRef + 6, this.contentMargin + 6, this.heightRef + 9, this.contentMargin, this.heightRef + 15, "F");
        this.doc.line(this.contentMargin, this.heightRef + 6, this.contentMargin + 6, this.heightRef + 9, "F");

        this.doc.setFont("Montserrat-Medium", "normal");
        this.doc.setTextColor(this.conf.color.primary);
        this.doc.setFontSize(this.conf.text.header);
        this.doc.text(name, this.contentMargin + 10, this.heightRef + 7, { charSpace: 0.5 });
        this.heightRef += this.conf.height.header;
    }

    _printMultiLine(line, isListElement) {
        const boldRegex = /(\*{2})+/g;
        const splitRegex = /(\*{2}[^*]*\*{2})/g;
        this.doc.setFont("Montserrat-Regular", "normal");
        this.doc.setFontSize(this.conf.text.content);
        this.doc.setTextColor(this.conf.color.primary);
        var startPage = this.currentPage;
        var initStartX = null;
        var max_width = null;

        if (isListElement) {
            this.doc.text("\u2022", this.contentMargin + this.conf.margin.list - 2, this.heightRef)
            max_width = this.doc.internal.pageSize.width - this.conf.margin.right;
            initStartX = this.contentMargin + this.conf.margin.list;

        } else {
            max_width = this.doc.internal.pageSize.width - this.conf.margin.right;
            initStartX = this.contentMargin;
        }
        var currentX = initStartX;
        const splitByBolds = line.split(splitRegex);

        splitByBolds.forEach(part => {
            if (!part.startsWith(" ") && currentX != initStartX) {
                currentX -= this.doc.getStringUnitWidth(" ") * 3;
            }

            if (part.startsWith("**") && part.endsWith("**")) {
                part = part.replace(boldRegex, "");
                this.doc.setFont("Montserrat-SemiBold", "normal");
            } else {
                this.doc.setFont("Montserrat-Regular", "normal");
            }
            var words = part.split(" ");
            words.forEach(word => {
                var widthNedeed = this.doc.getTextWidth(word);

                if ((widthNedeed + currentX) > max_width) {
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
}