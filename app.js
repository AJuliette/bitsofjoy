import { SPACE_ID, ACCESS_TOKEN } from "./setup/credentials.js";

const endpoint = "https://graphql.contentful.com/content/v1/spaces/" + SPACE_ID;

const query = `{
  microblogCollection {
    items {
      sys {
        firstPublishedAt
        id
      }
      text
      image {
        url
        title
        width
        height
        description
      }
      emoji
      title
      link
      linkText
    }
  }
}`;

const fetchOptions = {
  method: "POST",
  headers: {
    Authorization: "Bearer " + ACCESS_TOKEN,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ query }),
};

const getMonthStringFromInt = (int) => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  return months[int];
};

const addLeadingZero = (num) => {
  num = num.toString();
  while (num.length < 2) num = "0" + num;
  return num;
};

const renderFooterDate = () => {
  const footerYearHolder = document.querySelector("[data-footer-year]");
  const timestamp = Date.now();
  const date = new Date(timestamp);
  footerYearHolder.innerText = date.getFullYear();
};

const formatPublishedDateForDateTime = (dateString) => {
  const timestamp = Date.parse(dateString);
  const date = new Date(timestamp);
  return `${date.getFullYear()}-${addLeadingZero(date.getMonth() + 1)}-${date.getDate()}`;
};

const formatPublishedDateForDisplay = (dateString) => {
  const timestamp = Date.parse(dateString);
  const date = new Date(timestamp);
  return `${date.getDate()} ${getMonthStringFromInt(date.getMonth())} ${date.getFullYear()}`;
};

const microblogHolder = document.querySelector("[data-items]");

const itemClassNames = {
  container: "item__container",
  topRow: "item__topRow",
  date: "item__date",
  title: "item__title",
  img: "item__img",
  link: "item__link",
  emoji: "item__emoji",
  text: "item__text",
};

const renderItems = (items) => {
  items.forEach((item) => {
    const newItemEl = document.createElement("article");
    newItemEl.setAttribute("id", item.sys.id);
    newItemEl.className = itemClassNames.container;

    const newTopRow = document.createElement("div");
    newTopRow.className = itemClassNames.topRow;

    const newEmojiEl = document.createElement("p");
    newEmojiEl.innerText = item.emoji;
    newEmojiEl.className = itemClassNames.emoji;
    newTopRow.appendChild(newEmojiEl);

    const newDateEl = document.createElement("time");
    newDateEl.setAttribute("datetime", formatPublishedDateForDateTime(item.sys.firstPublishedAt));
    newDateEl.innerText = formatPublishedDateForDisplay(item.sys.firstPublishedAt);
    newDateEl.className = itemClassNames.date;
    newTopRow.appendChild(newDateEl);

    newItemEl.appendChild(newTopRow);

    if (item.title) {
      const newTitlEl = document.createElement("h2");
      newTitlEl.innerText = item.title;
      newTitlEl.className = itemClassNames.title;
      newItemEl.appendChild(newTitlEl);
    }

    if (item.image) {
      const newImgEl = document.createElement("img");
      newImgEl.src = `${item.image.url}?w=500`;
      newImgEl.alt = item.image.description;
      newImgEl.setAttribute("width", item.image.width);
      newImgEl.setAttribute("height", item.image.height);
      newImgEl.className = itemClassNames.img;
      newItemEl.appendChild(newImgEl);
    }

    if (item.text) {
      const newTextEl = document.createElement("h3");
      newTextEl.innerText = item.text;
      newTextEl.className = itemClassNames.text;
      newItemEl.appendChild(newTextEl);
    }

    if (item.link) {
      const newLinkEl = document.createElement("a");
      newLinkEl.href = item.link;
      newLinkEl.innerText = item.linkText || "View more";
      newLinkEl.setAttribute("target", "_blank");
      newLinkEl.setAttribute("rel", "noopener noreferrer");
      newLinkEl.className = itemClassNames.link;
      newItemEl.appendChild(newLinkEl);
    }

    microblogHolder.appendChild(newItemEl);
  });
};

renderFooterDate();

fetch(endpoint, fetchOptions)
  .then((response) => response.json())
  .then((data) => renderItems(data.data.microblogCollection.items));
