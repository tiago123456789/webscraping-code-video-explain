const axios = require("axios")
const cheerio = require("cheerio")

const extractJobs = (html) => {
    const jobs = [];
    const $ = cheerio.load(html)
    $(".js-navigation-item > *").toArray().forEach(item => {
        const title = $(item).find("a.Link--primary").text();
        const workMode = title.split(/\s/)[0].replace("[", "").replace("]", "")
        const link = "https://github.com" + $(item).find("a.Link--primary").attr("href");
        let company = title.split("@")[1]

        if (!company || company.length == 0) {
            company = title.split(" na ")[1]
        }
        let labels = []
        $(item).find(".labels > a ").toArray().forEach(label => {
            labels.push($(label).text().replace(/[\n]/g, "").trim())
        })
        const postedAt = $(item).find("relative-time").attr("datetime")
        if (title) {
            jobs.push({
                title, 
                workMode,
                company,
                link, 
                technologies: labels,
                postedAt
            })
        }
    })
    return jobs
}


(async () => {
    let response = await axios.get("https://github.com/backend-br/vagas/issues?q=is%3Aissue+is%3Aopen+")
    let html = response.data;
    let jobs = extractJobs(html)

    response = await axios.get("https://github.com/frontendbr/vagas/issues?q=is%3Aissue+is%3Aope")
    html = response.data;
    jobs = [...jobs, ...extractJobs(html)]
    console.log(jobs.length)
})()

