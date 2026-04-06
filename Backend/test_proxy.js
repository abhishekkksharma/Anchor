fetch('http://localhost:5000/api/news/articles?q=developer%20OR%20software%20OR%20technology%20OR%20startup&domains=techcrunch.com,arstechnica.com,wired.com,thenextweb.com,hackernoon.com,theverge.com,infoworld.com&from=2024-03-27&language=en&sortBy=relevancy&pageSize=20')
  .then(res => {
      console.log('Status code:', res.status);
      return res.text();
  })
  .then(text => console.log('Response:', text.substring(0, 500)))
  .catch(err => console.error('Error fetching:', err));
