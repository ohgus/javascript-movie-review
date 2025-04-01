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
  customButton.className = `primary ${className}`;
  customButton.textContent = title;
  customButton.id = id;
  return customButton;
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
const showErrorPage = () => {
  const $container = document.querySelector(".container");
  if (!$container) return;
  $container.replaceChildren(ErrorPage());
};
const setParams = (query = "") => {
  const params = new URLSearchParams(window.location.search);
  if (query !== "") {
    params.set("query", query);
  }
  const newUrl = `${window.location.pathname}?${params.toString()}`;
  history.pushState(null, "", newUrl);
};
const pageManager = {
  currentPage: 1,
  totalPages: 1,
  incrementCurrentPage() {
    this.currentPage++;
  },
  setTotalPages(totalPages) {
    this.totalPages = totalPages;
  },
  resetPage() {
    this.currentPage = 1;
  },
  isLastPage() {
    return this.currentPage >= this.totalPages;
  }
};
const mapToMovie = (movie) => {
  return {
    id: movie.id,
    backdrop_path: movie.backdrop_path,
    original_language: movie.original_language,
    original_title: movie.original_title,
    overview: movie.overview,
    poster_path: movie.poster_path,
    release_date: movie.release_date,
    title: movie.title,
    vote_average: movie.vote_average
  };
};
const mapToMovieList = (moviesResponse) => {
  return {
    page: moviesResponse.page,
    results: moviesResponse.results.map(mapToMovie),
    total_pages: moviesResponse.total_pages,
    total_results: moviesResponse.total_results
  };
};
const mapToMovieDetail = (movieDetailResponse) => {
  return {
    id: movieDetailResponse.id,
    backdrop_path: movieDetailResponse.backdrop_path,
    genres: movieDetailResponse.genres,
    overview: movieDetailResponse.overview,
    poster_path: movieDetailResponse.poster_path,
    release_date: movieDetailResponse.release_date,
    title: movieDetailResponse.title,
    vote_average: movieDetailResponse.vote_average
  };
};
const url$2 = (id) => `https://api.themoviedb.org/3/movie/${id}?language=ko-KR`;
const options$3 = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${"eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3N2Y0ZmFlZTIxYmQ0M2YwMWY5ZmQ1ZDlkNjY1M2EyNyIsIm5iZiI6MTc0MjI3NDc2Ni43MDEsInN1YiI6IjY3ZDkwMGNlMGFmNjIyNThhOTM2NGRkOCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.ModchKnwSChKrlLlxvrvG4WdY6TtJoqW65DmX_o98b0"}`
  }
};
const getMovieDetail = async (id) => {
  const response = await fetch(url$2(id), options$3);
  if (!response.ok) {
    throw new Error("Failed to fetch movie detail");
  }
  const data = await response.json();
  return mapToMovieDetail(data);
};
const MoviePost = (movie) => {
  const moviePost = document.createElement("li");
  const movieImgPath = movie.poster_path ? `https://media.themoviedb.org/t/p/w440_and_h660_face${movie.poster_path}` : "images/nullImage.png";
  moviePost.innerHTML = /*html*/
  `
    <div class="item" id=${movie.id}>
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
const RATE_TEXT = {
  2: "최악이에요",
  4: "별로에요",
  6: "보통이에요",
  8: "재미있어요",
  10: "명작이에요",
  0: "평가해주세요"
};
function getRateText(rate) {
  return `${RATE_TEXT[rate]} `;
}
function getRateScore(rate) {
  return `(${rate}/10)`;
}
const localStorageHandler = {
  get: (key) => {
    return localStorage.getItem(key);
  },
  set: (key, value) => {
    localStorage.setItem(key, value);
  }
};
const RATE_STARS = [2, 4, 6, 8, 10];
const MyRate = (id) => {
  let userRate = Number(localStorageHandler.get(id)) ?? 0;
  return (
    /*html*/
    `
  <h3 class="my-rate-title">내 별점</h3>
  <div class="rate-display">
  <span class="rate-stars">
    ${RATE_STARS.map((rate) => {
      return (
        /*html*/
        `
      <input type="radio" name="rate" id="rate${rate}" value="${rate}" class="star-icon-radio" />
      <label for="rate${rate}">
        <img class="star-icon" src="images/star_${userRate >= rate ? "filled" : "empty"}.png" />
      </label>
    `
      );
    }).join("")}
    </span>
    <p class="rate-text">
      <span class="rate-text-description">${getRateText(userRate)}</span>
      <span class="rate-score">${getRateScore(userRate)}</span>
    </p>
  </div>
  `
  );
};
function closeModal() {
  const modalBackground = document.querySelector(".modal-background");
  const $wrap = document.querySelector("#wrap");
  if (!modalBackground) return;
  document.body.classList.remove("modal-open");
  $wrap == null ? void 0 : $wrap.removeChild(modalBackground);
}
function preventScrollWhenModalOpen() {
  document.body.classList.add("modal-open");
}
function updateMyRateStar(newRate) {
  const stars = document.querySelectorAll(
    ".star-icon"
  );
  if (!stars) return;
  stars.forEach((star, index) => {
    const rate = (index + 1) * 2;
    star.src = `images/star_${rate <= newRate ? "filled" : "empty"}.png`;
  });
}
const updateMyRateText = (rate) => {
  const rateTextDescription = document.querySelector(".rate-text-description");
  const rateTextScore = document.querySelector(".rate-score");
  if (!rateTextDescription || !rateTextScore) return;
  rateTextDescription.textContent = getRateText(rate);
  rateTextScore.textContent = getRateScore(rate);
};
const handleRateChange = (event, id) => {
  const target = event.target;
  if (target.type === "radio") {
    const userRate = Number(target.value);
    updateMyRateStar(userRate);
    updateMyRateText(userRate);
    localStorageHandler.set(id, userRate.toString());
  }
};
const Modal = (movieDetail) => {
  const modalBackground = document.createElement("div");
  modalBackground.classList.add("modal-background", "active");
  modalBackground.id = "modalBackground";
  const releaseDate = movieDetail.release_date.split("-")[0];
  const genres = movieDetail.genres.map((genre) => genre.name).join(", ");
  modalBackground.innerHTML = /*html*/
  `
      <div class="modal">
        <button class="close-modal" id="closeModal">
          <img src="images/modal_button_close.png" />
        </button>
        <div class="modal-container">
          <div class="modal-image">
            <img
              src="https://image.tmdb.org/t/p/original/${movieDetail.poster_path}"
            />
          </div>
          <div class="modal-description">
            <section class="modal-description-header">
              <h2 class="modal-title">${movieDetail.title}</h2>
              <p class="category">
                ${releaseDate} · ${genres}
              </p>
              <p class="modal-rate">
                <span class="modal-rate-average-text">평균</span>
                <img src="./images/star_filled.png" class="modal-star" />
                <span class="modal-rate-text">${movieDetail.vote_average.toFixed(
    1
  )}</span>
              </p>
            </section>
            <hr />            
            <section class="my-rate-wrapper">
              ${MyRate(movieDetail.id.toString())}
            </section>            
            <hr />
            <div class="detail-container">
              <h3 class="detail-title">줄거리</h3>
              <p class="detail">
                ${movieDetail.overview}
              </p>
            </div>
          </div>
        </div>
      </div>
  `;
  const closeModalButton = modalBackground.querySelector("#closeModal");
  closeModalButton == null ? void 0 : closeModalButton.addEventListener("click", () => {
    closeModal();
  });
  modalBackground.addEventListener("click", (e) => {
    if (e.target === modalBackground) {
      closeModal();
    }
  });
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeModal();
    }
  });
  const rateStarContainer = modalBackground.querySelector(".rate-display");
  rateStarContainer == null ? void 0 : rateStarContainer.addEventListener("change", (e) => {
    handleRateChange(e, movieDetail.id.toString());
  });
  setTimeout(() => {
    preventScrollWhenModalOpen();
  }, 0);
  return modalBackground;
};
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
    const moviePost = MoviePost(movie);
    const $wrap = document.querySelector("#wrap");
    moviePost.addEventListener("click", async () => {
      const movieDetail = await getMovieDetail(movie.id);
      $wrap == null ? void 0 : $wrap.appendChild(Modal(movieDetail));
    });
    fragment.appendChild(moviePost);
  });
  $movieList.appendChild(fragment);
}
function disableHeaderImage() {
  const $overlay = document.querySelector(".overlay");
  $overlay == null ? void 0 : $overlay.classList.add("disabled");
  const $topRatedMovie = document.querySelector(".top-rated-movie");
  $topRatedMovie == null ? void 0 : $topRatedMovie.classList.add("disabled");
  const $backgroundContainer = document.querySelector(".background-container");
  $backgroundContainer == null ? void 0 : $backgroundContainer.classList.add("background-container-disabled");
}
function disableMoreButton(totalPages, currentPage, movieList) {
  const $moreMoviesButton = document.getElementById("more-movies-button");
  if (totalPages === currentPage || movieList.length < 20) {
    $moreMoviesButton == null ? void 0 : $moreMoviesButton.classList.add("disabled");
  }
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
function updateSearchPageUI(searchedMovies, searchQuery, { pageNum, totalPages }) {
  const $thumbnailList = document.querySelector(
    ".thumbnail-list"
  );
  const $movieListTitle = document.querySelector(".movie-list-title");
  if (!$thumbnailList || !$movieListTitle) return;
  $thumbnailList.innerHTML = "";
  showSkeletons($thumbnailList);
  $movieListTitle.textContent = `"${searchQuery}" 검색 결과`;
  $thumbnailList.innerHTML = "";
  addMoviePost(searchedMovies, $thumbnailList);
  disableHeaderImage();
  disableMoreButton(totalPages, pageNum, searchedMovies);
}
const url$1 = (query, page) => `https://api.themoviedb.org/3/search/movie?query=${query}&include_adult=true&language=ko-KR&page=${page}`;
const options$2 = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${"eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3N2Y0ZmFlZTIxYmQ0M2YwMWY5ZmQ1ZDlkNjY1M2EyNyIsIm5iZiI6MTc0MjI3NDc2Ni43MDEsInN1YiI6IjY3ZDkwMGNlMGFmNjIyNThhOTM2NGRkOCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.ModchKnwSChKrlLlxvrvG4WdY6TtJoqW65DmX_o98b0"}`
  }
};
const getSearchedPost = async (query, page) => {
  const response = await fetch(url$1(query, page), options$2);
  if (!response.ok) {
    throw new Error("Failed to fetch searched post");
  }
  const data = await response.json();
  return mapToMovieList(data);
};
const getQueryParam = (url2) => {
  const params = new URLSearchParams(url2.search);
  const query = params.get("query") ?? "";
  return query;
};
const url = (page) => `https://api.themoviedb.org/3/movie/popular?language=ko-KR&page=${page}`;
const options$1 = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${"eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3N2Y0ZmFlZTIxYmQ0M2YwMWY5ZmQ1ZDlkNjY1M2EyNyIsIm5iZiI6MTc0MjI3NDc2Ni43MDEsInN1YiI6IjY3ZDkwMGNlMGFmNjIyNThhOTM2NGRkOCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.ModchKnwSChKrlLlxvrvG4WdY6TtJoqW65DmX_o98b0"}`
  }
};
const getMovieList = async ({
  page
}) => {
  const response = await fetch(url(page), options$1);
  if (!response.ok) {
    throw new Error("Failed to fetch movie list");
  }
  const data = await response.json();
  return mapToMovieList(data);
};
async function getCurrentMovieList(page, query) {
  try {
    if (query) {
      return await getSearchedPost(query, page);
    }
    return await getMovieList({ page });
  } catch (error) {
    showErrorPage();
  }
}
async function addMoreMovies($movieList) {
  try {
    const query = getQueryParam(new URL(window.location.href));
    const nextPage = pageManager.currentPage + 1;
    const movies = await getCurrentMovieList(nextPage, query);
    if (!movies || !movies.results || movies.results.length === 0) {
      throw new Error("영화 데이터를 불러오지 못했습니다.");
    }
    addMoviePost(movies.results, $movieList);
    pageManager.incrementCurrentPage();
    pageManager.setTotalPages(movies.total_pages);
    return {
      success: true
    };
  } catch (error) {
    return { success: false, error };
  }
}
const options = {
  root: null,
  rootMargin: "0px 0px 0px 0px",
  threshold: 0.1
};
let isLoading = false;
const onIntersect = async (entries, observer2) => {
  const entry = entries[0];
  if (entry.isIntersecting && !isLoading) {
    if (pageManager.isLastPage()) {
      observer2.unobserve(entry.target);
      return;
    }
    const $movieList = document.querySelector(".thumbnail-list");
    if (!$movieList) return;
    isLoading = true;
    const result = await addMoreMovies($movieList);
    if (!result.success) {
      showErrorPage();
      observer2.unobserve(entry.target);
      isLoading = false;
      return;
    }
    observer2.unobserve(entry.target);
    updateObserverTarget(observer2);
    isLoading = false;
  }
};
const observer = new IntersectionObserver(onIntersect, options);
function updateObserverTarget(observer2) {
  observer2.disconnect();
  const thumbnails = document.querySelectorAll(".thumbnail");
  if (thumbnails.length === 0) return;
  const lastThumbnail = thumbnails[thumbnails.length - 1];
  observer2.observe(lastThumbnail);
}
function initInfiniteScroll() {
  const $movieContainer = document.getElementById("movie-container");
  if (!$movieContainer) return;
  if (pageManager.isLastPage()) return;
  updateObserverTarget(observer);
}
const searchFormSubmitHandler = async (e) => {
  try {
    pageManager.resetPage();
    const currentPage = pageManager.currentPage;
    const formData = new FormData(e.target);
    const searchQuery = formData.get("search-input");
    setParams(searchQuery);
    const searchedMovies = await getSearchedPost(searchQuery, currentPage);
    pageManager.setTotalPages(searchedMovies.total_pages);
    updateSearchPageUI(searchedMovies.results, searchQuery, {
      pageNum: currentPage,
      totalPages: pageManager.totalPages
    });
    initInfiniteScroll();
  } catch (error) {
    showErrorPage();
  }
};
const Header = (movie) => {
  const $header = document.getElementById("header");
  if (!$header) {
    return;
  }
  $header.innerHTML = /*html*/
  `
    <div class="background-container">
      <div class="overlay" aria-hidden="true">
        <img src="https://media.themoviedb.org/t/p/w440_and_h660_face${movie.backdrop_path}" alt="MovieList" />
      </div>
      <div class="top-rated-container">
        <div class="header-container">
          <a href="/javascript-movie-review/" class="logo">
            <img src="images/logo.png" alt="MovieList" />
          </a>
          ${SearchForm().outerHTML}
        </div>
        <div id=${movie.id} class="top-rated-movie">
          <div class="rate">
            <img src="images/star_empty.png" class="star" />
            <span class="rate-value">${movie.vote_average.toFixed(1)}</span>
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
  const $headerButton = document.querySelector(".primary");
  $headerButton == null ? void 0 : $headerButton.addEventListener("click", async () => {
    const movieDetail = await getMovieDetail(movie.id);
    const $wrap = document.querySelector("#wrap");
    $wrap == null ? void 0 : $wrap.appendChild(Modal(movieDetail));
  });
};
addEventListener("DOMContentLoaded", async () => {
  const $movieList = document.querySelector(".thumbnail-list");
  await initMovieList($movieList);
  initInfiniteScroll();
});
async function initMovieList(movieList) {
  try {
    showSkeletons(movieList);
    const query = getQueryParam(new URL(window.location.href));
    const movies = await getCurrentMovieList(pageManager.currentPage, query);
    if (!movies || !movieList) return;
    pageManager.setTotalPages(movies.total_pages);
    Header(movies.results[0]);
    if (query) {
      updateSearchPageUI(movies.results, query, {
        pageNum: pageManager.currentPage,
        totalPages: pageManager.totalPages
      });
    } else {
      setParams("");
      movieList.innerHTML = "";
      addMoviePost(movies.results, movieList);
    }
  } catch (error) {
    showErrorPage();
  }
}
