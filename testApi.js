fetch('http://localhost:4000/api/pizzas')
  .then(res => res.json().then(data => ({ status: res.status, data })))
  .then(console.log)
  .catch(console.error);
