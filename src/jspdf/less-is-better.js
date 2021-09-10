import { BaseTemplate } from "./base.js";
import Roboto from "../assets/fonts/Roboto-Regular-normal.js";
import RobotoBold from "../assets/fonts/Roboto-Bold-normal.js";
import HKGroteskBold from "../assets/fonts/HKGrotesk-Bold-normal.js";
import HKGroteskRegular from "../assets/fonts/HKGrotesk-Regular-normal.js";
import PoppinsLight from "../assets/fonts/Poppins-Light-normal.js";
import PoppinsBold from "../assets/fonts/Poppins-Bold-normal.js";

export class LessIsBetter extends BaseTemplate {
    constructor() {
        const conf = {
            sidebarWidth: 70,
            sidebarRight: true,
            text: {
                name: 35,
                tagline: 16,
                header: 18,
                subHeader: 12,
                sidebarHeader: 18,
                sidebarContent: 12,
                content: 9,
            },
            font: {
                pageNumber: "Roboto-Regular",
                subHeader: "HKGrotesk-Bold",
                subHeaderTagline: "HKGrotesk-Regular",
                content: "Poppins-Light",
                contentBold: "Poppins-Bold",
            },
            margin: {
                top: 20,
                bottom: 20,
                left: 15,
                right: 15,
                sidebar: 15,
                between: 10,
                list: 5,
            },
            color: {
                white: "#ffffff",
                black: "#000000",
                pageNum: "#4d4e53",
                content: "#000000",
                subHeader: "#000000",
                primary: "#000000",
            },
            height: {
                name: 12,
                tagline: 8,
                header: 8,
                subHeader: 5,
                sidebarHeader: 16,
                sidebarContent: 8,
                content: 4,
                normalize: 1,
            },
        }
        super(conf);
        this.doc.addFileToVFS("Roboto-Regular.ttf", Roboto);
        this.doc.addFileToVFS("Roboto-Bold.ttf", RobotoBold);
        this.doc.addFileToVFS("HKGrotesk-Bold.ttf", HKGroteskBold);
        this.doc.addFileToVFS("HKGrotesk-Regular.ttf", HKGroteskRegular);
        this.doc.addFileToVFS("Poppins-Light.ttf", PoppinsLight);
        this.doc.addFileToVFS("Poppins-Bold.ttf", PoppinsBold);
        this.max_x = this.doc.internal.pageSize.width - this.conf.sidebarWidth - this.conf.margin.right;
    }

    static editableOptions() {
        return {
            sidebarWidth: 70,
            text: {
                name: 35,
                tagline: 16,
                header: 18,
                subHeader: 12,
                sidebarHeader: 18,
                sidebarContent: 12,
                content: 9,
            },
            margin: {
                top: 20,
                bottom: 20,
                left: 15,
                right: 15,
                sidebar: 15,
                between: 10,
                list: 5,
            },
            height: {
                name: 12,
                tagline: 8,
                header: 8,
                subHeader: 5,
                sidebarHeader: 8,
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
            this.y = this.conf.margin.top;
            this.max_x = this.doc.internal.pageSize.width - this.conf.sidebarWidth - this.conf.margin.right;
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
            }
        }
        this._numberPages(false);
        this.doc.save("resume.pdf");
        this._reset();
    }

