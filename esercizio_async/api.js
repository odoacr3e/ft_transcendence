// @ts-check
/**
 * 
 * @returns {Promise<{ id: number; name: string }>}
 */
function getUser() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      Math.random() < 0.2
        ? reject("User not found")
        : resolve({ id: 1, name: "Ale" });
    }, Math.random() * 1000);
  });
}

/**
 * 
 * @param {number} userId 
 * @returns {Promise<Array<{ id: number; title: string }>>} -> array di oggetti {id, title}  // string
 */
function getPosts(userId) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      Math.random() < 0.2
        ? reject("Posts error")
        : resolve([
            { id: 1, title: "Post 1" },
            { id: 2, title: "Post 2" }
          ]);
    }, Math.random() * 1000);
  });
}

/**
 * 
 * @param {number} postId
 * @returns {Promise<Array<{ text: string }>>} -> array di oggetti {text} // string
 */
function getComments(postId) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      Math.random() < 0.2
        ? reject("Comments error")
        : resolve([
            { text: "Nice post" },
            { text: "Meh" }
          ]);
    }, Math.random() * 1000);
  });
}

module.exports = {getUser, getPosts, getComments}