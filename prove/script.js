function getUser() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      Math.random() < 0.2
        ? reject("User not found")
        : resolve({ id: 1, name: "Ale" });
    }, Math.random() * 1000);
  });
}

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

let write = function (some)
{
	if (typeof(some) != "object")
	{
		document.getElementById("output").innerHTML = some;
		return ;
	}
	document.getElementById("output").innerHTML = "";
	for ( let x of some)
	{
		document.getElementById("output").innerHTML += x["text"] + "\n";
	}
}

let read = function (func_name)
{
	document.getElementById("load").addEventListener("click", func_name);
}

async function main() {
	let user;
	let posts;

	write("Loading...");
	try
	{
		user = await getUser();
		posts = await getPosts(user.id);
		const promises = posts.map((p) => getComments(p.id));
		const allComments = await Promise.all(promises);
		write(allComments.flat());
	}
	catch (error)
	{
		write(error);
		return ;
	}
}

read(main);