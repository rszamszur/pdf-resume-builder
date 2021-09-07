import { BaseTemplate } from "./base.js";
import MontserratBlack from "../assets/fonts/Montserrat-Black-normal.js";
import MontserratExtraBold from "../assets/fonts/Montserrat-ExtraBold-normal.js";
import MontserratBold from "../assets/fonts/Montserrat-Bold-normal.js";
import MontserratSemiBold from "../assets/fonts/Montserrat-SemiBold-normal.js";
import MontserratMedium from "../assets/fonts/Montserrat-Medium-normal.js";
import MontserratRegular from "../assets/fonts/Montserrat-Regular-normal.js";

export class ShineLikeDiamond extends BaseTemplate {
    constructor() {
        const conf = {
            sidebarWidth: 60,
            sidebarRight: false,
            text: {
                name: 35,
                tagline: 18,
                header: 16,
                subHeader: 12,
                sidebarHeader: 16,
                sidebarContent: 10,
                content: 10,
            },
            font: {
                subHeader: "Montserrat-Medium",
                subHeaderTagline: "Montserrat-Regular",
                content: "Montserrat-Regular",
                contentBold: "Montserrat-SemiBold",
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
                sidebarHeader: 6,
                sidebarContent: 8,
                content: 4,
                normalize: -4,
            },
        };
        super(conf);
        this.doc.addFileToVFS("Montserrat-Black.ttf", MontserratBlack);
        this.doc.addFileToVFS("Montserrat-ExtraBold.ttf", MontserratExtraBold);
        this.doc.addFileToVFS("Montserrat-Bold.ttf", MontserratBold);
        this.doc.addFileToVFS("Montserrat-SemiBold.ttf", MontserratSemiBold);
        this.doc.addFileToVFS("Montserrat-Medium.ttf", MontserratMedium);
        this.doc.addFileToVFS("Montserrat-Regular.ttf", MontserratRegular);
    }

    static defaultOptions() {
        return {
            text: {
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
            height: {
                subHeader: 5,
                sidebarHeader: 6,
                sidebarContent: 8,
                content: 4,
            },
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
            this.heightRef = this.conf.margin.top;
        }

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
        this._reset();
    }

    _addTitle(name, lastname, tagline) {
        this.heightRef = 33;
        this.doc.setFont("Montserrat-ExtraBold", "normal");
        this.doc.setTextColor(this.conf.color.primary);
        this.doc.setFontSize(this.conf.text.name);
        this.doc.text(name.toUpperCase(), this.totalLeftMargin, this.heightRef, { charSpace: 1 });
        this.heightRef += this.conf.height.name;
        this.doc.text(lastname.toUpperCase(), this.totalLeftMargin, this.heightRef, { charSpace: 1 });
        this.heightRef += this.conf.height.tagline;
        this.doc.setFont("Montserrat-SemiBold", "normal");
        this.doc.setFontSize(this.conf.text.tagline);
        this.doc.setTextColor(this.conf.color.secondary);
        this.doc.text(tagline.toUpperCase(), this.totalLeftMargin, this.heightRef, { charSpace: 0.5 });
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
        sidebarHeightRef += this.conf.height.sidebarContent;

        var phone = new Image();
        phone.src = require("../assets/icons/phone.png");
        this.doc.addImage(phone, this.conf.margin.sidebar, sidebarHeightRef, 6, 6);
        this.doc.text(data.contact.phone, this.conf.margin.sidebar + 8, sidebarHeightRef + 4);
        sidebarHeightRef += this.conf.height.sidebarContent;

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

            sidebarHeightRef += this.conf.height.sidebarContent;
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

            sidebarHeightRef += this.conf.height.sidebarContent;
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

            sidebarHeightRef += this.conf.height.sidebarContent;
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

            sidebarHeightRef += this.conf.height.sidebarContent;
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
            sidebarHeightRef += (count - 4) * this.conf.height.sidebarContent;
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
            sidebarHeightRef += this.conf.height.sidebarHeader;

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
            sidebarHeightRef += this.conf.height.sidebarHeader;

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
            sidebarHeightRef += (count - 4) * this.conf.height.sidebarContent;
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
        sidebarHeightRef += this.conf.height.sidebarHeader;

        this.doc.setFont("Montserrat-Regular", "normal");
        this.doc.setFontSize(this.conf.text.sidebarContent);
        this.doc.setTextColor(this.conf.color.white);

        var email = new Image();
        email.src = require("../assets/icons/email-white.png");
        this.doc.addImage(email, this.conf.margin.sidebar, sidebarHeightRef, 6, 6);
        this.doc.text(data.contact.email, this.conf.margin.sidebar + 8, sidebarHeightRef + 4);
        sidebarHeightRef += this.conf.height.sidebarContent;

        var phone = new Image();
        phone.src = require("../assets/icons/phone-white.png");
        this.doc.addImage(phone, this.conf.margin.sidebar, sidebarHeightRef, 6, 6);
        this.doc.text(data.contact.phone, this.conf.margin.sidebar + 8, sidebarHeightRef + 4);
        sidebarHeightRef += this.conf.height.sidebarContent;

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

            sidebarHeightRef += this.conf.height.sidebarContent;
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

            sidebarHeightRef += this.conf.height.sidebarContent;
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

            sidebarHeightRef += this.conf.height.sidebarContent;
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

            sidebarHeightRef += this.conf.height.sidebarContent;
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

    _addHeader(name) {
        this._isEnoughSpace(this.conf.height.header);
        this.doc.setFillColor("#1A1A1A");
        this.doc.setDrawColor("#1A1A1A");
        this.doc.triangle(this.totalLeftMargin, this.heightRef + 6, this.totalLeftMargin + 6, this.heightRef + 9, this.totalLeftMargin + 6, this.heightRef, "F");
        this.doc.triangle(this.totalLeftMargin, this.heightRef + 6, this.totalLeftMargin + 6, this.heightRef + 9, this.totalLeftMargin, this.heightRef + 15, "F");
        this.doc.line(this.totalLeftMargin, this.heightRef + 6, this.totalLeftMargin + 6, this.heightRef + 9, "F");

        this.doc.setFont("Montserrat-Medium", "normal");
        this.doc.setTextColor(this.conf.color.primary);
        this.doc.setFontSize(this.conf.text.header);
        this.doc.text(name, this.totalLeftMargin + 10, this.heightRef + 7, { charSpace: 0.5 });
        this.heightRef += this.conf.height.header;
    }

}