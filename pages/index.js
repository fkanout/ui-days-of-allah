import Head from 'next/head'
import Link from 'next/link'

import styles from '../styles/Home.module.css'

import channels from './api/channels'
import { useState } from 'react';

// require('./node_modules/sql.js/dist/sql-wasm.wasm')


const querystring = require("querystring")
const miniget = require('axios')
const INFO_HOST = 'www.youtube.com';
const INFO_PATH = '/get_video_info';
const VIDEO_EURL = 'https://youtube.googleapis.com/v/';
const jsonClosingChars = /^[)\]}'\s]+/;


// const { Client } = require('@elastic/elasticsearch')


export default function Channels(data) {
  const [db, setDB] = useState();
  // console.log(data)

  return (

    < div
      className="w-full h-full grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 2xl:grid-cols-7 gap-4 bg-white mt-16" >
      {
        data.channels.map(channel => {
          return (
            <Link
              key={channel.channelId}
              href={{
                pathname: '/podcasts/[id]',
                query: { id: channel.channelId },
              }}
            >
              <div >
                <div>

                  {channel.channelName}
                </div>
                <img src={"data:image/jpg;base64, " + channel.avatar} />

              </div>
            </Link>

          )
        })
      }
    </div >
  )
}

export async function getStaticProps(context) {
  return {
    props: { channels }, // will be passed to the page component as props
  }
}