    _addSidebar(data, withContact, withExtras) {
        var docHeight = this.doc.internal.pageSize.height;
        var docWidth = this.doc.internal.pageSize.width;
        var sidebar_y = 182;

        this.doc.rect(docWidth - this.conf.sidebarWidth, 0, docWidth, docHeight, "F");
        this.doc.setFont("HKGrotesk-Bold", "normal");
        this.doc.setFontSize(this.conf.text.name);
        this.doc.setTextColor(this.conf.color.white);

        this.doc.text(data.name.toUpperCase(), sidebar_y, this.conf.margin.top - 5, {
            angle: -90,
            charSpace: 1,
        });
        sidebar_y -= this.conf.height.name;
        this.doc.text(data.lastname.toUpperCase(), sidebar_y, this.conf.margin.top - 5, {
            angle: -90,
            charSpace: 1,
        });
        sidebar_y -= this.conf.height.tagline;
        this.doc.setFont("Poppins-Light", "normal");
        this.doc.setFontSize(this.conf.text.tagline);
        this.doc.text(data.tagline.toUpperCase(), sidebar_y, this.conf.margin.top - 4, {
            angle: -90,
            charSpace: 1,
        });

        sidebar_y = docHeight - this.conf.margin.bottom;
        var sidebarMargin = (docWidth - this.conf.sidebarWidth) + this.conf.margin.sidebar;

        if (withContact) {
            this.doc.setFontSize(this.conf.text.sidebarContent);
            sidebar_y -= 7; // normalize height

            if (data.contact.stackoverflow) {
                var stackOverflow = new Image();
                stackOverflow.src = require("../assets/icons/stack-overflow-white.png");
                this.doc.addImage(stackOverflow, sidebarMargin, sidebar_y, 7, 7);
                this.doc.textWithLink(
                    "stackoverflow",
                    sidebarMargin + 8,
                    sidebar_y + 5,
                    {
                        url: data.contact.stackoverflow,
                    }
                );

                sidebar_y -= this.conf.height.sidebarContent;
            }

            if (data.contact.twitter) {
                var twitter = new Image();
                twitter.src = require("../assets/icons/twitter-white.png");
                this.doc.addImage(twitter, sidebarMargin, sidebar_y, 7, 7);
                this.doc.textWithLink(
                    data.contact.twitter,
                    sidebarMargin + 8,
                    sidebar_y + 5,
                    {
                        url: `https://twitter.com/${data.contact.twitter}`,
                    }
                );

                sidebar_y -= this.conf.height.sidebarContent;
            }

            if (data.contact.website) {
                var website = new Image();
                website.src = require("../assets/icons/web-white.png");
                this.doc.addImage(website, sidebarMargin, sidebar_y, 7, 7);
                this.doc.textWithLink(
                    data.contact.website,
                    sidebarMargin + 8,
                    sidebar_y + 5,
                    {
                        url: `https://${data.contact.website}`,
                    }
                );

                sidebar_y -= this.conf.height.sidebarContent;
            }


            if (data.contact.linkedin) {
                var linkedin = new Image();
                linkedin.src = require("../assets/icons/linkedin-white.png");
                this.doc.addImage(linkedin, sidebarMargin, sidebar_y, 7, 7);
                this.doc.textWithLink(
                    data.contact.linkedin,
                    sidebarMargin + 8,
                    sidebar_y + 5,
                    {
                        url: `https://linkedin.com/in/${data.contact.linkedin}`,
                    }
                );

                sidebar_y -= this.conf.height.sidebarContent;
            }

            if (data.contact.github) {
                var github = new Image();
                github.src = require("../assets/icons/github-white.png");
                this.doc.addImage(github, sidebarMargin, sidebar_y, 7, 7);
                this.doc.textWithLink(
                    data.contact.github,
                    sidebarMargin + 8,
                    sidebar_y + 5,
                    {
                        url: `https://github.com/${data.contact.github}`,
                    }
                );

                sidebar_y -= this.conf.height.sidebarContent;
            }

            var phone = new Image();
            phone.src = require("../assets/icons/phone-white.png");
            this.doc.addImage(phone, sidebarMargin, sidebar_y, 7, 7);
            this.doc.text(data.contact.phone, sidebarMargin + 8, sidebar_y + 5);

            sidebar_y -= this.conf.height.sidebarContent;

            var email = new Image();
            email.src = require("../assets/icons/email-white.png");
            this.doc.addImage(email, sidebarMargin, sidebar_y, 7, 7);
            this.doc.text(data.contact.email, sidebarMargin + 8, sidebar_y + 5);

            sidebar_y -= this.conf.height.content;
            this.doc.setFont("Roboto-Bold", "normal");
            this.doc.setFontSize(this.conf.text.sidebarHeader);
            this.doc.text("CONTACT", sidebarMargin, sidebar_y);
            sidebar_y -= this.conf.height.sidebarHeader * 2;
        }

        if (withExtras) {
            if (data.languages) {
                this.doc.setFont("Poppins-Light", "normal");
                this.doc.setFontSize(this.conf.text.sidebarContent);
                data.languages.reverse().forEach(lang => {
                    this.doc.text(`${lang.name} (${lang.level})`, sidebarMargin, sidebar_y);
                    sidebar_y -= this.conf.height.sidebarContent;
                });

                this.doc.setFont("Roboto-Bold", "normal");
                this.doc.setFontSize(this.conf.text.sidebarHeader);
                this.doc.text("LANGUAGES", sidebarMargin, sidebar_y);
                sidebar_y -= this.conf.height.sidebarHeader * 2;
            }

            if (data.interests) {
                this.doc.setFont("Poppins-Light", "normal");
                this.doc.setFontSize(this.conf.text.sidebarContent);
                data.interests.reverse().forEach(item => {
                    if (item.link) {
                        this.doc.textWithLink(item.name, sidebarMargin, sidebar_y, {
                            url: item.link,
                        });
                    } else {
                        this.doc.text(item.name, sidebarMargin, sidebar_y);
                    }
                    sidebar_y -= this.conf.height.sidebarContent;
                });

                this.doc.setFont("Roboto-Bold", "normal");
                this.doc.setFontSize(this.conf.text.sidebarHeader);
                this.doc.text("INTERESTS", sidebarMargin, sidebar_y);
                sidebar_y -= this.conf.height.sidebarHeader * 2;
            }
        }
    }

    _addHeader(name) {
        this.doc.setFont("HKGrotesk-Bold", "normal");
        this.doc.setTextColor(this.conf.color.black);
        this.doc.setFontSize(this.conf.text.header);
        this._isEnoughSpace(this.conf.height.header);
        this.doc.text(name, this.x, this.y);
        this.y += this.conf.height.header;
    }

}
