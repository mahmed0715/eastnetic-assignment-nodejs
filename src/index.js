/***
 * 
 * This is an assignment program that scraps data from otomoto site using the provided interface
 * This program uses: 
 * Nodejs: V18 as engine
 * Puppeteer v18.1.0 (the latest version has an issue with dependency on linux machine) for browsing and interacting with the web elements
 * Cheerio for parsing and traversing html
 * 
 * Author: Mustak Ahmed
 */
const puppeteer = require('puppeteer');
const cheerio = require('cheerio');

(async function () {

  // this array will hold all the add items at any point of given time
  const scrapedData = [];
  const INITIAL_URL = 'https://www.otomoto.pl/ciezarowe/uzytkowe/mercedes-benz/od-2014/q-actros?search%5Bfilter_enum_damaged%5D=0&search%5Border%5D=created_at%3Adesc';

  // to use to track the pagination and moving forward
  let currentPage = 1;

  // total add count that is available to scrap
  let totalAddsCount = 0;


  /***
   * Synchronous function to detect if we are in the last page of the paginated list
   * @param {Object} $ : cheerio object
   */
  function isLastPage($) {
    // the pagination uses go to next button with class pagination-item with some testid as attribute that is unique, we detect using cheerio
    const isDisabled = $('.pagination-item[data-testid="pagination-step-forwards"]').attr('aria-disabled');

    // If the pagination step forwards button is disabled, the pagination is finished, we are in the last page
    return isDisabled == 'true';
  }


  /***
   * Synchronous function to get the next page url in the pagiantion context
   * returns nextPageUrl as string;
   */
  function getNextPageUrl() {
    // the structure of pagination is like a page params in url with incremental numbers
    const nextPageUrl = `${INITIAL_URL + '&page=' + (++currentPage)}`;
    return nextPageUrl;
  }


  /**
   * Requirement: Add addItems function that fetches item urls + item ids (unique ids that the portal uses) from list page
   * Description: Synchronous function to add items
   * Fetching items from the ads list of current page, i.e itemUrl, itemId
   * @param {Object} $ - cheerio object
   * @returns {Array} itemUrl, itemId 
   */
  function addItems($) {
    const toScrapUrls = [];
    // Select all truck items on the page
    const truckItems = $('main[data-testid="search-results"] article.ev7e6t818');

    // Output the total number of truck items found on the page and current page index
    console.log("Total adds on this page with page index ", currentPage, truckItems.length);

    // Iterate over each truck item
    for (const truckItem of truckItems) {
      // Extract the 'data-id' attribute value from the current truck item
      const itemId = $(truckItem).attr('data-id');

      // Extract the URL of the truck item
      const itemUrl = $(truckItem).find('h1:first-child a').attr('href');

      // Log the item URL and ID
      console.log({ itemUrl, itemId });

      toScrapUrls.push({ itemId, itemUrl });

    }
    return toScrapUrls;
  }


  /***
   * Asynchronous function to scrap actual add item
   * @param {Array} toScrapUrls 
   */
  async function scrapAdds(toScrapUrls) {
    // iterate over the urls array and scrap one by one
    for (let urlItems of toScrapUrls) {
      // get the item url from the item
      const { itemId, itemUrl } = urlItems;

      // call scrapeTruckItem with itemUrl to scrap that add element
      const formattedScrasppedData = await scrapeTruckItem(itemUrl, itemId);

      console.log({ itemId, ...formattedScrasppedData });

      // we store the scrapped in our array container
      scrapedData.push({ itemId, ...formattedScrasppedData });
    }

    console.log("So far scrapped adds count:", scrapedData.length);
  }

  /***
   * Synchronous function to scrap the total adds count in the given url
   * @param {object} $ - cheerio object 
   * @returns totalAddsCount as number
   */
  function getTotalAdsCount($) {
    // we will get string like `Liczba .. 888`, we will extract the number
    const toatalAdsCountRegex = new RegExp(/(\d+)/);

    // get the text that contains the total adds count 
    const text = $('h4.ooa-4mrwuj.er34gjf0').next('p').text().trim();

    // check if the text we extracted has the number of ads count
    const match = text.match(toatalAdsCountRegex);

    // we the match found we extract it from the index 1 as there is tracking group in the regex (\d+)
    if (match) {
      totalAddsCount = match[1];
    } else {
      console.log("Could not parse total adds count!!");
    }
    // displaying total ads count as pre requirement
    console.log("Total adds count:", totalAddsCount);
    return totalAddsCount;
  }


  /***
   * Synchronous function to detect the label of the data we require to scraq and return the corresponding value
   * 
   */
  function findPropertyValue($, keyword) {
    const textLabel = $(this).find('span.offer-params__label').text().trim();
    if (keyword.test(textLabel)) {
      const value = $(this).find('div.offer-params__value').text().trim();
      return value.replace(/\s/g, '');
    };
  }

  /***
   * Async function to scrap the add items data 
   * @param {string} url
   * @param {string} itemId  
   * @returns {Array} 
   */

  async function scrapeTruckItem(url, itemId) {
    // we get the cheerio object
    const $ = await launchBrowerInstance(url);

    // get the tital of the item
    const title = $('h1.offer-title.big-text').first().text().trim();

    // get the price number
    const price = $('.visible-mweb div.offer-price').attr('data-price');

    // get the currency string
    const currency = $('.visible-mweb span.offer-price__currency').text().trim();

    // concat the price and currency to build the proper price
    const priceWithCurrency = price.replace(/\D/g, '') + currency;

    // to hold values from the list of properties for the add
    const truckItemValues = {
      registrationDate: '',
      productionDate: '',
      mileage: '',
      power: ''
    }

    // there are lots of offer params item, we iterate and match our required string and extract the proper value
    $('.offer-params__list .offer-params__item').map(function () {

      // to match and extract the value by string for registration date
      let data = findPropertyValue.call(this, $, /pierwszej rejestracji/);
      // if the current element is the matching one only that time it returns the value
      data && (truckItemValues.registrationDate = data);


      // for production date
      data = findPropertyValue.call(this, $, /Rok produkcji/);
      // if the current element is the matching one only that time it returns the value
      data && (truckItemValues.productionDate = data)

      // for mileage
      data = findPropertyValue.call(this, $, /Przebieg/)
      // if the current element is the matching one only that time it returns the value
      data && (truckItemValues.mileage = data)

      // for power
      data = findPropertyValue.call(this, $, /Moc/);
      // if the current element is the matching one only that time it returns the value
      data && (truckItemValues.power = data)

    });

    // return object structured as per requirement : item id, title, price, registration date, production date, mileage, power
    return { itemId, title, price: priceWithCurrency, ...truckItemValues };
  }

  /***
   * on each load of an url there is a confirmation modal coming up, we need to accept the cookie policy
   */
  async function acceptCookie($, page) {
    const acceptBtn = '#onetrust-accept-btn-handler';
    const acceptButtonLength = $(acceptBtn).length;
    if (acceptButtonLength > 0) {
      const acceptAction = await page.$(acceptBtn);
      acceptAction && await acceptAction.click();
    }
  }

/***
 * Retry functionality
 */
  async function retry(promiseFactory, retryCount) {
    try {
      return await promiseFactory();
    } catch (error) {
      if (retryCount <= 0) {
        throw error;
      }
      return await retry(promiseFactory, retryCount - 1);
    }
  }

  /***
   * launch browser instance and load the url, parse the content in cheerio object and return
   * @param {*} url 
   */
  async function launchBrowerInstance(url) {
    let browser;
    try {
      browser = await puppeteer.launch({
        headless: true,
        args: [
          '--disable-gpu',
          '--disable-dev-shm-usage',
          '--disable-setuid-sandbox',
          '--no-first-run',
          '--no-sandbox',
          '--no-zygote',
          '--deterministic-fetch',
          '--disable-features=IsolateOrigins',
          '--disable-site-isolation-trials',
          // '--single-process',
        ],
      });

      const page = await browser.newPage();
      page.setDefaultNavigationTimeout(0);

      // use retry mechanism to go to the url provided
      await retry(
        () => Promise.all([
          page.goto(url),
          page.waitForNavigation({ waitUntil: 'domcontentloaded' }),
        ]),
        3 // retry 3 times
      );

      const html = await page.content();

      // Load the HTML content into Cheerio for parsing
      const $ = cheerio.load(html);
      await acceptCookie($, page);

      return $;
    } catch (error) {
      console.error('Error occurred:', error);
      return null;
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  }

  /***
   * Async function to scrap all pages in the pagination context
   */
  async function scrapeOtomotoPages() {
    // launch browser instance with the initial Url provided, get the cheerio object out of it
    const $ = await launchBrowerInstance(INITIAL_URL);

    // we showed the total adds count in the method itself as per requirement
    totalAddsCount = getTotalAdsCount($);

    // scrap the first page, get the items at first place
    const toScrapUrls = addItems($);
    // scrap all adds for the first page for the items we got
    await scrapAdds(toScrapUrls)

    // scrap all other pages, recursively
    scrapAllPagesRec();

  }

  /***
   * Recursive function to scrapp all the pages in the pagination context
   */
  async function scrapAllPagesRec() {
    const nextPageUrl = getNextPageUrl();

    const $ = await launchBrowerInstance(nextPageUrl);

    // get the itm urls and ids from the current page
    const toScrapUrls = addItems($);
    // scrap adds
    await scrapAdds(toScrapUrls);

    // if we are at the last page in the list, stop and return
    if (isLastPage($)) {
      return;
    }
    // otherwise continue scrapping next page
    scrapAllPagesRec();
  }

  // initiate scrapping from here, call the initiator method
  scrapeOtomotoPages()
    .then((_) => {
      console.log("Total adds in the given url ", totalAddsCount)
      console.log("Finished scrapping, total adds scrapped ", scrapedData.length);
    }).catch((error) => {
      console.error('An error occurred:', error);
    });

})();