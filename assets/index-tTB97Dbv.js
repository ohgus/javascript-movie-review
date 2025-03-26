(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity) fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
    else fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
const CustomButton = ({
  title,
  className = "",
  id = ""
}) => {
  const customButton = document.createElement("button");
  customButton.className = `primary detail ${className}`;
  customButton.textContent = title;
  customButton.id = id;
  return customButton;
};
const ErrorPage = () => {
  const errorPageContainer = document.createElement("div");
  errorPageContainer.className = "error-page-container";
  errorPageContainer.innerHTML = /*html*/
  `
      <img src="images/으아아행성이.png" alt="error-page-image" class="error-page-image" />
      <h1>오류가 발생했습니다.</h1>
      ${CustomButton({
    title: "홈으로 돌아가기",
    className: "error-page-button"
  }).outerHTML}
  `;
  const errorPageButton = errorPageContainer.querySelector(".error-page-button");
  errorPageButton.addEventListener("click", () => {
    window.location.replace("/");
  });
  return errorPageContainer;
};
const url$1 = (page) => `https://api.themoviedb.org/3/movie/popular?language=ko-KR&page=${page}`;
const options$1 = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${"eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3N2Y0ZmFlZTIxYmQ0M2YwMWY5ZmQ1ZDlkNjY1M2EyNyIsIm5iZiI6MTc0MjI3NDc2Ni43MDEsInN1YiI6IjY3ZDkwMGNlMGFmNjIyNThhOTM2NGRkOCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.ModchKnwSChKrlLlxvrvG4WdY6TtJoqW65DmX_o98b0"}`
  }
};
const getMovieList = async ({ page }) => {
  try {
    const response = await fetch(url$1(page), options$1);
    if (!response.ok) {
      throw new Error("Failed to fetch movie list");
    }
    return response.json();
  } catch (error) {
    const $container = document.querySelector(".container");
    $container.replaceChildren(ErrorPage());
  }
};
const url = (query, page) => `https://api.themoviedb.org/3/search/movie?query=${query}&include_adult=true&language=ko-KR&page=${page}`;
const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${"eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3N2Y0ZmFlZTIxYmQ0M2YwMWY5ZmQ1ZDlkNjY1M2EyNyIsIm5iZiI6MTc0MjI3NDc2Ni43MDEsInN1YiI6IjY3ZDkwMGNlMGFmNjIyNThhOTM2NGRkOCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.ModchKnwSChKrlLlxvrvG4WdY6TtJoqW65DmX_o98b0"}`
  }
};
const getSearchedPost = async (query, page) => {
  try {
    const response = await fetch(url(query, page), options);
    if (!response.ok) {
      throw new Error("Failed to fetch searched post");
    }
    return response.json();
  } catch (error) {
    const $container = document.querySelector(".container");
    $container.replaceChildren(ErrorPage());
  }
};
const SearchForm = () => {
  const searchForm = document.createElement("form");
  searchForm.classList.add("search-form");
  searchForm.innerHTML = /*html*/
  `
    <input
      id="search-input"
      name="search-input"
      type="text"
      placeholder="검색어를 입력하세요"
    />
    <button type="submit" class="search-button">
      <img src="images/search.png" alt="Search" />
    </button>
