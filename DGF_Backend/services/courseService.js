const axios = require('axios');
const db = require('../config/db');
require('dotenv').config();

const getCourses = async () => {
    try {
        const token = 'ec25c26077c47fd4b77f0b72a143df01';
        const url = `https://academy.harbingergroup.com/webservice/rest/server.php?wstoken=${token}&wsfunction=core_course_get_courses&moodlewsrestformat=json`;

        const response = await axios.get(url, {
            httpsAgent: new (require('https').Agent)({
                rejectUnauthorized: false
            })
        });

        const data = response.data;

        // Insert courses into the database
        const insertQuery = `
            INSERT INTO course (
                course_id, course_name, course_description, duration_hours, created_date, shortname, categoryid, categorysortorder, 
                fullname, idnumber, summaryformat, format, showgrades, newsitems, startdate, enddate, numsections, maxbytes, 
                showreports, visible, groupmode, groupmodeforce, defaultgroupingid, timemodified, enablecompletion, 
                completionnotify, lang, forcetheme
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        for (const course of data) {
            try {
                // Extract durationHours from customfields
                let durationHours = 0;
                const durationField = course.customfields?.find(field => field.name === "Course Duration");
                if (durationField && durationField.value) {
                    const match = durationField.value.match(/\d+/); // Extract numeric value
                    if (match) {
                        durationHours = parseInt(match[0], 10); // Convert to integer
                    }
                }

                await db.promise().execute(insertQuery, [
                    course.id, course.displayname, course.summary, durationHours, new Date(course.timecreated * 1000), 
                    course.shortname, course.categoryid, course.categorysortorder, course.fullname, course.idnumber, 
                    course.summaryformat, course.format, course.showgrades, course.newsitems, course.startdate, 
                    course.enddate, course.numsections, course.maxbytes, course.showreports, course.visible, 
                    course.groupmode, course.groupmodeforce, course.defaultgroupingid, course.timemodified, 
                    course.enablecompletion, course.completionnotify, course.lang, course.forcetheme
                ]);
            } catch (error) {
                console.error(`Error inserting course "${course.displayname}":`, error);
            }
        }

        console.log('Courses inserted into the database');
    } catch (error) {
        console.error('Error fetching data from Academy API:', error);
    }
};

module.exports = { getCourses };