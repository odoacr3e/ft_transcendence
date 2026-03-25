export async function printPost(event)
{
	const response = await fetch("https://jsonplaceholder.typicode.com/posts?userId=" + event.currentTarget.id);
	const posts = await response.json();
	const ul = document.getElementById("gay");
	document.getElementById("gay").innerHTML = "";
    for (let post of posts)
	{
		console.log(post);
		const li = document.createElement("li");
    	li.textContent = post.body;
		li.id = post.id;
    	ul.appendChild(li);
	}
}