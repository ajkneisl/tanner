import Head from "next/head";
import clientPromise from "../lib/mongodb";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styles from "./index.module.css";

export default function Home({ isConnected, message }) {
    const router = useRouter();
    const [text, setText] = useState(15);

    useEffect(() => {
        setInterval(() => {
            setText((num) => {
                if (num - 1 === 0) {
                    router.reload(window.location.pathname);
                }

                return num - 1;
            });
        }, 1000);
    }, []);

    return (
        <div className={styles.container}>
            <h1 className={styles.message}>{message}</h1>
            <p className={styles.connected}>
                {isConnected ? "connected" : "disconnected"} — refreshing in{" "}
                {text} seconds
            </p>
        </div>
    );
}

export async function getServerSideProps(context) {
    try {
        let cli = await clientPromise;

        const count = await cli.db("goblin").collection("message").count();

        const message = await cli
            .db("goblin")
            .collection("message")
            .find({})
            .skip(count - 1)
            .toArray();

        let msgStr = "";
        if (message.length === 0) {
            msgStr = "no message yet.";
        } else {
            msgStr = message[0].message;
        }

        return {
            props: { isConnected: true, message: msgStr },
        };
    } catch (e) {
        console.error(e);
        return {
            props: { isConnected: false, message: "could not connect." },
        };
    }
}
