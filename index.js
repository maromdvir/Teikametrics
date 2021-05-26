
const parse = require('node-html-parser').parse;
const axios = require('axios');

const EBAY_URL = 'https://www.ebay.com/sch/i.html';

const retrieveRelatedSearches = html => html.querySelector(".srp-related-searches")
                                            .querySelectorAll('a')
                                            .map( x => x.innerText);


const retrieveProducts = html => html.querySelector('.srp-results')
                                     .querySelectorAll('.s-item')
                                     .map(retrieveProduct)


const retrieveProduct = (item, i) => {
    return {
        Position: i+1,
        Title: item.querySelector('h3').innerText,
        Price: item.querySelector('.s-item__price').innerText,
        Sponserd: Boolean(item.querySelector('.s-item__sep').innerText),
        Shipping: item.querySelector('.s-item__shipping').innerText,
        ShipsFrom: item.querySelector('.s-item__location').innerText,
        Image: item.querySelector('img').getAttribute('src')
    }
}; 



const search = async (searchTerm) =>{
    try {
      const response = await axios.get(`${EBAY_URL}?_nkw=${searchTerm}`);
      const html = parse(response.data);
      return {
        relatedSearches: retrieveRelatedSearches(html),
        products: retrieveProducts(html)
      };
    } catch (error) {
      console.error(error);
    }
  }

  (async () => {
    try {
      const data = await search('running shoes')
      console.log(data); 
    } catch (error) {
      console.log(error);
    }
  })();
