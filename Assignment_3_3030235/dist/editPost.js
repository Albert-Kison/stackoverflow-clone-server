console.log("editPost PAGE");
let initialData;
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
  // first program gets all posts and insert link of picture into input and text to textArea
    initialData = data;
    console.log(initialData);
    const container = document.querySelector('.container');
    const template = document.querySelector('.template');
    initialData.forEach(post => {
      const clone = template.content.cloneNode(true);
      const postContent = clone.querySelector('.post');
      postContent.textContent = post.text;
      const editPostButton = clone.querySelector('.editPost');
      const deletePostButton = clone.querySelector('.deletePost')
      const commentsContainer = clone.querySelector('.commentsContainer');

      const postImage = clone.querySelector('.image');
      console.log(postImage);
      postImage.value = post.link;
      editPostButton.id = post._id;
      deletePostButton.id = post._id;
      commentsContainer.id = post._id+"1";
      
      //also we get all the comments for each post and also insert them in textAreas
      post.comments.forEach(comment=>{
        const commentButtons = document.createElement('button');
        commentButtons.textContent = "delete";
        const editCommentsButtons = document.createElement('button');
        editCommentsButtons.textContent = "edit";
        commentButtons.id = comment._id;
        editCommentsButtons.id = comment._id;
        console.log(commentButtons);
        // creating buttons for deleting and editing comments
        commentButtons.addEventListener('click', () => {
            deleteComment(comment._id, post._id);
          });
        editCommentsButtons.addEventListener('click', (evt) => {
            editComment(comment.name,comment._id, post._id, evt);
          }); 
        const item =document.createElement('textarea');
        item.textContent = comment.text;
        commentsContainer.appendChild(item);
        commentsContainer.appendChild(editCommentsButtons);
        commentsContainer.appendChild(commentButtons);
      });
      editPostButton.addEventListener('click',editPost);
      deletePostButton.addEventListener('click',deletePost);

      container.appendChild(clone);
    });
  })
  .catch((error) => {
    console.error(error);
  });
  // this is function which sends POST request to edit chosen post by clicking editPost button
  function editPost(evt) {
    let postId = evt.target.id;
    let commentsContainer = document.getElementById(postId+"1");
    const postText = evt.target.previousElementSibling.value;
    const postArea =evt.target.previousElementSibling;
    const linkText = evt.target.previousElementSibling.previousElementSibling.value;
    const linkArea = evt.target.previousElementSibling.previousElementSibling;
    fetch(`https://protected-hamlet-05766.herokuapp.com/api/posts/${postId}`, {
      headers: {
        'Authorization': localStorage.getItem('jwt'),
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: "POST",
      body: JSON.stringify({
        link: linkText,
        text: postText
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
        window.location.reload(true);
      })
      .catch((err) => {
        console.error(err);
      });
  }
  //this is function which sents delete request to delete comment from data base by clicking delete button
  function deleteComment(commentId,postId){
    fetch(`https://protected-hamlet-05766.herokuapp.com/api/posts/${postId}/comments/${commentId}`, {
  headers: {
    'Authorization': localStorage.getItem('jwt'),
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  },
  method: "DELETE",
  body: JSON.stringify({
    _id:commentId
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
  window.location.reload(true);

})
.catch((err) => {
  console.error(err);
});

  }
  // this function sends delete request to delete post from data base by clicking delete button
  function deletePost(evt){
    let postId = evt.target.id;
    fetch(`https://protected-hamlet-05766.herokuapp.com/api/posts/${postId}`, {
  headers: {
    'Authorization': localStorage.getItem('jwt'),
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  },
  method: "DELETE"
})
.then((res) => {
  if (!res.ok) {
    throw new Error(`Error: ${res.status}`);
  }
  return res.json();
})
.then((data) => {
  console.log(data);
  window.location.reload(true);

})
.catch((err) => {
  console.error(err);
});

  }
  //this function sends patch request to edit comments by clicking edit button
  function editComment(name,commentId, postId,evt){
    const commentText = evt.target.previousElementSibling.value;
    console.log(commentText)
    fetch(`https://protected-hamlet-05766.herokuapp.com/api/posts/${postId}/comments/${commentId}`, {
  headers: {
    'Authorization': localStorage.getItem('jwt'),
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  },
  method: "PATCH",
  body: JSON.stringify({
    text:commentText,
    _id: commentId,
    name: name

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
  window.location.reload(true);

})
.catch((err) => {
  console.error(err);
});
  }
  