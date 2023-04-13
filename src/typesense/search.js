import typesenseClient from "./client";


export default function searchUsers(query) {
  let search = {
    'q' : query,
    'query_by': 'displayName',
  }
  
  return typesenseClient.collections('users')
    .documents()
    .search(search)
    .then((searchResults) => {
      return searchResults
    })
  
}