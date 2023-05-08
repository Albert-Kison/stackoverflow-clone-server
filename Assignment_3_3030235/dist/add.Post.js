console.log("Hello world");
const formElement = document.getElementById('addPost'); 
//when you press formElement button it sends text and link values to the data base
formElement.addEventListener('submit', (e) => {
  e.preventDefault();
  const text = document.getElementById('post').value;
  const link = document.getElementById('link').value;
  console.log(link);

  //fetch request to add post to the database
  fetch("https://protected-hamlet-05766.herokuapp.com/api/posts",
{
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem('jwt') 
    },
    method: "POST",
    body: JSON.stringify({
     link:link,
     text:text
    })
})
.then(function(res){ console.log(res) })
.catch(function(res){ console.log(res) })
});
