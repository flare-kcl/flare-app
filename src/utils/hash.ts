// Utility method used to generate unqique strings
// https://lowrey.me/implementing-javas-string-hashcode-in-javascript/
export const hashCode = function (str: string) {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash += Math.pow(str.charCodeAt(i) * 31, str.length - i)
    hash = hash & hash // Convert to 32bit integer
  }
  return hash
}
