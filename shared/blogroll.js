// get query string
const queryString = window.location.search;
// get url params
const urlParams = new URLSearchParams(queryString);
// get blogroll param
const iframe = urlParams.get('iframe');

if (!iframe){
    const anchorTag = document.createElement("a");  
    anchorTag.href = "https://www.kristinefernandez.com/blog";
    anchorTag.target = "_blank";
    anchorTag.innerText = "Back to kristinefernandez.com";
    anchorTag.classList.add("blogroll");
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "../shared/blogroll.css";
    document.getElementsByTagName("head")[0].appendChild(link);
    document.getElementsByTagName("body")[0].appendChild(anchorTag);
}