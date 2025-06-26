// import React, { useState } from 'react';
// import './Home.css';
// import Navbar from '../../Components/NavBar/Navbar';
// import Banner from '../../Components/Banner/Banner';
// import Row from '../../Components/Rows/Row';
// import TrailerModal from "../../Components/Modal/TrailerModal";
// import {  fetchPopularMovies, fetchPopularSeries, fetchMovieDetails, fetchSeriesDetails } from '../../api/tmdb';
// import { fetchYoutubeTrailer } from '../../api/youtube';

// function Home() {
//   const [trailerUrl, setTrailerUrl] = useState(null);
//   const [modalOpen, setModalOpen] = useState(false);
//   const [modalContent, setModalContent] = useState({
//     name: "",
//     overview: "",
//     genres: [],
//     actors: [],
//   });
  

//   const openTrailerModal = async (movie) => {
//     try {
//       const url = await fetchYoutubeTrailer(movie.title || movie.name);

//       // Fetch detailed info based on media type
//       let details = {};
//       if (movie.media_type === 'movie' || movie.title) {
//         details = await fetchMovieDetails(movie.id);
//       } else if (movie.media_type === 'tv' || movie.name) {
//         details = await fetchSeriesDetails(movie.id);
//       }

//       if (url && details) {
//         setTrailerUrl(url);
//         setModalContent(details);
//         setModalOpen(true);
//       } else {
//         alert('Trailer or details not found!');
//       }
//     } catch (error) {
//       console.error('Error fetching trailer or details:', error);
//       alert('Failed to load trailer or details.');
//     }
//   };

//   const closeModal = () => {
//     setModalOpen(false);
//     setTrailerUrl(null);
//     setModalContent({});
//   };



//   return (
//     <div className="home-container">
//       <Navbar />
//       <Banner onPlayTrailer={openTrailerModal} />

//       <Row title="Trending Movies" fetchFunction={fetchPopularMovies} onMovieClick={openTrailerModal} />
//       <Row title="Trending Series" fetchFunction={fetchPopularSeries} onMovieClick={openTrailerModal} />
      

//       <TrailerModal 
//         isOpen={modalOpen} 
//         trailerUrl={trailerUrl} 
//         modalContent={modalContent} 
//         onClose={closeModal} 
//       />
//     </div>
//   );
// }

// export default Home;


import React, { useState } from 'react';
import './Home.css';
import Navbar from '../../Components/NavBar/Navbar';
import Banner from '../../Components/Banner/Banner';
import Row from '../../Components/Rows/Row';
import TrailerModal from "../../Components/Modal/TrailerModal";
import {  fetchPopularMovies, fetchPopularSeries, fetchMovieDetails, fetchSeriesDetails } from '../../api/catalog';

function Home() {
  const [trailerUrl, setTrailerUrl] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({
    name: "",
    overview: "",
    genres: [],
    actors: [],
  });

 const openTrailerModal = async (item) => {
  try {
    const isMovie = item.hasOwnProperty("videoId");
    const id = item.id;

    if (!id) {
      alert("Missing content ID.");
      return;
    }

    const details = isMovie
      ? await fetchMovieDetails(id)
      : await fetchSeriesDetails(id);

    if (!details) {
      alert("Details not found!");
      return;
    }

    if (!details.youtube_video_id) {
      alert("Trailer not available.");
      return;
    }

    setTrailerUrl(`https://www.youtube.com/embed/${details.youtube_video_id}`);
    setModalContent(details);
    setModalOpen(true);
  } catch (error) {
    console.error("Error fetching trailer or details:", error);
    alert("Failed to load trailer or details.");
  }
};


const closeModal = () => {
  setModalOpen(false);
  setTrailerUrl(null);
  setModalContent({});
};

  return (
    <div className="home-container">
      <Navbar />
      <Banner onPlayTrailer={openTrailerModal} />
      <Row title="Trending Movies" fetchFunction={fetchPopularMovies} onMovieClick={openTrailerModal} />
      <Row title="Trending Series" fetchFunction={fetchPopularSeries} onMovieClick={openTrailerModal} />
      <TrailerModal 
        isOpen={modalOpen} 
        trailerUrl={trailerUrl} 
        modalContent={modalContent} 
        onClose={closeModal} 
      />
    </div>
  );
}

export default Home;
