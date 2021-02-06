import { useState } from 'react';
import channels from '../../api/channels'
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import axios from 'axios'
const humanizeDuration = require("humanize-duration");
const initSqlJs = require('sql.js');

const chunk = (chunkSize, array) => {
  return [].concat.apply([],
    array.map(function (elem, i) {
      return i % chunkSize ? [] : [array.slice(i, i + chunkSize)];
    })
  );
};
const getResults = (podcasts, page) => {
  const pages = chunk(20, podcasts)
  console.log(page)
  return pages[page]
}

const Podcasts = (data) => {

  const [page, setPage] = useState(0)
  const [results, setResults] = useState(getResults(data.podcasts.values, page))
  const [url, setUrl] = useState('');
  const [playingTitle, setPlayingTitle] = useState('');
  const audioPlayerHeader = () => (<div className="font-bold text-xl mb-2" > {playingTitle}</div>)
  if (!data.podcasts) {
    return (<h1>No data</h1>)
  }
  return (
    <div className="w-full h-full bg-black mt-16">
      {results.map((podcast) => (
        <div key={podcast[3]} className="flex mb-5 align-middle rounded-xl pl-2 pr-2">
          <button className="flex-shrink-0 rounded-full h-12 w-12 mr-4 ml-4 self-center flex items-center justify-center text-green-500 focus:outline-none transition-colors duration-150 border border-green-500 focus:shadow-outline hover:bg-green-500 hover:text-white"
            onClick={async () => {
              const urlHost = `https://days-of-allah.herokuapp.com/audio/${podcast[3]}`

              const { data: url } = await axios(urlHost);

              setUrl(url)
              setPlayingTitle(podcast[0])
            }}>

            <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABmJLR0QA/wD/AP+gvaeTAAAAjElEQVRIie3UsQ3CMBBGYZtNkNgEJEbJCOzHHCAowgIg6o+CiigoWD6jFHmlJfvd6c5/SguzBTtccEOHHC04++SITaRgjCcOWLUSxHUzIajv5gdBXTcFArhjP/bO19WDwpquOef18LB+GyaIEjxSSl3RjTkMuemaNvtooVFxCq96INh6x3WvRVwv/I0X45q9tZAyZ4sAAAAASUVORK5CYII=" />
          </button>
          <img className="self-center w-12 h-12 rounded mr-3" src={JSON.parse(podcast[1])[0].url} />
          <div className="self-center">
            <div className=" text-l text-gray-300">
              {podcast[0]}
            </div>
            <div className="text-xs text-gray-400">
              Published {podcast[5]}
            </div>
            <div className="text-xs text-gray-500">
              {(humanizeDuration(podcast[4] * 1000, { maxDecimalPoints: 2 }))}
            </div>
          </div>


        </div>
      ))}
      <div onClick={() => {
        setResults([...results, ...getResults(data.podcasts.values, page + 1)])
        setPage(page + 1)
      }} className={"mb-10 mt-10 "}>
        <h1 className={"text-red-400 justify-center text-2xl"}>Load more</h1>

      </div>

      <div className="absolute bottom-0 sticky">
        <AudioPlayer
          autoPlay
          header={audioPlayerHeader()}
          src={url}
          onPlay={e => console.log("onPlay")}
        // other props here
        />
      </div>
    </div >

  )
}

export async function getStaticPaths() {
  // Call an external API endpoint to get posts



  // Get the paths we want to pre-render based on posts
  const paths = channels.map((channel) => ({
    params: { id: channel.channelId },
  }))

  // We'll pre-render only these paths at build time.
  // { fallback: false } means other routes should 404.
  return { paths, fallback: false }
}


export async function getStaticProps(context) {
  const SQL = await initSqlJs();
  console.log(process.env.NODE_ENV)
  let dbURL = "https://brave-newton-2b639a.netlify.app/db/days_of_allah.db"
  if (process.env.NODE_ENV === "development") dbURL = "http://localhost:3000/db/days_of_allah.db"

  const dataPromise = fetch(dbURL).then(res => res.arrayBuffer());
  const [buf] = await Promise.all([dataPromise])

  const db = new SQL.Database(new Uint8Array(buf));
  const podcasts = db.exec(`SELECT * FROM videos WHERE (channelId)  = "${context.params.id}" ORDER BY date(publishDate) DESC`)[0];

  return {
    props: { podcasts }, // will be passed to the page component as props
  }


}

export default Podcasts