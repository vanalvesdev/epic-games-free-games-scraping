const http = require('http');
const puppeteer = require('puppeteer');

async function crawler() {

    console.log("starting scrape");
    const browserFetcher = puppeteer.createBrowserFetcher();
    const revisionInfo = await browserFetcher.download("884014");

    console.log(`downloaded chrome in ${revisionInfo.executablePath}`);

    const browser = await puppeteer.launch({
        headless: true,
        executablePath: revisionInfo.executablePath
    });
    const page = await browser.newPage();

    await page.goto('https://www.epicgames.com/store/en-US/');

    const data = await page.evaluate(() => {
        const freegames = [];
        const freeGamesHTML = document.querySelectorAll("[data-component='DiscoverContainerHighlighted'] section [data-component='CardGridDesktopBase']");

        freeGamesHTML.forEach(element => {
            let game = element.innerText;
            if (!game.includes("COMING SOON")){
                game = game.split('\n')

                freegames.push(game[1]);   
            }            
        });
        return freegames;
    })
    console.log("############################################")
    console.log(data);
    console.log("############################################")

    await browser.close();

    return data;
}

http.createServer(async (req, res) => {
    res.writeHead(200, {"Content-Type": "application/json"})
    const data = await crawler();
    res.end(JSON.stringify(data));
}).listen(process.env.PORT || 8080)