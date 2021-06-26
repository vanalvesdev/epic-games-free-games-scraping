let puppeteer;
let chrome = {};

if (process.env.AWS_LAMBDA_FUNCTION_VERSION) {
    // running on the Vercel platform
    chrome = require('chrome-aws-lambda');
    puppeteer = require('puppeteer-core');
} else {
    // running locally
    puppeteer = require('puppeteer');
}

(async () => {

    console.log("starting scrape");

    const options = process.env.AWS_LAMBDA_FUNCTION_VERSION ? 
        {
            headless: true,
            executablePath: await chrome.executablePath,
            defaultViewport: chrome.defaultViewport,
            args: [...chrome.args, '--hide-scrollbars', '--disable-web-security']   
        } : 
        {
            headless: false,
        }

    const browser = await puppeteer.launch(options);
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

        // const section = frame.querySelector("section");
        // const freeGamesDiv = section.querySelectorAll("[data-component='CardGridDesktopBase']");
        return freegames;
    })

    // await page.screenshot({path: '1.png'});

    // await page.evaluate(() => {
    //     console.log(document.title);
    //     const test = document.querySelector("#egLogo");
    //     console.log("test");
    //     return test;
    // }).then().catch(err => console.log(err));
    console.log("############################################")
    console.log(data);
    console.log("############################################")

    await browser.close();

    return data;
})();

module.exports = async (req, res) => {
    res.send(JSON.stringify(await crawler()));
}