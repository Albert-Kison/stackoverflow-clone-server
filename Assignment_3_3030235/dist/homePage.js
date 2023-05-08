
console.log("Hello world 2");
let initialData;
//send request to get all posts on a home page
fetch("https://protected-hamlet-05766.herokuapp.com/api/getPosts",
{
headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  },
})
.then((res) => {
    if (!res.ok) {
        return Promise.reject(`Error: ${res.status}`);
    }
     return res.json();
})

.then((data) => {
    initialData = data;
    console.log(initialData);
    const container = document.querySelector('.container');
    const template = document.querySelector('.template');
    initialData.forEach(post => {
      const clone = template.content.cloneNode(true);
      const postContent = clone.querySelector('.post');
      postContent.textContent = post.text;
      const commentButtons = clone.querySelector('.addComment');
      const showCommentsButton = clone.querySelector('.showComments');
      const showDetailsButton = clone.querySelector('.showDetails');
      const commentsContainer = clone.querySelector('.commentsContainer');
      const popup = document.querySelector('.popup');
      const popupComments = document.querySelector('.popup_comments');
      const popupCommentsButton = document.querySelector('.popupAddComment');
      const popupCommentSpace = document.querySelector('.popupCommentSpace');
      const commentsPopupContainer = document.querySelector('.comments_Popup_Container');
      const closePopupComments = document.querySelector('.closePopupComments');
      const closePopup = document.querySelector('.closePopup');
      showCommentsButton.addEventListener('click',function(){
        popupCommentsButton.id = post._id;
        commentsPopupContainer.id = post._id +"1";
        post.comments.forEach(comment=>{
          const item =document.createElement('p');
          item.innerHTML = comment.name +"<br>"+comment.text;
          commentsPopupContainer.prepend(item)
        });
        closePopupComments.addEventListener('click',function(){
          popupComments.classList.remove('popup_comments_active');
          document.body.classList.remove("popup_active");
          commentsPopupContainer.innerHTML = "";
        });
        popupComments.classList.add('popup_comments_active');
        document.body.classList.toggle("popup_active");
      })
      showDetailsButton.addEventListener('click',function(){
        const imagePopup = document.querySelector('.imagePopup');
        const textPopup = document.querySelector('.textPopup')
        textPopup.textContent = post.text;
        imagePopup.src = post.link;
        console.log('privet');
        console.log(popup);
        closePopup.addEventListener('click',function(){
          popup.classList.remove('popup_active');
          document.body.classList.remove("popup_active");
          imagePopup.src = "";
          textPopup.textContent="";
        });
        popup.classList.add('popup_active');
        document.body.classList.toggle("popup_active");
      })
      const postImage = clone.querySelector('.image');
      postImage.src = post.link;
      popupCommentsButton.addEventListener('click',addComment);
      //create multiple clones and insert post information inside each. All clones of template are added into container
      container.appendChild(clone);
    });
  })
  .catch((error) => {
    console.error(error);
  });
  const adminLinks = document.querySelectorAll('.admin');
let isAdmin = localStorage.getItem('admin');

if (isAdmin === 'false' || isAdmin === null) {
  adminLinks.forEach(link => {
    link.style.display = 'none';
  });
}
//This function (works only if user is authorized) sends put request to add comment to the post
  function addComment(evt) {
    let postId = evt.target.id;
    let commentsContainer = document.getElementById(postId+"1");
    const commentText = evt.target.previousElementSibling.value;
    const commentArea =evt.target.previousElementSibling;
    fetch(`https://protected-hamlet-05766.herokuapp.com/api/posts/comments/${postId}`, {
      headers: {
        'Authorization': localStorage.getItem('jwt'),
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: "PUT",
      body: JSON.stringify({
        text: commentText,
        name: localStorage.getItem('name')
      })
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Error: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log(data);
        let p = document.createElement('p');
        p.innerHTML = localStorage.getItem('name')+"<br>"+commentText;
        commentsContainer.prepend(p);
        commentArea.value = '';
        window.location.reload(true);
      })
      .catch((err) => {
        console.error(err);
      });
  }
  
  
  
  




