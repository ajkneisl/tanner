import Head from "next/head";
import clientPromise from "../lib/mongodb";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styles from "./index.module.css";

export default function Home({ isConnected, message, author, images }) {
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
            <style global jsx>{`
                body {
                    background-color: #171611;
                }

                * {
                    color: white;
                }
            `}</style>
            {!images || images.length === 0 ? (
                <h1 className={styles.largeMessage}>{message}</h1>
            ) : (
                <div className={styles.imagesContainer}>
                    {images.map((str) => (
                        <img className={styles.img} src={str} height="512px" />
                    ))}
                    <h3 className={styles.captionMessage}>{message}</h3>
                </div>
            )}
            <p className={styles.connected}>
                sent by {author} — refreshing in {text} seconds
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

        let images = message[0].images;
        if (images === undefined) images = [];

        return {
            props: {
                isConnected: true,
                message: message[0].message,
                author: message[0].authorName,
                images,
            },
        };
    } catch (e) {
        console.error(e);
        return {
            props: { isConnected: false, message: "could not connect." },
        };
    }
}