`;
  return searchForm;
};
const MoviePost = (movie) => {
  const moviePost = document.createElement("li");
  const movieImgPath = movie.poster_path ? `https://media.themoviedb.org/t/p/w440_and_h660_face${movie.poster_path}` : "images/nullImage.png";
  moviePost.innerHTML = /*html*/
  `
    <div class="item">
      <img
        class="thumbnail"
        src=${movieImgPath}
        alt=${movie.title}
      />
      <div class="item-desc">
        <p class="rate">
          <img src="images/star_empty.png" class="star" /><span
            >${movie.vote_average.toFixed(1)}</span
          >
        </p>
        <strong>${movie.title}</strong>
      </div>
    </div>
  `;
  return moviePost;
};
const EmptySearchResult = () => {
  const emptySearchResult = document.createElement("div");
  emptySearchResult.classList.add("empty-search-result-container");
  emptySearchResult.innerHTML = /*html*/
  `
    <img src="images/으아아행성이.png" alt="검색 결과가 없습니다." class="empty-search-result-image"/>
    <p class="empty-search-result-text">검색 결과가 없습니다.</p>
  `;
  return emptySearchResult;
};
function showEmptySearchResult() {
  const $movieContainer = document.getElementById("movie-container");
  const $emptySearchResult = document.querySelector(
    ".empty-search-result-container"
  );
  if (!$emptySearchResult) {
    $movieContainer == null ? void 0 : $movieContainer.appendChild(EmptySearchResult());
  }
  const $moreMoviesButton = document.getElementById("more-movies-button");
  $moreMoviesButton == null ? void 0 : $moreMoviesButton.classList.add("disabled");
}
function addMoviePost(movieList, $movieList) {
  if (movieList.length === 0) {
    showEmptySearchResult();
    return;
  }
  const $emptySearchResult = document.querySelector(
    ".empty-search-result-container"
  );
  const $moreMoviesButton = document.getElementById("more-movies-button");
  if ($emptySearchResult) {
    $emptySearchResult.remove();
    $moreMoviesButton == null ? void 0 : $moreMoviesButton.classList.remove("disabled");
  }
  const fragment = document.createDocumentFragment();
  movieList.forEach((movie) => {
    fragment.appendChild(MoviePost(movie));
  });
  $movieList.appendChild(fragment);
}
const MovieSkeleton = () => {
  const skeletonItem = document.createElement("li");
  skeletonItem.innerHTML = /*html*/
  `
      <div class="item skeleton-item">
        <div class="thumbnail skeleton-thumbnail"></div>
        <div class="item-desc">
          <p class="rate skeleton-rate"></p>
          <div class="skeleton-title"></div>
        </div>
      </div>
    `;
  return skeletonItem;
};
const createSkeletons = (count = 10) => {
  const fragment = document.createDocumentFragment();
  for (let i = 0; i < count; i++) {
    fragment.appendChild(MovieSkeleton());
  }
  return fragment;
};
function showSkeletons($container, count = 20) {
  $container.appendChild(createSkeletons(count));
}
function disableMoreButton(totalPages, currentPage, movieList) {
  const $moreMoviesButton = document.getElementById("more-movies-button");
  if (totalPages === currentPage || movieList.length < 20) {
    $moreMoviesButton == null ? void 0 : $moreMoviesButton.classList.add("disabled");
  }
}
const searchFormSubmitHandler = async (e) => {
  const formData = new FormData(e.target);
  const searchQuery = formData.get("search-input");
  const params = new URLSearchParams({
    page: "1",
    query: searchQuery
  });
  const pageNum = params.get("page") ? parseInt(params.get("page")) : 1;
  const searchedMovies = await getSearchedPost(searchQuery, pageNum);
  updateSearchPageUI(
    searchedMovies.results,
    searchedMovies.total_pages,
    params
  );
  const newUrl = `${window.location.pathname}?${params.toString()}`;
  history.pushState(null, "", newUrl);
};
function updateSearchPageUI(searchedMovies, searchedMoviesTotalPages, params) {
  const $thumbnailList = document.querySelector(
    ".thumbnail-list"
  );
  const $movieListTitle = document.querySelector(".movie-list-title");
  const pageNum = params.get("page") ? parseInt(params.get("page")) : 1;
  const query = params.get("query");
  if (!$thumbnailList || !$movieListTitle) return;
  $thumbnailList.innerHTML = "";
  showSkeletons($thumbnailList);
  $movieListTitle.textContent = `"${query}" 검색 결과`;
  $thumbnailList.innerHTML = "";
  addMoviePost(searchedMovies, $thumbnailList);
  disableHeaderImage();
  disableMoreButton(searchedMoviesTotalPages, pageNum, searchedMovies);
}
function disableHeaderImage() {
  const $overlay = document.querySelector(".overlay");
  $overlay == null ? void 0 : $overlay.classList.add("disabled");
  const $topRatedMovie = document.querySelector(".top-rated-movie");
  $topRatedMovie == null ? void 0 : $topRatedMovie.classList.add("disabled");
  const $backgroundContainer = document.querySelector(".background-container");
  $backgroundContainer == null ? void 0 : $backgroundContainer.classList.add("background-container-disabled");
}
const Header = (movie) => {
  const $header = document.getElementById("header");
  if (!$header) {
    return;
  }
  $header.innerHTML = /*html*/
  `
    <div class="background-container">
      <div class="overlay" aria-hidden="true">
        <img src="https://media.themoviedb.org/t/p/w440_and_h660_face${movie.poster_path}" alt="MovieList" />
      </div>
      <div class="top-rated-container">
        <div class="header-container">
          <a href="/javascript-movie-review/" class="logo">
            <img src="images/logo.png" alt="MovieList" />
          </a>
          ${SearchForm().outerHTML}
        </div>
        <div class="top-rated-movie">
          <div class="rate">
            <img src="images/star_empty.png" class="star" />
            <span class="rate-value">${movie.vote_average}</span>
          </div>
          <div class="title">${movie.title}</div>
          ${CustomButton({ title: "자세히 보기" }).outerHTML}
        </div>
      </div>
    </div>
  `;
  const $searchForm = document.querySelector(".search-form");
  $searchForm == null ? void 0 : $searchForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    searchFormSubmitHandler(e);
  });
};
async function addMoreMovies($movieList) {
  const params = new URLSearchParams(window.location.search);
  const query = params.get("query") ?? null;
  const pageStr = params.get("page");
  const currentPage = pageStr ? parseInt(pageStr) : 1;
  const nextPage = currentPage + 1;
  if (!pageStr) return;
  params.set("page", nextPage.toString());
  const movies = await getCurrentMovieList(nextPage, query);
  addMoviePost(movies.results, $movieList);
  disableMoreButton(movies.total_pages, currentPage, movies.results);
  const newUrl = `${window.location.pathname}?${params.toString()}`;
  history.pushState(null, "", newUrl);
}
async function getCurrentMovieList(page, query) {
  if (query) {
    return await getSearchedPost(query, page);
  }
  return await getMovieList({ page });
}
addEventListener("DOMContentLoaded", async () => {
  const $movieList = document.querySelector(".thumbnail-list");
  await initMovieList($movieList);
  await initAddMoreMoviesButton($movieList);
});
async function initMovieList(movieList) {
  const url2 = new URL(window.location.href);
  const params = new URLSearchParams(url2.search);
  const query = params.get("query");
  const movies = query ? await getSearchedPost(query, 1) : await getMovieList({ page: 1 });
  if (!movies || !movieList) return;
  showSkeletons(movieList);
  Header(movies.results[0]);
  if (query) {
    initializeUrl(url2);
    updateSearchPageUI(movies.results, movies.total_pages, url2.searchParams);
  } else {
    initializeUrl(url2);
    movieList.innerHTML = "";
    addMoviePost(movies.results, movieList);
  }
}
async function initAddMoreMoviesButton(movieList) {
  const $movieContainer = document.getElementById("movie-container");
  if (!$movieContainer) return;
  const addMoreMoviesButton = CustomButton({
    title: "더보기",
    className: "add-more-button",
    id: "more-movies-button"
  });
  $movieContainer.appendChild(addMoreMoviesButton);
  const $moreMoviesButton = document.getElementById("more-movies-button");
  if (!$moreMoviesButton) return;
  $moreMoviesButton.addEventListener("click", async () => {
    if (!movieList) return;
    await addMoreMovies(movieList);
  });
}
function initializeUrl(url2) {
  url2.searchParams.set("page", "1");
  window.history.replaceState({}, document.title, url2.toString());
}
