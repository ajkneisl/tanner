import Head from 'next/head'
import clientPromise from '../lib/mongodb'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

export default function Home({ isConnected, message }) {
  const router = useRouter()
  useEffect(() => {
    setInterval(() => {
      router.reload(window.location.pathname)
    }, 15000)
  }, [])
  return (
    <div style={{ display: "flex", flexDirection: "center", justifyContent: "center" }}>
      <h1 style={{fontSize: "128px"}}>{message}</h1>
      <p>{isConnected ? "connected" : "disconnected"}</p>
    </div>
  )
}

export async function getServerSideProps(context) {
  try {
    let cli = await clientPromise

    const count = await cli.db("goblin").collection("message").count()

    const message = await cli.db("goblin")
      .collection("message")
      .find({})
      .skip(count - 1)
      .toArray()

    let msgStr = ""
    if (message.length === 0) {
      msgStr = "no message yet."
    } else {
      msgStr = message[0].message
    }

    return {
      props: { isConnected: true, message: msgStr },
    }
  } catch (e) {
    console.error(e)
    return {
      props: { isConnected: false, message: "could not connect." },
    }
  }
}
