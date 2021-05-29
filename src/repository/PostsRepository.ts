export async function getPostsByNextPage(nextPage: string) {
  let result = [];
  await fetch(nextPage)
    .then(response => response.json())
    .then(data => (result = data));
}
