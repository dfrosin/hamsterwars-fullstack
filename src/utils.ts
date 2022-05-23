function fixUrl(url: string): string {
  if (import.meta.env.MODE === 'development') {
    console.log('DEV MODE')
    return 'http://localhost:8090' + url
  } else {
    console.log('PRODUCTION MODE')
    return url
  }
}
function correctImgName(imgName: string) {
  if (imgName.startsWith('https:')) {
    return imgName
  } else {
    return fixUrl(`/img/${imgName}`)
  }
}
export { fixUrl, correctImgName }
