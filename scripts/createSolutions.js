const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

function main(solutionsDir, outputFile) {
    var solutions = {};
    
    let dirContent = fs.readdirSync(solutionsDir);
    dirContent.forEach(function (dirItem) {
        item = `${solutionsDir}/${dirItem}`;
        fileStats = fs.lstatSync(item);

        if (!fileStats.isFile()) {
            var indexHtmlPath = path.join("./", item, "index.html");
            var indexHtml = cheerio.load(fs.readFileSync(indexHtmlPath));
            var headline = indexHtml("h1").first().text() || indexHtml("h2").first().text() || indexHtml("h3").first().text();
            var imagePath = indexHtml("img").attr("src");
            var snippet = indexHtml(".paragraph").text();
            solutions[dirItem] = {
                headline: headline,
                path: `solutions/${dirItem}`,
                image: `solutions/${imagePath}`,
                snippet: snippet
            }
        }
    });
    console.log(solutions);
    fs.writeFileSync(path.join("./", outputFile), JSON.stringify(solutions));
}

if (process.argv.length > 3) {

    main(process.argv[2], process.argv[3]);
}