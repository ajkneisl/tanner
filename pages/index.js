import React, { useEffect, useState } from "react";
import styles from "./index.module.css";

function Home() {
    const [counter, setCounter] = useState(15);
    const [{ message, author, images }, setMessage] = useState({
        message: "loading...",
        author: "loading...",
        images: []
    })

    useEffect(() => {
        const loadMessage = async () => {
            const msg = await fetch("/api/msgs")

            if (!msg.ok) {
                setMessage({ message: "failed to load", author: "failed to load", images: [] })
            } else {
                const json = await msg.json()

                setMessage(json)
            }
        }

        setInterval(() => {
            setCounter((num) => {
                if (num - 1 === 0) {
                    loadMessage()
                    return 15;
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
                        <img className={styles.img} src={str} height="340px" />
                    ))}
                    <h3 className={styles.captionMessage}>{message}</h3>
                </div>
            )}

            <p className={styles.connected}>
                sent by {author} — refreshing in {counter} seconds
            </p>
        </div>
    );
}

export default Home
