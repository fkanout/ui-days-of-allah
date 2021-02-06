import Head from 'next/head'
import styles from '../styles/Home.module.css'
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import ytdl from 'ytdl-core'
function getFirefoxUserAgent() {
  let date = new Date()
  let version = ((date.getFullYear() - 2018) * 4 + Math.floor(date.getMonth() / 4) + 58) + ".0"
  return `Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:${version} Gecko/20100101 Firefox/${version}`
}

const humanizeDuration = require("humanize-duration");

import { useState } from 'react';

// const { Client } = require('@elastic/elasticsearch')

const Home = (data) => {
  const [url, setUrl] = useState('');
  const [playingTitle, setPlayingTitle] = useState('');
  const audioPlayerHeader = () => (<div class="font-bold text-xl mb-2" > {playingTitle}</div>)

  return (
    <div class="w-full h-full bg-black mt-16">
      {data.map(({ _source }) => (
        <div class="flex mb-5 align-middle rounded-xl pl-2 pr-2">
          <button class="flex-shrink-0 rounded-full h-12 w-12 mr-4 ml-4 self-center flex items-center justify-center text-green-500 focus:outline-none transition-colors duration-150 border border-green-500 focus:shadow-outline hover:bg-green-500 hover:text-white" onClick={() => {
            setUrl(_source.audioURL)
            setPlayingTitle(_source.title)
          }}>

            <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABmJLR0QA/wD/AP+gvaeTAAAAjElEQVRIie3UsQ3CMBBGYZtNkNgEJEbJCOzHHCAowgIg6o+CiigoWD6jFHmlJfvd6c5/SguzBTtccEOHHC04++SITaRgjCcOWLUSxHUzIajv5gdBXTcFArhjP/bO19WDwpquOef18LB+GyaIEjxSSl3RjTkMuemaNvtooVFxCq96INh6x3WvRVwv/I0X45q9tZAyZ4sAAAAASUVORK5CYII=" />
          </button>
          <img class="self-center w-12 h-12 rounded mr-3" src={_source.videoThumbnail} />
          <div class="self-center">
            <div class=" text-l text-gray-300">
              {_source.title}
            </div>
            <div class="text-xs text-gray-400">
              {_source.channelName}
            </div>
            <div class="text-xs text-gray-500">
              {(humanizeDuration(_source.lengthSeconds * 1000, { maxDecimalPoints: 2 }))}
            </div>
          </div>


        </div>
      ))}
      <div class="absolute bottom-0 sticky">
        <AudioPlayer
          header={audioPlayerHeader()}
          src={url}
          onPlay={e => console.log("onPlay")}
        // other props here
        />
      </div>
    </div >

  )
}
export default function Channels(data) {
  return (
    <div class="w-full h-full grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 2xl:grid-cols-7 gap-4 bg-white mt-16">
      {data.channels.map(channel => {
        return (
          <div key={channel.channelId}>
            <div>
              {channel.channelName}
            </div>
            <img src={"data:image/jpg;base64, " + channel.avatar} />

          </div>

        )
      })}
    </div>
  )
}

export async function getStaticProps(context) {

  const DEFAULT_HEADERS = {
    // "cookie": "GPS=1; YSC=iHdvZ0PIsb0; VISITOR_INFO1_LIVE=zWvytXlrc1s; PREF=f4=4000000&tz=Europe.Paris",
    "User-Agent": getFirefoxUserAgent(),
    "Accept-Language": "en-US,en;q=0.5"
  }

  const { videoDetails, formats } = await ytdl.getInfo("_6yNpGqPKd8", {
    requestOptions: {
      headers: DEFAULT_HEADERS
    }
  })
  console.log(videoDetails)

  return {
    props: { channels: [] }, // will be passed to the page component as props
  }
}