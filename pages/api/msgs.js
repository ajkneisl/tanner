import clientPromise from "../../lib/mongodb";

export default async function handler(req, res) {
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

        res.status(200).json({
            message: message[0].message,
            author: message[0].authorName,
            images,
        })
    } catch (e) {
        console.error(e);
        res.status(400).json({ message: "could not connect." })
    }
}
