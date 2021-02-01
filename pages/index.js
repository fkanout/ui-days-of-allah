import Head from 'next/head'
import styles from '../styles/Home.module.css'
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
const humanizeDuration = require("humanize-duration");

import { useState } from 'react';

const { Client } = require('@elastic/elasticsearch')

export default function Home(data) {
  const [url, setUrl] = useState('');
  const [playingTitle, setPlayingTitle] = useState('');
  const audioPlayerHeader = () => (<div class="font-bold text-xl mb-2" > {playingTitle}</div>)

  return (
    <div class="w-full h-full bg-black mt-16">
      {data.hits.map(({ _source }) => (
        <div class="flex mb-5 align-middle rounded-xl pl-2 pr-2">
          <button class="flex-shrink-0 rounded-full h-10 w-10 mr-4 ml-4 self-center flex items-center justify-center text-green-500 focus:outline-none transition-colors duration-150 border border-green-500 focus:shadow-outline hover:bg-green-500 hover:text-white" onClick={() => {
            setUrl(_source.audioURL)
            setPlayingTitle(_source.title)
          }}>

            <span>▶️</span>

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

export async function getStaticProps(context) {
  const client = new Client({ node: 'https://avnadmin:vlqckywpcje4qj56@es-2a982b4f-fkanout-fa50.aivencloud.com:19906' })
  const data = await client.search({
    index: "days_of_allah",
    body: {
      size: 50,
      "query": {
        "match_all": {
        }
      }
    }
  })

  console.log(data.body.hits);

  return {
    props: data.body.hits, // will be passed to the page component as props
  }
}